from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def load_and_split_sops(folder_path: str):
    loader = DirectoryLoader(folder_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    # print(f"[INFO] Total Chunks Created: {len(chunks)}\n")

    return chunks
 
folder_path = r'D:\workspace\Intelligent-Help-Desk-Tool\backend\app\sops' 
sop_chunks = load_and_split_sops(folder_path)


