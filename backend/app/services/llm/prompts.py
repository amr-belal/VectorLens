


class PromptsLLM:
    
        
    @staticmethod
    def benchmark_analysis(summary:dict , use_case:str)->str:
        return f"""
                    You are a Vector Database expert. Analyze the following benchmark results and give a recommendation.

                    Use Case: {use_case}

                    Benchmark Summary:
                    {summary}

                    Please:
                    1. Explain the performance difference between the databases
                    2. Recommend the best database for this use case
                    3. Explain why in simple terms

                    Keep your response concise and practical.
                """
    @staticmethod
    def chat_llm (question:str , context:list[str])->str:
        context_text ="\n\n".join(context)
        return f"""
                    You are a helpful assistant. Answer the question based ONLY on the provided context.
                    If the answer is not in the context, say "I don't have enough information to answer this."

                    Context:
                    {context_text}

                    Question: {question}

                    Answer:
                """