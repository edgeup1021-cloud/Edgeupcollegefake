import json
import os
import re
import sys
import time
import uuid
import requests  
import io
from PyPDF2 import PdfReader
import tempfile
import tempfile
import logging
from pathlib import Path
from typing import List, Dict, Optional
import fitz  # PyMuPDF
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.storage import FileSystemStorage
import google.generativeai as genai
from sentence_transformers import SentenceTransformer
from django.conf import settings
import requests
from ..config import Config
from ..models.academic_hierarchy import Topics
from ..apps import Models
from ..connections.qdrant_client import QdrantService
from ..connections.neo4j_client import Neo4jClient
from ..utils.loggers import setup_logger

logger = setup_logger("django_logger")



class KnowledgeUpdateService:
    def __init__(self):
        self.qdrant_service = None
        self.neo4j_client = None
        self.gemini_model = None
        self.gemini_fallback_model = None
        self.embedder = None
        self.initialize_services()

    def initialize_services(self):
        try:
            logger.info("Initializing services...")
            
            # Use existing clients instead of creating new ones
            self.qdrant_service = QdrantService()
            self.neo4j_client = Neo4jClient()
            
            logger.info("Initializing Gemini API...")
            
            logger.info("Loading sentence transformer model...")
            self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
            
            logger.info("All services initialized successfully!")
        except Exception as e:
            logger.error(f"Failed to initialize services: {e}")
            raise

    def split_into_chunks(self, text: str, max_chunk_size: int = 3000, overlap_size: int = 200) -> List[str]:
        chunks = []
        start = 0
        text_len = len(text)
        
        while start < text_len:
            end = min(start + max_chunk_size, text_len)
            if end < text_len:
                sentence_end = text.rfind('.', start, end)
                if sentence_end > start + max_chunk_size * 0.7:
                    end = sentence_end + 1
            
            chunk = text[start:end].strip()
            if len(chunk) > 100 and len(chunk.split()) > 20:
                chunks.append(chunk)
            
            start = max(end - overlap_size, start + 1)
            if start >= text_len:
                break
        
        return chunks

    def extract_text_chunks_from_pdf(self, pdf_file: str, max_chunk_size: int = 3000, overlap_size: int = 200) -> List[str]:
        response = requests.get(pdf_file,stream=True)
        response.raise_for_status()
        content_type = response.headers.get('Content-Type', '').lower()
        
            
        is_pdf = (
            'application/pdf' in content_type or
            pdf_file.endswith('.pdf') or
            # Handle PDF URLs with query parameters
            '.pdf?' in pdf_file or
            '.pdf#' in pdf_file
        )
        
        try:
            logger.info("Processing PDF content")
            pdf_file = io.BytesIO(response.content)
            reader = PdfReader(pdf_file)
            with tempfile.TemporaryFile(mode='w+', encoding='utf-8') as tmp:
                for page in reader.pages:
                    try:
                        extracted = page.extract_text()
                        if extracted:
                            tmp.write(extracted + "\n")
                    except Exception as page_e:
                        logger.warning(f"Failed to extract text from a page: {page_e}")
                tmp.seek(0)
                text_content = tmp.read().strip()
        except Exception as e:
            logger.error(f"Failed to read or parse PDF file: {e}")
            return []

        try:
            if not text_content:
                logger.warning(f"No text content found in PDF: {pdf_file}")
                return []
            
            # full_text = self.clean_text("\n".join(text_content))
            chunks = self.split_into_chunks(text_content, max_chunk_size, overlap_size)
            logger.info(f"Extracted {len(chunks)} chunks from PDF: {pdf_file}")
            return chunks
        except Exception as e:
            logger.error(f"Failed to extract text from PDF {pdf_file}: {e}")
            return []

    def classify_chunk_with_gemini(self, chunk: str, subject_id: str, max_retries: int = 3) -> str:
        topics = Topics.objects.filter(subject_id=subject_id).values_list('name', flat=True)
        if not topics:
            logger.warning(f"No topics found for subject '{subject_id}'")
            return "miscellaneous"
        prompt = (
        f"Classify this text chunk into the most appropriate topic for '{subject_id}'.\n\n"
        f"Available topics: {', '.join(topics)}\n\n"
        f"Text chunk (first 800 chars):\n{chunk[:800]}{'...' if len(chunk) > 800 else ''}\n\n"
        f"Instructions:\n"
        f"- Analyze the main theme/concept in the text\n"
        f"- Return ONLY the exact topic name from the list above and page number if avilable\n"
        f"- If no topic matches well but text chunk is related to {subject_id} then return 'miscellaneous'\n\n"
        f"- If no topic matches well and text chunk is not related to {subject_id} then return 'none'\n\n"
        f"Topic:"
    )  # assuming 'chunk' is used in prompt as topic context

        def try_model(model, model_name="primary"):
            
            for attempt in range(int(Config.MAX_RETRIES)):
                try:
                    response = model.generate_content(prompt)
                    topic_name = response.text.strip().replace('"', '').replace("'", "").lower()
                    if topic_name in topics:
                        return topic_name
                    for topic in topics:
                        if topic.lower() in topic_name or topic_name in topic.lower():
                            logger.info(f"{model_name.capitalize()} model: Found partial match: '{topic}' for response '{topic_name}'")
                            return topic
                    logger.warning(f"{model_name.capitalize()} model returned unrecognized topic '{topic_name}', using 'miscellaneous'")
                    return "miscellaneous"
                except Exception as e:
                    if "429" in str(e) or "quota" in str(e).lower():
                        retry_delay = (2 ** attempt) + 3
                        logger.warning(f"{model_name.capitalize()} model rate limit hit, retrying in {retry_delay}s (attempt {attempt + 1}/{max_retries})")
                        time.sleep(retry_delay)
                    else:
                        logger.error(f"{model_name.capitalize()} model error during classification: {e}")
                        break
            return None

        # Try primary Gemini model
        result = try_model(Models.primary_model, "primary")
        if result:
            return result

        # Fallback to secondary model if available
        if hasattr(self, 'gemini_fallback_model'):
            logger.info("Falling back to secondary Gemini model")
            result = try_model(Models.fallback_model, "fallback")
            if result:
                return result

        logger.error("All attempts failed, returning 'miscellaneous'")
        return "miscellaneous"

    def create_qdrant_collection_if_needed(self, collection_name: str) -> Optional[str]:
        try:
            return self.qdrant_service.create_collection_if_needed(collection_name)
        except Exception as e:
            logger.error(f"Failed to create Qdrant collection {collection_name}: {e}")
            return None

    def store_chunk_in_qdrant(self, subject: str, topic: str, chunk: str, collection_name: str, pdf_filename: str) -> Optional[str]:
        try:
            return self.qdrant_service.store_chunk_in_qdrant(
                subject=subject,
                topic=topic,
                chunk=chunk,
                collection_name=collection_name,
                pdf_filename=pdf_filename
            )
        except Exception as e:
            logger.error(f"Failed to store chunk in Qdrant: {e}")
            return None

    def store_relationship_in_neo4j(self, subject: str, topic: str, chunk_id: str, Course_type: str,
                                  chunk_length: int, source_file: str) -> bool:
        query = """
    // MERGE platform hierarchy
    MERGE (edge:Platform {name: 'EdgeUp'})
    ON CREATE SET edge.created_at = timestamp()

    MERGE (q:Domain {name: $Course_type})
    ON CREATE SET q.created_at = timestamp()

    // MERGE subject and topic
    MERGE (s:Subject {name: $subject})
    ON CREATE SET s.created_at = timestamp()

    MERGE (t:Topic {name: $topic, subject: $subject})
    ON CREATE SET t.created_at = timestamp()

    // CREATE chunk node
    CREATE (c:Chunk {
        id: $chunk_id,
        length: $chunk_length,
        source_file: $source_file,
        created_at: timestamp()
    })

    // Relationships (SubPlatform removed - direct Domain connection)
    MERGE (edge)-[:HAS_DOMAIN]->(q)
    MERGE (q)-[:HAS_SUBJECT]->(s)
    MERGE (s)-[:HAS_TOPIC]->(t)
    MERGE (t)-[:HAS_CHUNK]->(c)

    // Update counts
    SET s.chunk_count = COALESCE(s.chunk_count, 0) + 1
    SET t.chunk_count = COALESCE(t.chunk_count, 0) + 1
    """
        try:
            with self.neo4j_client.driver.session() as session:
                session.run(query,
                          subject=subject,
                          topic=topic,
                          Course_type=Course_type,
                          chunk_id=chunk_id,
                          chunk_length=chunk_length,
                          source_file=source_file)
            return True
        except Exception as e:
            logger.error(f"Failed to store relationship in Neo4j: {e}")
            return False

    def process_pdf(self, pdf_file: str, subject: str, subject_id: str, Course_type: str) -> Dict[str, int]:
        # Vendor parameter removed - not needed for college system
        logger.info(f"Processing PDF: ")
        
        
        chunks = self.extract_text_chunks_from_pdf(pdf_file)
        
        if not chunks:
            logger.error(f"No chunks extracted from")
            return {"total": 0, "successful": 0, "failed": 0, "topic_distribution": {}}
        
        results = {"total": len(chunks), "successful": 0, "failed": 0}
        topic_counts = {}
        
        for i, chunk in enumerate(chunks, 1):
            try:
                logger.info(f"Processing chunk {i}/{len(chunks)} from")
                topic = self.classify_chunk_with_gemini(chunk, subject_id)
                if topic !="none":
                    topic_counts[topic] = topic_counts.get(topic, 0) + 1
                    collection_name = f"{Course_type}_{subject}_{topic}".replace(" ", "_").lower()
                    collection_name = self.create_qdrant_collection_if_needed(collection_name)
        
                
                if not collection_name:
                    logger.error(f"Failed to create collection for {subject}-{topic}")
                    results["failed"] += 1
                    continue
                
                chunk_id = self.store_chunk_in_qdrant(subject=subject, topic=topic.upper(), chunk=chunk, collection_name=collection_name, pdf_filename=pdf_file)
                if not chunk_id:
                    logger.error(f"Failed to store chunk {i} in Qdrant")
                    results["failed"] += 1
                    continue
                
                # Verify the chunk was actually stored
                if self.qdrant_service.verify_chunk_storage(collection_name, chunk_id):
                    logger.info(f"Chunk {i} verified in Qdrant")
                else:
                    logger.warning(f"Chunk {i} storage verification failed")
                
                if self.store_relationship_in_neo4j(subject=subject, topic=topic.upper(), Course_type=Course_type, chunk_id=chunk_id, chunk_length=len(chunk), source_file=None):
                    results["successful"] += 1
                    logger.info(f"Successfully processed chunk {i}/{len(chunks)}")
                else:
                    logger.error(f"Failed to store chunk {i} relationship in Neo4j")
                    results["failed"] += 1
                
                time.sleep(0.5)
            except Exception as e:
                logger.error(f"Error processing chunk {i} from : {e}")
                results["failed"] += 1
        
        results['topic_distribution'] = topic_counts
        
        # Log final collection statistics
        logger.info("=== Final Collection Statistics ===")
        for topic, count in topic_counts.items():
            collection_name = f"{Course_type}_{subject}_{topic}".replace(" ", "_").lower()
            stats = self.qdrant_service.get_collection_stats(collection_name)
            if stats:
                logger.info(f"Collection '{collection_name}': {stats['points_count']} points, {stats['vectors_count']} vectors")
        
        logger.info(f"=== Processing Complete ===")
        logger.info(f"Total chunks processed: {results['total']}")
        logger.info(f"Successful: {results['successful']}")
        logger.info(f"Failed: {results['failed']}")
        logger.info(f"Topic distribution: {topic_counts}")
        
        return results
