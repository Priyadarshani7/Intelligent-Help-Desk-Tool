import os
from pathlib import Path
from dotenv import load_dotenv
import chromadb
from google import genai
from google.genai import types
from google.genai.types import EmbedContentConfig
from app.rag.load_sop_documents import load_and_split_sops

load_dotenv()

def get_project_root() -> Path:
    """Get the project root directory."""
    return Path(__file__).resolve().parent.parent.parent.parent

def get_sops_directory() -> Path:
    """Get the SOPs directory path."""
    return get_project_root() / 'backend' / 'app' / 'sops'

def get_chromadb_directory() -> Path:
    """Get the ChromaDB directory path."""
    return get_project_root() / 'backend' / 'chromadb'

def generate_embeddings_batch(content_list: list, api_key: str):
    """Generate embeddings for a batch of content using Gemini."""
    client = genai.Client(api_key=api_key)
    try:
        result = client.models.embed_content(
            model="text-embedding-004",
            contents=content_list,
            config=EmbedContentConfig(
                task_type="RETRIEVAL_DOCUMENT",
                title="Document Embedding",
                output_dimensionality=1024
            )
        )
        return result.embeddings
    except Exception as e:
        print(f"[ERROR] Embedding batch failed: {e}")
        return None

def store_embeddings_in_chromadb(folder_path: Path = None):
    """Load SOPs, generate embeddings, and store them in ChromaDB."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("[ERROR] GEMINI_API_KEY is missing in .env file!")

    folder_path = folder_path or get_sops_directory()
    folder_path.mkdir(parents=True, exist_ok=True)

    db_path = get_chromadb_directory()
    db_path.mkdir(parents=True, exist_ok=True)

    try:
        print(f"[INFO] Loading SOPs from: {folder_path}")
        sop_chunks = load_and_split_sops(str(folder_path))
        print(f"[INFO] Loaded {len(sop_chunks)} SOP chunks.")

        client_db = chromadb.PersistentClient(path=str(db_path))
        collection_name = "sop_embeddings"
        collection = client_db.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )

        chunk_size = 80
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

            collection.add(
                documents=documents,
                embeddings=embeddings,
                metadatas=metadata,
                ids=ids
            )
            print(f"[INFO] Stored {len(documents)} documents (batch {i // chunk_size + 1}) in ChromaDB.")

        final_docs = collection.get()
        print(f"[INFO] Total documents in collection after storage: {len(final_docs['documents'])}")

    except Exception as e:
        print(f"[ERROR] An error occurred during ChromaDB storage: {e}")

def myFunction():
    """Main function to initiate SOP processing and storage."""
    try:
        sops_dir = get_sops_directory()
        store_embeddings_in_chromadb(sops_dir)
    except Exception as e:
        print(f"[ERROR] {e}")
