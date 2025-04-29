import os
import chromadb
from google import genai
from google.genai import types
from dotenv import load_dotenv
from .load_sop_documents import load_and_split_sops  # Changed to relative import

load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("[ERROR] GEMINI_API_KEY not found in environment variables.")


db_path = os.getenv("CHROMADB_PATH")
if not db_path:
    raise ValueError("[ERROR] CHROMADB_PATH not found in environment variables.")

# query embeddings
def generate_query_embedding(query: str):
    client = genai.Client(api_key=api_key)
    try:
        result = client.models.embed_content(
            model="text-embedding-004",
            contents=[query],
            config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
        )
        query_embedding = result.embeddings[0].values
        print(f"[INFO] Generated embedding for the query.")
        return query_embedding
    except Exception as e:
        print(f"[ERROR] Query embedding failed: {e}")
        return None

# check similar embeddings in chormadb
def query_chromadb_for_similar_documents(query_embedding: list, n_results: int = 5):
    try:
        
        client_db = chromadb.PersistentClient(path=db_path)
        print("[INFO] Connected to ChromaDB.")
        
        collection_name = "sop_embeddings"
        collection = client_db.get_collection(name=collection_name)
        print(f"[INFO] Collection '{collection_name}' is ready.")

    #count
        collection_items = collection.get()
        print(f"[DEBUG] Number of documents in collection: {len(collection_items['documents'])}")
        print(f"[DEBUG] First document preview: {collection_items['documents'][0][:200] if collection_items['documents'] else 'No documents'}")

        # top k similar embeddings
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        print(f"[INFO] Query returned {len(results['documents'][0]) if results['documents'] else 0} documents")
        
        if not results['documents'][0]:
            print("[WARNING] No documents found in query results")
            
        return results['documents'][0], results['metadatas'][0]
    except Exception as e:
        print(f"[ERROR] Query failed: {e}")
        return None, None

# retrive top k elements
def process_query_and_get_similar_documents(query: str, n_results: int = 5):
    print(f"[INFO] Processing query: {query}")
    
    # Step 1: Generate query embedding
    query_embedding = generate_query_embedding(query)
    if not query_embedding:
        return []

    # Step 2: Retrieve top-k similar documents from ChromaDB
    documents, metadata = query_chromadb_for_similar_documents(query_embedding, n_results)
    if not documents:
        return []

    # Print the top K retrieved documents for debugging
    print("\n=== Top K Retrieved Documents ===")
    for i, doc in enumerate(documents):
        print(f"[INFO] Document {i + 1}: {doc[:200]}...")

    return documents

if __name__ == "__main__":
  
    query = "How do I fix software crashes?"
    print("\n[INFO] Starting document retrieval process...")
    retrieved_docs = process_query_and_get_similar_documents(query)
    print(f"\nRetrieved {len(retrieved_docs)} documents")
