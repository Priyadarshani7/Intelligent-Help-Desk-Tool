import os
import chromadb
from google import genai
from google.genai import types
from dotenv import load_dotenv
from pathlib import Path
from .load_sop_documents import load_and_split_sops

load_dotenv()

def get_chromadb_directory() -> Path:
    """Get the ChromaDB directory path."""
    current_file = Path(__file__)
    root_dir = current_file.parent.parent.parent.parent
    chromadb_dir = root_dir / 'backend' / 'chromadb'
    return chromadb_dir

def setup_clients():
    """Initialize API clients with error handling."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("[ERROR] GEMINI_API_KEY not found in environment variables.")

    db_path = get_chromadb_directory()
    if not db_path.exists():
        raise ValueError(f"[ERROR] ChromaDB directory not found at {db_path}")

    return genai.Client(api_key=api_key), chromadb.PersistentClient(path=str(db_path))

def generate_query_embedding(query: str):
    client, _ = setup_clients()
    try:
        result = client.models.embed_content(
            model="text-embedding-004",  # Same model as documents
            contents=[query],
            config=types.EmbedContentConfig(
                task_type="RETRIEVAL_DOCUMENT",
                title="Query Embedding",
                output_dimensionality=768
            )
        )
        query_embedding = result.embeddings[0].values
        print(f"[INFO] Generated embedding for the query.")
        return query_embedding
    except Exception as e:
        print(f"[ERROR] Query embedding failed: {e}")
        return None

def query_chromadb_for_similar_documents(query_embedding: list, n_results: int = 5):
    try:
        _, client_db = setup_clients()
        print("[INFO] Connected to ChromaDB.")
        
        collection_name = "sop_embeddings"
        collection = client_db.get_collection(name=collection_name)
        print(f"[INFO] Collection '{collection_name}' is ready.")

        # collection_items = collection.get()
        # print(f"[DEBUG] Number of documents in collection: {len(collection_items['documents'])}")
        # print(f"[DEBUG] First document preview: {collection_items['documents'][0][:200] if collection_items['documents'] else 'No documents'}")

        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )
        print(f"[INFO] Query returned {len(results['documents'][0]) if results['documents'] else 0} documents")
        
        if results['documents'] and results['documents'][0]:
            print(f"[INFO] Query returned {len(results['documents'][0])} documents")
            print(f"[INFO] Similarity scores: {results['distances'][0]}")
        else:
            print("[WARNING] No documents found in query results")
            
        return results['documents'][0], results['metadatas'][0]
    except Exception as e:
        print(f"[ERROR] Query failed: {e}")
        return None, None

def process_query_and_get_similar_documents(query: str, n_results: int = 5):
    print(f"[INFO] Processing query: {query}")
    
    try:
        # Step 1: Generate query embedding
        query_embedding = generate_query_embedding(query)
        if not query_embedding:
            print("[ERROR] Failed to generate query embedding")
            return []

        # Step 2: Retrieve top-k similar documents from ChromaDB
        documents, metadata = query_chromadb_for_similar_documents(query_embedding, n_results)
        if not documents:
            print("[WARNING] No similar documents found")
            return []

        # Print the top K retrieved documents for debugging
        print("\n=== Top K Retrieved Documents ===")
        for i, doc in enumerate(documents):
            print(f"[INFO] Document {i + 1}: {doc[:200]}...")

        return documents
    except Exception as e:
        print(f"[ERROR] Failed to process query: {e}")
        return []
