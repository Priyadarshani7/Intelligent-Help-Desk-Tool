from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pathlib import Path

def load_and_split_sops(folder_path: str | Path):
    try:
        # Convert to string if Path object
        folder_path = str(folder_path)
        
        # Load documents from directory
        loader = DirectoryLoader(folder_path, glob="**/*.txt")
        documents = loader.load()
        
        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100,
        )
        chunks = text_splitter.split_documents(documents)
        
        print(f"[INFO] Total Chunks Created: {len(chunks)}\n")
        return chunks
        
    except Exception as e:
        print(f"[ERROR] Failed to load or split documents: {e}")
        return []


