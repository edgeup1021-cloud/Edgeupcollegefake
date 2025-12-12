# services/neo4j_client.py
from neo4j import GraphDatabase
from ..config import Config
from ..utils.loggers import setup_logger

logger = setup_logger("django_logger")

class Neo4jClient:
    def __init__(self):
        try:
           
            self.driver = GraphDatabase.driver(Config.NEO4J_URI, auth=(Config.NEO4J_USER, Config.NEO4J_PASSWORD))
            # Test the connection
            with self.driver.session() as session:
                session.run("RETURN 1")
            logger.info("Successfully connected to Neo4j")
        except Exception as e:
            logger.error(f"Failed to connect to Neo4j: {e}")
            raise

    def close(self):
        """Close the Neo4j driver connection."""
        if hasattr(self, 'driver'):
            self.driver.close()
            logger.info("Neo4j connection closed")

    def validate_and_get_collection(self, subject, topic, Course_type):
        """
        Validates if the given subject/topic exists in the Neo4j hierarchy
        and returns the corresponding collection name.
        """
        try:
            with self.driver.session() as session:
                # Subtopic validation is skipped since your graph doesn't have it
                Course_type = Course_type.upper()

                query = """
                    MATCH (p:Platform {name: "EdgeUp"})
                        -[:HAS_DOMAIN]->(d:Domain {name: $Course_type})
                        -[:HAS_SUBJECT]->(s:Subject {name: $subject})
                        -[:HAS_TOPIC]->(t:Topic {name: $topic})
                    RETURN t.name AS topic
                """

                result = session.run(query,
                           Course_type=Course_type,
                           subject=subject,
                           topic=topic)

                if result.single():
                    name = f"{Course_type}_{subject}_{topic}"
                    collection_name = name.lower().replace(" ", "_").replace("-", "_")
                    logger.info(f"Validated hierarchy, collection name: {collection_name}")
                    return collection_name
                else:
                    logger.warning(f"Hierarchy not found: {subject} -> {topic}")
                    return None

        except Exception as e:
            logger.error(f"Error validating hierarchy: {e}")
            return None


    def create_hierarchy(self, exam, subject, topic, subtopic=None):
        """
        Creates the exam->subject->topic->subtopic hierarchy in Neo4j.
        
        Args:
            exam (str): Exam name (e.g., "UPSC")
            subject (str): Subject name
            topic (str): Topic name
            subtopic (str, optional): Subtopic name
        """
        try:
            with self.driver.session() as session:
                session.write_transaction(self._create_nodes, exam, subject, topic, subtopic)
                logger.info(f"Created hierarchy: {exam} -> {subject} -> {topic}" + 
                           (f" -> {subtopic}" if subtopic else ""))
        except Exception as e:
            logger.error(f"Error creating hierarchy: {e}")
            raise

    @staticmethod
    def _create_nodes(tx, exam, subject, topic, subtopic):
        """
        Transaction function to create nodes and relationships.
        
        Args:
            tx: Neo4j transaction
            exam (str): Exam name
            subject (str): Subject name
            topic (str): Topic name
            subtopic (str, optional): Subtopic name
        """
        query = """
        MERGE (e:Exam {name: $exam})
        MERGE (s:Subject {name: $subject})
        MERGE (t:Topic {name: $topic})
        MERGE (e)-[:HAS_SUBJECT]->(s)
        MERGE (s)-[:HAS_TOPIC]->(t)
        """
        
        if subtopic:
            query += """
            MERGE (st:Subtopic {name: $subtopic})
            MERGE (t)-[:HAS_SUBTOPIC]->(st)
            """
        
        tx.run(query, exam=exam, subject=subject, topic=topic, subtopic=subtopic)

    def get_all_subjects(self, exam="college"):
        """
        Get all subjects for a given course.

        Args:
            exam (str): Course/exam name (e.g., "bcom", "msc_physics", "college")

        Returns:
            list: List of subject names
        """
        try:
            with self.driver.session() as session:
                result = session.run("""
                    MATCH (e:Exam {name: $exam})-[:HAS_SUBJECT]->(s:Subject)
                    RETURN s.name AS subject
                    ORDER BY s.name
                """, exam=exam)
                
                subjects = [record["subject"] for record in result]
                logger.info(f"Found {len(subjects)} subjects for exam {exam}")
                return subjects
                
        except Exception as e:
            logger.error(f"Error getting subjects: {e}")
            return []

    def get_topics_for_subject(self, subject, exam="college"):
        """
        Get all topics for a given subject and course.

        Args:
            subject (str): Subject name
            exam (str): Course/exam name

        Returns:
            list: List of topic names
        """
        try:
            with self.driver.session() as session:
                result = session.run("""
                    MATCH (e:Exam {name: $exam})-[:HAS_SUBJECT]->(s:Subject {name: $subject})
                          -[:HAS_TOPIC]->(t:Topic)
                    RETURN t.name AS topic
                    ORDER BY t.name
                """, exam=exam, subject=subject)
                
                topics = [record["topic"] for record in result]
                logger.info(f"Found {len(topics)} topics for subject {subject}")
                return topics
                
        except Exception as e:
            logger.error(f"Error getting topics: {e}")
            return []

    def get_subtopics_for_topic(self, subject, topic, exam="college"):
        """
        Get all subtopics for a given topic, subject, and course.

        Args:
            subject (str): Subject name
            topic (str): Topic name
            exam (str): Course/exam name

        Returns:
            list: List of subtopic names
        """
        try:
            with self.driver.session() as session:
                result = session.run("""
                    MATCH (e:Exam {name: $exam})-[:HAS_SUBJECT]->(s:Subject {name: $subject})
                          -[:HAS_TOPIC]->(t:Topic {name: $topic})-[:HAS_SUBTOPIC]->(st:Subtopic)
                    RETURN st.name AS subtopic
                    ORDER BY st.name
                """, exam=exam, subject=subject, topic=topic)
                
                subtopics = [record["subtopic"] for record in result]
                logger.info(f"Found {len(subtopics)} subtopics for topic {topic}")
                return subtopics
                
        except Exception as e:
            logger.error(f"Error getting subtopics: {e}")
            return []

    def check_hierarchy_exists(self, exam, subject, topic, subtopic=None):
        """
        Check if a specific hierarchy path exists.
        
        Args:
            exam (str): Exam name
            subject (str): Subject name
            topic (str): Topic name
            subtopic (str, optional): Subtopic name
            
        Returns:
            bool: True if hierarchy exists, False otherwise
        """
        try:
            with self.driver.session() as session:
                if subtopic:
                    result = session.run("""
                        MATCH (e:Exam {name: $exam})-[:HAS_SUBJECT]->(s:Subject {name: $subject})
                              -[:HAS_TOPIC]->(t:Topic {name: $topic})-[:HAS_SUBTOPIC]->(st:Subtopic {name: $subtopic})
                        RETURN COUNT(*) AS count
                    """, exam=exam, subject=subject, topic=topic, subtopic=subtopic)
                else:
                    result = session.run("""
                        MATCH (e:Exam {name: $exam})-[:HAS_SUBJECT]->(s:Subject {name: $subject})
                              -[:HAS_TOPIC]->(t:Topic {name: $topic})
                        RETURN COUNT(*) AS count
                    """, exam=exam, subject=subject, topic=topic)
                
                count = result.single()["count"]
                return count > 0
                
        except Exception as e:
            logger.error(f"Error checking hierarchy: {e}")
            return False

    def delete_hierarchy_node(self, exam, subject, topic=None, subtopic=None):
        """
        Delete a specific node from the hierarchy.
        
        Args:
            exam (str): Exam name
            subject (str): Subject name
            topic (str, optional): Topic name
            subtopic (str, optional): Subtopic name
        """
        try:
            with self.driver.session() as session:
                if subtopic and topic:
                    # Delete subtopic
                    session.run("""
                        MATCH (e:Exam {name: $exam})-[:HAS_SUBJECT]->(s:Subject {name: $subject})
                              -[:HAS_TOPIC]->(t:Topic {name: $topic})-[:HAS_SUBTOPIC]->(st:Subtopic {name: $subtopic})
                        DETACH DELETE st
                    """, exam=exam, subject=subject, topic=topic, subtopic=subtopic)
                    logger.info(f"Deleted subtopic: {subtopic}")
                    
                elif topic:
                    # Delete topic and all its subtopics
                    session.run("""
                        MATCH (e:Exam {name: $exam})-[:HAS_SUBJECT]->(s:Subject {name: $subject})
                              -[:HAS_TOPIC]->(t:Topic {name: $topic})
                        OPTIONAL MATCH (t)-[:HAS_SUBTOPIC]->(st:Subtopic)
                        DETACH DELETE t, st
                    """, exam=exam, subject=subject, topic=topic)
                    logger.info(f"Deleted topic: {topic} and all its subtopics")
                    
                else:
                    # Delete subject and all its topics/subtopics
                    session.run("""
                        MATCH (e:Exam {name: $exam})-[:HAS_SUBJECT]->(s:Subject {name: $subject})
                        OPTIONAL MATCH (s)-[:HAS_TOPIC]->(t:Topic)
                        OPTIONAL MATCH (t)-[:HAS_SUBTOPIC]->(st:Subtopic)
                        DETACH DELETE s, t, st
                    """, exam=exam, subject=subject)
                    logger.info(f"Deleted subject: {subject} and all its topics/subtopics")
                    
        except Exception as e:
            logger.error(f"Error deleting hierarchy node: {e}")
            raise

    def get_stats(self):
        """
        Get statistics about the Neo4j database.
        
        Returns:
            dict: Statistics including node counts and relationship counts
        """
        try:
            with self.driver.session() as session:
                # Get node counts
                exam_count = session.run("MATCH (e:Exam) RETURN COUNT(e) AS count").single()["count"]
                subject_count = session.run("MATCH (s:Subject) RETURN COUNT(s) AS count").single()["count"]
                topic_count = session.run("MATCH (t:Topic) RETURN COUNT(t) AS count").single()["count"]
                subtopic_count = session.run("MATCH (st:Subtopic) RETURN COUNT(st) AS count").single()["count"]
                
                # Get relationship counts
                has_subject_count = session.run("MATCH ()-[r:HAS_SUBJECT]->() RETURN COUNT(r) AS count").single()["count"]
                has_topic_count = session.run("MATCH ()-[r:HAS_TOPIC]->() RETURN COUNT(r) AS count").single()["count"]
                has_subtopic_count = session.run("MATCH ()-[r:HAS_SUBTOPIC]->() RETURN COUNT(r) AS count").single()["count"]
                
                stats = {
                    "nodes": {
                        "exams": exam_count,
                        "subjects": subject_count,
                        "topics": topic_count,
                        "subtopics": subtopic_count,
                        "total": exam_count + subject_count + topic_count + subtopic_count
                    },
                    "relationships": {
                        "has_subject": has_subject_count,
                        "has_topic": has_topic_count,
                        "has_subtopic": has_subtopic_count,
                        "total": has_subject_count + has_topic_count + has_subtopic_count
                    }
                }
                
                logger.info(f"Neo4j stats: {stats}")
                return stats
                
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return {}