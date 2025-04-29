import os
from dotenv import load_dotenv
import google.generativeai as genai
from .retriever import process_query_and_get_similar_documents  

load_dotenv()

def generate_answer(query: str, n_results: int = 3):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment variables")
        return "Unable to generate answer: API key not found"

    #  Retrieve relevant chunks
    print("[INFO] Retrieving relevant documents for query...")
    documents = process_query_and_get_similar_documents(query, n_results)
    
    if not documents or documents == "Done.":
        return "No relevant documents found. I cannot generate an answer."

    #  Format  chunks
    context = "\n\n".join(documents)

    try:
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash-lite')  

        # prompt
        prompt = f"""
        You are an intelligent assistant helping with questions about Standard Operating Procedures (SOPs).

        Based only on the following information from SOPs, answer the query.
        If you cannot answer based solely on the provided information, say so clearly.

        CONTEXT:
        {context}

        QUERY: {query}

        Provide a comprehensive paragraph answer of at least 200 words using all relevant information from the SOPs.

        """

        # Generate response
        response = model.generate_content(prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error generating answer: {e}")
        return f"Sorry, I encountered an error while generating your answer: {str(e)}"

# Test run
if __name__ == "__main__":
    query = "How do I fix software crashes?"
    answer = generate_answer(query)
    print(f"\n=== Answer ===\n{answer}")
