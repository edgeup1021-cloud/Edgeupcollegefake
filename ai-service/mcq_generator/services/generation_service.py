from sentence_transformers import SentenceTransformer
import os
import time
import uuid
import random
from ..apps import Models
import json
import re  
import torch 
from ..agents.reflector_agent import reflection_agent
from ..agents.selector_agent import selector_agent
import numpy as np
from typing import List, Dict, Optional, Any, Tuple
from ..connections.qdrant_client import QdrantService
from ..connections.neo4j_client import Neo4jClient
from PyPDF2 import PdfReader
from ..serializers import QuestionGenerationParams, SourceConfig
from ..config import Config
from transformers import AlbertTokenizer ,AutoModel
from .services import extract_json_from_response
from ..utils.loggers import setup_logger

logger = setup_logger("django_logger")

from huggingface_hub import login

# Hugging Face token from environment variable
huggingface_token = os.getenv("HUGGINGFACE_TOKEN")
if huggingface_token:
    login(token=huggingface_token)
else:
    logger.warning("HUGGINGFACE_TOKEN not set in environment variables. Hugging Face login skipped.")

SIMILAR_MODEL = Config.SIMILAR_MODEL
model_name = os.getenv('INDIC_BERT_MODEL', 'ai4bharat/indic-bert')

class QuestionGeneratorService:
    """Service for generating questions using AI models and vector search."""
    
    _embedder_model = None
    _tokenizer = None
    
    def __init__(self):
        self.qdrant_service = QdrantService()
        self.neo4j_client = Neo4jClient()
        self.tokenizer = None
        self.model = None
        self.embedder = None
        
        # Initialize class-level embedder if not already done
        if QuestionGeneratorService._embedder_model is None:
                logger.info("Loading IndicBERT model...")
                QuestionGeneratorService._tokenizer = AlbertTokenizer.from_pretrained(model_name)
                QuestionGeneratorService._embedder_model = AutoModel.from_pretrained(model_name)
                QuestionGeneratorService._embedder_model.eval()

        self.tokenizer = QuestionGeneratorService._tokenizer
        self.model = QuestionGeneratorService._embedder_model
         
        

    def __del__(self):
        """Cleanup Neo4j connection when service is destroyed."""
        if hasattr(self, 'neo4j_client'):
            self.neo4j_client.close()
    

    def get_embedding(self, text: str) -> list:

        try:
            # Ensure truncation and limit to model's max length (512)
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                padding="max_length",
                max_length=512
            )

            with torch.no_grad():
                outputs = self.model(**inputs)
                # outputs.last_hidden_state: [batch_size, seq_len, hidden_size]
                embeddings = outputs.last_hidden_state.mean(dim=1)
                vector = embeddings[0].cpu().numpy().tolist()

            # Validate vector dimension
            if len(vector) == 0:
                raise ValueError("Generated empty embedding vector.")

            return vector

        except Exception as e:
            logger.error(f"Failed to generate embedding for text: {str(e)}")
            # Return a zero vector to avoid breaking Qdrant insert
            return [0.0] * self.model.config.hidden_size

    def __del__(self):
        """Cleanup Neo4j connection when service is destroyed."""
        if hasattr(self, 'neo4j_client'):
            self.neo4j_client.close()

    def validate_hierarchy_and_get_collection(self, subject: str, topic: str,
                                            course_type: str) -> Optional[str]:
        try:
            collection_name = self.neo4j_client.validate_and_get_collection(
                subject=subject.upper(),
                topic=topic.upper(),
                Course_type=course_type
            )

            if collection_name:
                logger.info(f"Validated hierarchy: {subject} -> {topic}")
                return collection_name
            else:
                logger.warning(f"Invalid hierarchy: {subject} -> {topic} not found in Neo4j")
                name = f"{course_type}_{subject}_{topic}"
                collection_name = name.lower().replace(" ", "_").replace("-", "_")
                sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', collection_name).lower()
                return sanitized_name

        except Exception as e:
            logger.error(f"Error validating hierarchy in Neo4j: {e}")
            return None

    def get_all_chunks_by_topic(self, collection_name: str, subject: str, subtopic: Optional[str],
                               topic: str, max_chunks: int = Config.DEFAULT_MAX_CHUNKS,
                               exam_type: str = "college",
                               sub_exam_type: Optional[str] = None) -> List[Dict]:

        try:
            logger.info(f"Retrieving chunks for topic: '{topic}' in subject: '{subject}'")
            # Removed UPSC/TNPSC specific handling - use college defaults for all
            # College system uses consistent chunk retrieval parameters
            chunks = self.qdrant_service.get_chunks_by_topic(
                collection_name=collection_name,
                subject=subject,
                topic=topic,
                subtopic=subtopic if subtopic else None,
                max_chunks=max_chunks,
                exam_type=exam_type
            )
                
            
            logger.info(f"Retrieved {len(chunks)} chunks for topic '{topic}' in subject '{subject}'")
            if not chunks:
                logger.warning(f"No chunks found for topic '{topic}' in subject '{subject}' in collection '{collection_name}'") 
            
            return chunks

        except Exception as e:
            logger.error(f"Failed to retrieve chunks by topic: {e}")
            return []

    def get_relevant_chunks_by_similarity(self, chunks_data: List[Dict],
                                        subtopic_query: List[str],
                                        max_chunks: int = 10,
                                        min_similarity: float = Config.DEFAULT_MIN_SIMILARITY,
                                        window_size: int = Config.DEFAULT_WINDOW_SIZE) -> List[Dict]:
        try:
            current_data = chunks_data

            
            query_embedding = self.embedder.encode(subtopic_query).tolist()

                # Compute similarity for current data
            scored_chunks = []
            for chunk in current_data:
                    chunk_embedding = chunk.get("vector")
                    if chunk_embedding:
                        sim = self.qdrant_service.compute_cosine_similarity(query_embedding, chunk_embedding)
                        if sim >= min_similarity:
                            chunk_copy = chunk.copy()
                            chunk_copy["score"] = sim
                            scored_chunks.append(chunk_copy)

                # Select top matches
            scored_chunks.sort(key=lambda x: x["score"], reverse=True)
            top_chunks = scored_chunks[:max_chunks]

                # Add context chunks
            matched_indexes = set()
            for chunk in top_chunks:
                    index = chunk.get("Index")
                    if index is not None:
                        for i in range(index - window_size, index + window_size + 1):
                            matched_indexes.add(i)

                # Build next current_data by filtering original chunks_data
            index_to_chunk = {chunk["Index"]: chunk for chunk in chunks_data if "Index" in chunk}
            next_data = []
            seen = set()
            for idx in matched_indexes:
                    if idx in index_to_chunk and idx not in seen:
                        seen.add(idx)
                        next_data.append(index_to_chunk[idx])

            current_data = next_data
                

            return sorted(current_data, key=lambda x: x.get("Index", 0))

        except Exception as e:
            logger.error(f"Cascading chunk filtering failed: {e}")
            return []

    def get_offline_content(self, params: QuestionGenerationParams, source_config: SourceConfig) -> str:

       

        # Validate hierarchy
        validated_collection = self.validate_hierarchy_and_get_collection(
            params.subject, params.topic, params.exam_type
        )
        if not validated_collection:
            logger.error(f"Invalid hierarchy: {params.subject} -> {params.topic}")
            return ""

        # Get collection name
    
        collection_name = f"{params.vendor}_{params.exam_type}_{params.subject}_{params.topic}".lower().replace(" ", "_").replace("-", "_")
        sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', collection_name).lower()

        # Check collection info
        try:
            collection_info = self.qdrant_service.get_collection_info(sanitized_name)
            if collection_info['points_count'] == 0:
                logger.warning(f"No data found in collection '{collection_name}'")
                return ""
        except Exception as e:
            logger.error(f"Failed to check collection info for '{collection_name}': {e}")
            return ""
        logger.info(f"sanitized_name {sanitized_name}")

        # Retrieve chunks
        if params.exam_type.lower()=="upsc":
            topic_chunks = self.get_all_chunks_by_topic(
                collection_name=sanitized_name,
                subject=params.subject,
                topic=params.topic,
                subtopic=params.subtopic,
                exam_type=params.exam_type,
                max_chunks=50
                # VLP and priority flags removed - not needed for college system
            )
        elif params.exam_type.lower()=="tnpsc":
            topic_chunks = self.get_all_chunks_by_topic(
                collection_name=sanitized_name,
                subject=params.subject,
                topic=params.topic,
                exam_type=params.exam_type,
                subtopic=params.subtopic,
                max_chunks=50,
                sub_exam_type=params.sub_exam_type
            )

        if not topic_chunks:
            return ""

        # Filter by subtopic if provided
        relevant_chunks = topic_chunks
        # if params.subtopic and params.exam_type.lower() == "upsc":
        #     relevant_chunks = self.get_relevant_chunks_by_similarity(
        #         chunks_data=topic_chunks,
        #         subtopic_query=params.subtopic,
        #         max_chunks=10,
        #         min_similarity=0.3
        #     )
            
        #     if not relevant_chunks:
        #         logger.warning(f"No relevant chunks found for subtopic, using general chunks")
        #         relevant_chunks = topic_chunks

        # Combine random chunks
        return self._combine_random_chunks(relevant_chunks)

    def _combine_random_chunks(self, chunks: List[Dict]) -> dict:
        """Combine random chunks up to a character limit and include metadata."""
        combined_data = {"combined_content": "", "page_numbers": [], "source_files": []}
        if not chunks:
            return combined_data

        num_chunks_to_select = min(Config.DEFAULT_NUM_CHUNKS_TO_SELECT, len(chunks))
        random_indices = random.sample(range(len(chunks)), k=num_chunks_to_select)

        for idx in random_indices:
            chunk = chunks[idx]
            chunk_content = chunk.get('content', "")

            current_len = len(combined_data["combined_content"])
            max_len = Config.DEFAULT_MAX_CHARS

            if current_len + len(chunk_content) > max_len:
                remaining = max_len - current_len
                if remaining > 100:
                    combined_data["combined_content"] += chunk_content[:remaining] + "..."
                    combined_data["page_numbers"].append(chunk.get("page_number", ""))
                    combined_data["source_files"].append(chunk.get("source_file", ""))
                break

            combined_data["combined_content"] += (chunk_content + "\n\n")
            combined_data["page_numbers"].append(chunk.get("page_number", ""))
            combined_data["source_files"].append(chunk.get("source_file", ""))

        return combined_data

    def generate_questions_flexible(self, chunks_data: str, params: QuestionGenerationParams) -> str:
     
        if not chunks_data:
            logger.warning("No relevant chunks provided for question generation.")
            

        # Prepare focus instructions
        if params.subtopic:
            focus_instruction = f"specifically focused on '{params.subtopic}'"
            subtopic_context = f"Focus questions specifically on '{params.subtopic}' concepts and details within '{params.topic}'."
            question_focus = f"about {params.subtopic}"
            explanation_context = f"relating to {params.subtopic}"
        else:
            focus_instruction = f"covering the broad topic of '{params.topic}'"
            subtopic_context = f"Cover various aspects and concepts within the topic '{params.topic}'."
            question_focus = f"about {params.topic}"
            explanation_context = f"relating to {params.topic}"

        # Generate questions with retries
        # Map exam_type to education_level for backward compatibility
        education_level = getattr(params, "education_level", "undergraduate")
        if not education_level and hasattr(params, "exam_type"):
            education_map = {
                "college": "undergraduate",
                "upsc": "undergraduate",  # Treat old UPSC as undergrad
                "tnpsc": "undergraduate"
            }
            education_level = education_map.get(params.exam_type.lower(), "undergraduate")

        for attempt in range(Config.MAX_RETRIES_GENERATION):
            try:
                if params.question_type == "mcq":
                    if params.mcq_type and params.mcq_type != "None":
                        question_type = VQuestionTypes.objects.get(type=int(params.mcq_type)).details
                    else:
                        question_type = 'general'

                    base_prompt = Config.mcq_prompt.format(
                        User_prompt=params.user_prompt or "",
                        num_questions=params.num_questions,
                        subject=params.subject,
                        education_level=education_level,
                        topic=params.topic,
                        subtopic=params.subtopic,
                        focus_instruction=focus_instruction,
                        question_focus=question_focus,
                        explanation_context=explanation_context,
                        combined_content=chunks_data,
                        subtopic_context=subtopic_context,
                        topic_id=params.topic_id,
                        question_type=question_type,
                        mcq_type=params.mcq_type
                    )
                else:
                    base_prompt = Config.descriptive_prompt.format(
                        User_prompt=params.user_prompt or "",
                        education_level=education_level,
                        num_questions=params.num_questions,
                        subject=params.subject,
                        topic=params.topic,
                        subtopic=params.subtopic,
                        focus_instruction=focus_instruction,
                        question_focus=question_focus,
                        explanation_context=explanation_context,
                        combined_content=chunks_data,
                        subtopic_context=subtopic_context,
                        topic_id=params.topic_id,
                        question_type=None
                    )

                logger.info(f"Generated prompt for Gemini (attempt {attempt + 1} {base_prompt})")

                response = Models.model.generate_content(base_prompt)
                response_text = response.text.strip()
                logger.info(f"Generated {params.num_questions} questions for {params.subject} - {params.topic}")

                return response_text

            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower():
                    retry_delay = (2 ** attempt) + 5
                    logger.warning(f"Quota exceeded, retrying in {retry_delay}s (attempt {attempt + 1}/{Config.MAX_RETRIES_GENERATION})")
                    time.sleep(retry_delay)
                else:
                    logger.error(f"Error generating questions: {e}")
                    return f"Error generating questions: {str(e)}"

        logger.error("Max retries reached for question generation.")
        return "No questions generated due to quota limits."


    def search_similar_content(self, query: str, collection_name: Optional[str] = None, 
                             max_chunks: int = 10, min_similarity: float = 0.6) -> Dict:
        try:
            if collection_name:
                collections_to_search = [collection_name]
            else:
                # Get all available collections
                all_collections = self.qdrant_service.list_collections()
                collections_to_search = [col['name'] for col in all_collections]

            all_results = []
            
            for collection in collections_to_search:
                try:
                    chunks = self.qdrant_service.search_similar_chunks(
                        collection_name=collection,
                        query=query,
                        max_chunks=max_chunks,
                        min_similarity=min_similarity
                    )
                    
                    for chunk in chunks:
                        chunk['collection'] = collection
                        all_results.append(chunk)
                        
                except Exception as e:
                    logger.warning(f"Failed to search in collection {collection}: {e}")
                    continue

            # Sort all results by similarity score
            all_results.sort(key=lambda x: x.get('score', 0), reverse=True)
            all_results = all_results[:max_chunks]

            return {
                'query': query,
                'total_results': len(all_results),
                'chunks': all_results,
                'collections_searched': collections_to_search
            }

        except Exception as e:
            logger.error(f"Error in search_similar_content: {e}")
            return {
                'query': query,
                'total_results': 0,
                'chunks': [],
                'error': str(e)
            }

    def list_collections(self) -> List[Dict]:
     
        try:
            return self.qdrant_service.list_collections()
        except Exception as e:
            logger.error(f"Failed to list collections: {e}")
            return []


        