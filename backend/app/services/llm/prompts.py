


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
                            