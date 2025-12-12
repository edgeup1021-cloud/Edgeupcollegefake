# services/qdrant_client.py
import uuid
import time
import re
from typing import List, Dict, Optional, Any
from django.conf import settings

import numpy as np
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct, Filter, 
    FieldCondition, MatchValue
)
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os 
load_dotenv()
from ..utils.loggers import setup_logger

logger = setup_logger("django_logger")
class QdrantService:
    def __init__(self):
        """Initialize Qdrant client and sentence transformer."""
        try:
            # Initialize Qdrant client
            self.client = QdrantClient(
                host=os.getenv('QDRANT_HOST', 'localhost'),
                port=int(os.getenv( 'QDRANT_PORT', 6333)),
                timeout=int(os.getenv( 'QDRANT_TIMEOUT', 60))
            )
            
            # Initialize sentence transformer for embeddings
            model_name = os.getenv('SIMILAR_MODEL', 'all-MiniLM-L6-v2')
            self.embedder = SentenceTransformer(model_name)
            
            logger.info("Qdrant client and sentence transformer initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Qdrant service: {e}")
            raise

    def create_collection_if_needed(self, collection_name: str) -> Optional[str]:
        """
        Creates a Qdrant collection if it does not already exist.
        Sanitizes the collection name to be Qdrant-compatible.

        Args:
            collection_name (str): The desired name for the collection.

        Returns:
            str: The sanitized collection name, or None if creation fails.
        """
        try:
            # Sanitize collection name: replace non-alphanumeric with underscores, convert to lowercase
            sanitized_name = re.sub(r'[^a-zA-Z0-9_-]', '_', collection_name).lower()

            if not self.client.collection_exists(sanitized_name):
                self.client.create_collection(
                    collection_name=sanitized_name,
                    vectors_config=VectorParams(
                        size=self.embedder.get_sentence_embedding_dimension(), 
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection: {sanitized_name}")
            else:
                logger.info(f"Collection '{sanitized_name}' already exists")
            return sanitized_name
        except Exception as e:
            logger.error(f"Failed to create collection '{collection_name}': {e}")
            return None

    def store_chunk_in_qdrant(self, subject: str, topic: str, chunk: str, collection_name: str,
                               pdf_filename: str, subtopic: Optional[str] = None,
                               university: Optional[str] = None,
                               course: Optional[str] = None, department: Optional[str] = None,
                               semester: Optional[int] = None, paper_type: Optional[str] = None,
                               page_range: Optional[str] = None) -> Optional[str]:
        """
        Store a PDF chunk in Qdrant with college hierarchy metadata.

        Args:
            subject: Subject name
            topic: Topic name
            chunk: Text content to store
            collection_name: Qdrant collection name
            pdf_filename: Source PDF filename
            subtopic: Subtopic name (optional, for more specific content filtering)
            university: University name (e.g., "Anna University")
            course: Course code (e.g., "bcom", "ba_english")
            department: Department name (e.g., "BAF", "Accounting")
            semester: Semester number (1-6)
            paper_type: Paper type ("Core" or "Elective")
            page_range: Page range (e.g., "45-67")

        Returns:
            Chunk ID if successful, None otherwise
        """
        try:
            logger.info(f"Attempting to store chunk in collection: {collection_name}")
            logger.info(f"Subject: {subject}, Topic: {topic}, Subtopic: {subtopic}")
            logger.info(f"College: university={university}, course={course}, semester={semester}")
            logger.info(f"Chunk length: {len(chunk)} characters")

            chunk_id = str(uuid.uuid4())
            vector = self.embedder.encode(chunk).tolist()
            logger.info(f"Generated vector of length: {len(vector)}")

            # Get the current count for Index field
            try:
                count_response = self.client.count(collection_name=collection_name, exact=True)
                index = count_response.count
                logger.info(f"Current collection count: {index}")
            except Exception as e:
                logger.warning(f"Failed to get count for collection {collection_name}: {e}")
                index = 0

            # Build payload with college hierarchy
            payload = {
                "type": "book",
                "subject": subject.upper(),
                "topic": self.normalize_subtopic(topic),  # Normalize topic for consistent filtering
                "subtopic": self.normalize_subtopic(subtopic) if subtopic else None,  # Normalize subtopic
                "content": chunk,
                "source_file": pdf_filename,
                "timestamp": time.time(),
                "chunk_length": len(chunk),
                "word_count": len(chunk.split()),
                "Index": index,
                # College Hierarchy
                "university": university or "unknown",
                "course": course or "unknown",
                "department": department or "unknown",
                "semester": semester if semester is not None else 0,
                "paper_type": paper_type or "unknown",
                "page_range": page_range or "unknown"
            }

            point = PointStruct(
                id=chunk_id,
                vector=vector,
                payload=payload
            )

            logger.info(f"Attempting to upsert point with ID: {chunk_id}")
            self.client.upsert(collection_name=collection_name, points=[point])
            logger.info(f"Successfully stored chunk in Qdrant: {chunk_id}")
            return chunk_id
        except Exception as e:
            logger.error(f"Failed to store chunk in Qdrant: {e}")
            logger.error(f"Collection: {collection_name}, Subject: {subject}, Topic: {topic}")
            return None

    def store_question(self, subject: str, topic: str, subtopic: str, 
                      question: str, collection_name: str) -> bool:
        """
        Stores a generated question in the vector database along with its metadata.

        Args:
            subject (str): The subject of the question.
            topic (str): The main topic of the question.
            subtopic (str): The specific subtopic the question relates to.
            question (str): The text of the generated question.
            collection_name (str): The name of the Qdrant collection.

        Returns:
            bool: True if the question was successfully stored, False otherwise.
        """
        try:
            embedding = self.embedder.encode(question).tolist()
            point = PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "type": "question",
                    "subject": subject,
                    "topic": topic,
                    "subtopic": subtopic,
                    "content": question,
                    "path": f"{subject}-{topic}-generatedquestion",  # extra field if needed
                    "timestamp": time.time()
                }
            )
            self.client.upsert(collection_name=collection_name, points=[point])
            return True
        except Exception as e:
            logger.error(f"Failed to store question: {e}")
            return False
        

    def normalize_subtopic(self,sub):
    
        if not isinstance(sub, str):
            return None
        sub = re.sub(r'[^a-zA-Z0-9]', '', sub).lower()
        logger.info(f"Normalized subtopic: {sub}")
        # Replace all non-alphanumeric characters with an empty string
        return sub


    def get_chunks_by_topic(self, collection_name: str, subject: str, topic: str,
                            subtopic: Optional[str] = None, max_chunks: int = 20,
                            university: Optional[str] = None, course: Optional[str] = None,
                            semester: Optional[int] = None) -> List[Dict]:
        """
        Retrieves chunks for a given subject and topic from a Qdrant collection.
        Simplified for college system - removed exam-specific filtering.

        Args:
            collection_name: Name of the Qdrant collection
            subject: Subject to filter by
            topic: Topic to filter by
            subtopic: Optional subtopic filter
            max_chunks: Maximum number of chunks to retrieve
            university: Optional university filter
            course: Optional course filter
            semester: Optional semester filter

        Returns:
            List of chunks with content, metadata, and vectors
        """
        try:
            logger.info(f"Searching for chunks in collection: {collection_name}")
            logger.info(f"Filters - subject: {subject}, topic: {topic}, subtopic: {subtopic}")

            # Build filter conditions (simplified - no priority/VLP flags)
            # Note: Data is stored with subject.upper() BUT topic and subtopic are normalized (lowercase, no spaces)
            # Based on debug logs, topic is stored as lowercase without spaces: 'electricitycompaniesaccountingstandards'
            topic_normalized = self.normalize_subtopic(topic)  # Remove non-alphanumeric, lowercase

            must = [
                {"key": "subject", "match": {"value": subject.upper()}},
                {"key": "topic", "match": {"value": topic_normalized}},
                {"key": "type", "match": {"value": "book"}}
            ]

            # Add subtopic filter if provided (for more specific content retrieval)
            if subtopic:
                subtopic_normalized = self.normalize_subtopic(subtopic)
                must.append({"key": "subtopic", "match": {"value": subtopic_normalized}})
                logger.info(f"Filtering by subtopic: {subtopic} (normalized: {subtopic_normalized})")

            # DO NOT add hierarchy filters (university, course, semester):
            # - Gradio doesn't use them and retrieves chunks successfully
            # - They cause false negatives when stored values don't match request values
            # - Subject + topic + subtopic filtering is sufficient for content retrieval

            # First, let's see what's actually in the collection (debug)
            try:
                sample_result = self.client.scroll(
                    collection_name=collection_name,
                    limit=1,
                    with_payload=True,
                    with_vectors=False
                )
                if sample_result[0]:
                    sample_point = sample_result[0][0]
                    logger.info(f"Sample point from collection:")
                    logger.info(f"  - stored subject: '{sample_point.payload.get('subject', 'N/A')}'")
                    logger.info(f"  - stored topic: '{sample_point.payload.get('topic', 'N/A')}'")
                    logger.info(f"  - stored subtopic: '{sample_point.payload.get('subtopic', 'N/A')}'")
                    logger.info(f"  - stored type: '{sample_point.payload.get('type', 'N/A')}'")
            except Exception as e:
                logger.warning(f"Could not fetch sample point: {e}")

            search_result = self.client.scroll(
                collection_name=collection_name,
                scroll_filter={"must": must},
                limit=max_chunks,
                with_vectors=True
            )

            chunks = []
            for point in search_result[0]:
                chunk = {
                    'id': point.id,
                    'content': point.payload.get('content', ''),
                    'subject': point.payload.get('subject', ''),
                    'topic': point.payload.get('topic', ''),
                    'subtopic': point.payload.get('subtopic', ''),
                    'source_file': point.payload.get('source_file', ''),
                    'page_number': point.payload.get('page_number', ''),
                    'chunk_length': len(point.payload.get('content', '')),
                    'Index': point.payload.get('Index', ''),
                    'vector': point.vector,
                    # College hierarchy metadata
                    'university': point.payload.get('university', ''),
                    'course': point.payload.get('course', ''),
                    'semester': point.payload.get('semester', 0),
                    'department': point.payload.get('department', ''),
                    'paper_type': point.payload.get('paper_type', '')
                }
                chunks.append(chunk)

            logger.info(f"Retrieved {len(chunks)} chunks")
            return chunks
        except Exception as e:
            logger.error(f"Failed to retrieve chunks by topic from Qdrant: {e}")
            return []


    def search_similar_chunks(self, collection_name: str, query: List[str], 
                            max_chunks: int = 10, min_similarity: float = 0.6,
                            context_window: int = 2) -> List[Dict]:
        """
        Retrieves relevant chunks based on semantic similarity to a given query and includes nearby context chunks.

        Args:
            collection_name (str): Name of the Qdrant collection.
            query (str): The query string.
            max_chunks (int): Maximum number of chunks to retrieve based on similarity.
            min_similarity (float): Minimum similarity threshold (0-1).
            context_window (int): Number of surrounding chunks to include before/after a match.

        Returns:
            list: A list of relevant chunk data including contextual chunks.
        """
        try:
            logger.info(f"Searching for similar chunks in collection: {collection_name} with query: {query}")
            query_embedding = self.embedder.encode(query).tolist()

            # Base filter
            book_filter = Filter(
                must=[
                    FieldCondition(key="type", match=MatchValue(value="book"))
                ]
            )

            search_result = self.client.search(
                collection_name=collection_name,
                query_vector=query_embedding,
                query_filter=book_filter,
                limit=max_chunks,
                score_threshold=min_similarity,
                with_payload=True
            )

            logger.info(f"Found {len(search_result)} similar chunks")

            # Collect matching indexes
            matched_indexes = set()
            chunk_map = {}

            for point in search_result:
                if point.score >= min_similarity:
                    index = point.payload.get('index')
                    if index is not None:
                        for i in range(index - context_window, index + context_window + 1):
                            matched_indexes.add(i)
                    # Store original chunk as fallback (even if index is missing)
                    chunk_map[point.payload.get('index')] = {
                        'content': point.payload.get('content', ''),
                        'score': point.score,
                        'topic': point.payload.get('topic', ''),
                        'source_file': point.payload.get('source_file', ''),
                        'subject': point.payload.get('subject', ''),
                        'chunk_length': point.payload.get('chunk_length', 0),
                        'index': point.payload.get('index')
                    
                    }

            # Step 2: Retrieve context chunks using scroll (filter by index in matched_indexes)
            context_chunks = []
            for idx in matched_indexes:
                # Search by exact index
                try:
                    scroll_result = self.client.scroll(
                        collection_name=collection_name,
                        scroll_filter={
                            "must": [
                                {"key": "index", "match": {"value": idx}},
                                {"key": "type", "match": {"value": "book"}}
                            ]
                        },
                        limit=1,
                        with_payload=True
                    )
                    for item in scroll_result:
                        context_chunks.append({
                            'content': item.payload.get('content', ''),
                            'score': None,  # This is context, so no similarity score
                            'topic': item.payload.get('topic', ''),
                            'source_file': item.payload.get('source_file', ''),
                            'subject': item.payload.get('subject', ''),
                            'chunk_length': item.payload.get('chunk_length', 0),
                            'index': item.payload.get('index')
                        })
                except Exception as err:
                    logger.warning(f"Failed to fetch context chunk at index {idx}: {err}")

            # Combine and deduplicate
            seen_indexes = set()
            all_chunks = []
            for chunk in context_chunks + list(chunk_map.values()):
                idx = chunk.get('index')
                if idx not in seen_indexes:
                    seen_indexes.add(idx)
                    all_chunks.append(chunk)

            return sorted(all_chunks, key=lambda x: x.get('index', 0))

        except Exception as e:
            logger.error(f"Failed to search similar chunks: {e}")
            return []

    def get_collection_info(self, collection_name: str) -> Dict:
        """
        Get information about a specific collection.

        Args:
            collection_name (str): Name of the collection.

        Returns:
            dict: Collection information including points count.
        """
        try:
            collection_info = self.client.get_collection(collection_name)
            return {
                'name': collection_name,
                'points_count': collection_info.points_count,
                'status': collection_info.status,
                'vectors_count': collection_info.vectors_count
            }
        except Exception as e:
            logger.error(f"Failed to get collection info for {collection_name}: {e}")
            raise

    def list_collections(self) -> List[Dict]:
        """
        Lists all available Qdrant collections along with their metadata.

        Returns:
            list: List of collection information dictionaries.
        """
        try:
            collections = self.client.get_collections()
            collection_list = []
            
            for collection in collections.collections:
                try:
                    collection_info = self.client.get_collection(collection.name)
                    collection_data = {
                        'name': collection.name,
                        'points_count': collection_info.points_count,
                        'status': collection_info.status,
                        'vectors_count': collection_info.vectors_count
                    }
                    collection_list.append(collection_data)
                except Exception as e:
                    logger.warning(f"Failed to get info for collection {collection.name}: {e}")
                    collection_list.append({
                        'name': collection.name,
                        'points_count': 0,
                        'status': 'unknown',
                        'vectors_count': 0,
                        'error': str(e)
                    })
            
            return collection_list
            
        except Exception as e:
            logger.error(f"Failed to list collections: {e}")
            return []

    def delete_collection(self, collection_name: str) -> bool:
        """
        Delete a collection from Qdrant.

        Args:
            collection_name (str): Name of the collection to delete.

        Returns:
            bool: True if deletion was successful, False otherwise.
        """
        try:
            self.client.delete_collection(collection_name)
            logger.info(f"Deleted collection: {collection_name}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete collection {collection_name}: {e}")
            return False

    def get_points_by_filter(self, collection_name: str, filter_conditions: Dict, 
                           limit: int = 100) -> List[Dict]:
        """
        Retrieve points from a collection based on filter conditions.

        Args:
            collection_name (str): Name of the collection.
            filter_conditions (dict): Filter conditions to apply.
            limit (int): Maximum number of points to retrieve.

        Returns:
            list: List of points matching the filter conditions.
        """
        try:
            # Build filter conditions
            conditions = []
            for key, value in filter_conditions.items():
                conditions.append(
                    FieldCondition(key=key, match=MatchValue(value=value))
                )
            
            filter_obj = Filter(must=conditions)
            
            scroll_result = self.client.scroll(
                collection_name=collection_name,
                scroll_filter=filter_obj,
                limit=limit,
                with_payload=True,
                with_vectors=False
            )
            
            points = []
            for point in scroll_result[0]:
                points.append({
                    'id': point.id,
                    'payload': point.payload
                })
            
            return points
            
        except Exception as e:
            logger.error(f"Failed to retrieve points by filter: {e}")
            return []
        
    def compute_cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """
        Compute the cosine similarity between two vectors.

        Args:
            vec1 (List[float]): First vector.
            vec2 (List[float]): Second vector.

        Returns:
            float: Cosine similarity score (range: -1 to 1).
        """
        try:
            v1 = np.array(vec1)
            v2 = np.array(vec2)
            if np.linalg.norm(v1) == 0 or np.linalg.norm(v2) == 0:
                return 0.0
            similarity = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
            return float(similarity)
        except Exception as e:
            logger.error(f"Failed to compute cosine similarity: {e}")
            return 0.0
        
    def verify_chunk_storage(self, collection_name: str, chunk_id: str) -> bool:
        """
        Verify if a chunk was successfully stored in Qdrant.
        
        Args:
            collection_name (str): Name of the collection
            chunk_id (str): ID of the chunk to verify
            
        Returns:
            bool: True if chunk exists, False otherwise
        """
        try:
            # Try to retrieve the point by ID
            points = self.client.retrieve(
                collection_name=collection_name,
                ids=[chunk_id],
                with_payload=True
            )
            
            if points and len(points) > 0:
                logger.info(f"Verified chunk {chunk_id} exists in collection {collection_name}")
                return True
            else:
                logger.warning(f"Chunk {chunk_id} not found in collection {collection_name}")
                return False
                
        except Exception as e:
            logger.error(f"Error verifying chunk storage: {e}")
            return False

    def get_collection_stats(self, collection_name: str) -> Dict:
        """
        Get detailed statistics about a collection.
        
        Args:
            collection_name (str): Name of the collection
            
        Returns:
            dict: Collection statistics
        """
        try:
            collection_info = self.client.get_collection(collection_name)
            count_response = self.client.count(collection_name=collection_name, exact=True)
            
            stats = {
                'name': collection_name,
                'points_count': collection_info.points_count,
                'vectors_count': collection_info.vectors_count,
                'status': collection_info.status,
                'exact_count': count_response.count
            }
            
            logger.info(f"Collection stats for {collection_name}: {stats}")
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get collection stats for {collection_name}: {e}")
            return {}


