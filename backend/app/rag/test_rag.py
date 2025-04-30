from app.rag.answer_generation import generate_answer

def test_rag_pipeline():
    # Test queries
    queries = [
        "How do I fix an application that keeps crashing?",
        "What should I do if I'm having network connection issues?",
        "How can I prevent data loss in applications?"
    ]
    
    print("\nTesting RAG Pipeline...")
    print("=" * 50)
    
    for query in queries:
        print(f"\nQuery: {query}")
        print("-" * 50)
        answer = generate_answer(query)
        print(f"Answer: {answer}\n")
        print("=" * 50)

if __name__ == "__main__":
    test_rag_pipeline()