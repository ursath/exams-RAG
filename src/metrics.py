from typing import List
from ragas.metrics import LLMContextPrecisionWithoutReference, Faithfulness, AnswerRelevancy
from datasets import Dataset
from ragas import evaluate
from src.services.environment_service import environment_service
from ragas.llms import LangchainLLMWrapper
from langchain_openai import ChatOpenAI


class MetricsEvaluator:
    def __init__(self):
        self.evaluator_llm = LangchainLLMWrapper(ChatOpenAI(openai_api_key=environment_service.get_openai_api_key(), model_name="gpt-4.1", temperature=0))

    def _get_exercises(self, response: str) -> List[str]:
        exercises = response.split('---')
        exercises = [exercise.strip() for exercise in exercises if exercise.strip() != ''][1:]
        return exercises

    def _get_topics_and_contexts(self, context_retrieval_response: dict):
        topics = context_retrieval_response.keys()
        contexts = context_retrieval_response.values()
        return topics, contexts

    async def evaluate_response(self, context_retrieval_response: dict, response: str) -> dict:
        raw_data = {'question': [], 'answer': [], 'contexts': []}
        topics, contexts = self._get_topics_and_contexts(context_retrieval_response)
        exercises = self._get_exercises(response)

        for exercise, topic, context in zip(exercises, topics, contexts):
            raw_data['question'].append(topic)
            raw_data['answer'].append(exercise)
            raw_data['contexts'].append(context) 

        dataset = Dataset.from_dict(raw_data)

        precision_evaluator = LLMContextPrecisionWithoutReference(llm=self.evaluator_llm)
        faithfulness_evaluator = Faithfulness(llm=self.evaluator_llm)
        relevancy_evaluator = AnswerRelevancy(llm=self.evaluator_llm)

        results = evaluate(
            dataset,
            metrics=[precision_evaluator, faithfulness_evaluator, relevancy_evaluator],
        )

        results_formatted = results.to_pandas().to_dict('records')
        print(results_formatted)

metrics_evaluator = MetricsEvaluator()
