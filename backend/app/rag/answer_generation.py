import os
from dotenv import load_dotenv
import google.generativeai as genai
from .retriever import process_query_and_get_similar_documents, get_chromadb_directory

load_dotenv()

def generate_answer(query: str) -> str:
    """Generate an answer for the given query using RAG, tailored to Jade Global Pvt. Ltd."""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("[ERROR] GEMINI_API_KEY not found in environment variables")

        # Ensure ChromaDB directory exists
        db_path = get_chromadb_directory()
        if not db_path.exists():
            raise ValueError(f"[ERROR] ChromaDB directory not found at {db_path}")

        # Retrieve relevant documents
        print("[INFO] Retrieving relevant documents for query...")
        documents = process_query_and_get_similar_documents(query)

        if not documents:
            return (
                "I apologize, but I don't have any documented solutions for this issue in the Jade Global knowledge base. "
                "Kindly reach out to the Jade Global IT Support Desk for immediate assistance."
            )

        # Format SOP content as context
        context = "\n\n".join(documents)

        # Configure Gemini API
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('models/gemini-2.0-flash')

        # Prepare the RAG prompt
        prompt = f"""You are a technical support assistant at Jade Global Pvt. Ltd., Pune. Your responsibility is to assist employees by providing accurate, clear, and professional solutions strictly based on the official SOP content provided below.

IMPORTANT:
- DO NOT generate, guess, or infer any steps or solutions.
- ONLY use explicitly documented content.
- Maintain a helpful, clear, and respectful tone as expected from a Jade Global IT Support Desk representative.

Official SOP Documentation:
{context}

Reported User Issue:
{query}

# GUIDELINES:
1. Carefully check for a relevant or similar issue in the SOPs.
2. If no documented solution is found, respond exactly with:
   "I apologize, but I don't have any documented solutions for this issue in the Jade Global knowledge base. Kindly reach out to the Jade Global IT Support Desk for immediate assistance."
3. If a documented solution exists:
   - Extract the relevant information and format it into a clear, numbered, step-by-step guide.
   - Rephrase for clarity and professionalism, but do NOT add or infer steps.
   - Remove unnecessary symbols like asterisks (**).
   - Ensure technical accuracy since your audience consists of IT professionals.

# FORMAT:
- Provide steps as a numbered list.
- Use complete, grammatically correct sentences.
- Avoid phrases like "According to the SOP".
- End the response with a Jade Global branded support message if appropriate.
"""

        # Generate answer from Gemini
        try:
            response = model.generate_content(
                prompt,
                generation_config={
                    # Optional: tune temperature if you want stricter determinism
                    # "temperature": 0.7
                }
            )
            generated_text = response.text.strip()

            # Extra validation to ensure the answer isn't hallucinated
            if len(context) < 50 or "don't have" in generated_text.lower() or "no relevant" in generated_text.lower():
                return (
                    "I apologize, but I don't have any documented solutions for this issue in the Jade Global knowledge base. "
                    "Kindly reach out to the Jade Global IT Support Desk for immediate assistance."
                )

            # Add branded signature
            jade_signature = (
                "\n\nIf you need further assistance, please contact the Jade Global IT Support Desk."
                "\nThank you for choosing Jade Global."
            )

            return generated_text + jade_signature

        except Exception as e:
            print(f"[ERROR] Gemini generation failed: {e}")
            return (
                "I apologize, but I encountered an error while generating the solution. "
                "Please contact the Jade Global IT Support Desk for assistance."
            )

    except Exception as e:
        print(f"[ERROR] Answer generation failed: {e}")
        return (
            "I apologize, but I encountered an unexpected error. "
            "Please reach out to the Jade Global IT Support Desk for further support."
        )
