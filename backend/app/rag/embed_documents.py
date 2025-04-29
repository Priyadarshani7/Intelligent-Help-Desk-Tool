import time
from dotenv import load_dotenv
import chromadb
from google import genai
from google.genai import types
from app.rag.load_sop_documents import load_and_split_sops
import os

load_dotenv()

#embeddings generation
def generate_embeddings_batch(content_list: list, api_key: str):
    client = genai.Client(api_key=api_key)
    try:
        result = client.models.embed_content(
            model="text-embedding-004",
            contents=content_list,
            config=types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY")
        )
        embeddings = result.embeddings
        print(f"[INFO] Generated embeddings for {len(embeddings)} documents.")
        return embeddings
    except Exception as e:
        print(f"[Error] Embedding batch failed: {e}")
        return None

# store embeddings in chormadb
def store_embeddings_in_chromadb(folder_path: str):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("[Error] GEMINI_API_KEY is missing in .env file!")
        
    db_path = os.getenv("CHROMADB_PATH")
    if not db_path:
        raise ValueError("[Error] CHROMADB_PATH is missing in .env file!")

    try:
        sop_chunks = load_and_split_sops(folder_path)
        print(f"[INFO] Loaded {len(sop_chunks)} SOP chunks.")

        
        client_db = chromadb.PersistentClient(path=db_path)
        print("[INFO] Connected to ChromaDB.")
        
        collection_name = "sop_embeddings" 
        collection = client_db.get_or_create_collection(name=collection_name)
        print(f"[INFO] Collection '{collection_name}' is ready.")

        # count
        current_docs = collection.get()
        print(f"[INFO] Current documents in collection: {len(current_docs['documents'])}")

        chunk_size = 20  
        for i in range(0, len(sop_chunks), chunk_size):
            batch_chunks = sop_chunks[i:i+chunk_size]
            content_batch = [chunk.page_content for chunk in batch_chunks]

            embeddings_obj = generate_embeddings_batch(content_batch, api_key)
            if embeddings_obj is None:
                print(f"[ERROR] Embedding batch failed for documents starting from index {i}.")
                continue

            embeddings = [embedding.values for embedding in embeddings_obj]
            documents = [chunk.page_content for chunk in batch_chunks]
            metadata = [{"source": f"chunk_{i + j}"} for j in range(len(documents))]
            ids = [f"chunk_{i + j}" for j in range(len(documents))]

            print(f"[INFO] Storing {len(documents)} documents in ChromaDB (batch {i // chunk_size + 1})...")
            collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadata,
                ids=ids
            )
            print(f"[INFO] Stored {len(documents)} documents (batch {i // chunk_size + 1}) in ChromaDB.")
            time.sleep(2)  

        final_docs = collection.get()
        print(f"[INFO] Total documents in collection after storage: {len(final_docs['documents'])}")

    except Exception as e:
        print(f"[ERROR] An error occurred: {e}")

if __name__ == "__main__":
    folder_path = r'D:\workspace\Intelligent-Help-Desk-Tool\backend\app\sops'
    store_embeddings_in_chromadb(folder_path)
