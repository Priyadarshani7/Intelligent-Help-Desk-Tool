import os
from dotenv import load_dotenv
import google.generativeai as genai
from .retriever import process_query_and_get_similar_documents, get_chromadb_directory

load_dotenv()

def generate_answer(query: str) -> str:
    """Generate an answer for the given query using RAG."""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("[ERROR] GEMINI_API_KEY not found in environment variables")

        # Ensure ChromaDB directory exists
        db_path = get_chromadb_directory()
        if not db_path.exists():
            raise ValueError(f"[ERROR] ChromaDB directory not found at {db_path}")

        # Retrieve relevant chunks
        print("[INFO] Retrieving relevant documents for query...")
        documents = process_query_and_get_similar_documents(query)
        
        if not documents:
            return "I apologize, but I don't have any documentation or SOPs related to this issue in my knowledge base. Please contact IT support for further assistance."

        # Format chunks into context
        context = "\n\n".join(documents)

        # Configure Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')

        # Create prompt that strictly limits responses to documented solutions
        prompt = f"""You are a technical support assistant. You must ONLY provide solutions that are EXPLICITLY documented in the given SOPs.
        NEVER generate or infer solutions that aren't directly present in the provided documentation.

        Here is the relevant SOP documentation:
        {context}

        User Issue:
        {query}

        Instructions:
        1. Check if the EXACT issue or a VERY SIMILAR issue is documented in the SOPs above or see for some related issues and keywords.
        2. If the issue is NOT clearly documented in the SOPs, respond with:
           "I apologize, but I don't have any documented solutions for this specific issue in my knowledge base. Please contact IT support for assistance."
        3. If the issue IS documented, provide:
           - The solution EXACTLY as written in the SOPs
           - Any relevant warnings or prerequisites mentioned in the SOPs
        
        IMPORTANT:
        - DO NOT create or infer solutions
        - DO NOT combine different parts of the documentation to create new solutions
        - ONLY provide solutions that are explicitly documented
        - If unsure, always err on the side of saying you don't have documentation
        
        give detailed solution in a step-by-step format give detailed explanation of each step as well.
        """

        # Generate response with error handling
        try:
            response = model.generate_content(prompt)
            generated_text = response.text.strip()
            
            # Additional check to ensure we're not generating creative solutions
            if len(context) < 50 or "don't have" in generated_text.lower() or "no relevant" in generated_text.lower():
                return "I apologize, but I don't have any documented solutions for this specific issue. Please contact IT support for assistance."
            
            return generated_text
        except Exception as e:
            print(f"[ERROR] Gemini generation failed: {e}")
            return "I apologize, but I encountered an error while generating the solution. Please contact IT support."

    except Exception as e:
        print(f"[ERROR] Answer generation failed: {e}")
        return "I apologize, but I encountered an error. Please contact IT support."
