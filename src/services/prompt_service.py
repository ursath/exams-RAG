from src.types.services import UserPrompt, Metadata, Exercise
from src.services.s3_service import s3_service
from src.services.retrieval_service import retrieval_service
from src.services.llm_service import llm_service
from src.helpers.exam_format_validator import ExamAnalysis, Topic
from src.constants.instructions import exam_generating_instructions
import json
import random
import math

class PromptService:

    def _filter_topics(self, exam_format:ExamAnalysis, exam_type: str) -> list[Topic]:
        match exam_type:
            case "final":
                return [t for t in exam_format.topics if t.final_appearances > 0.0]
            case "midterm1":
                return [t for t in exam_format.topics if t.midterm1_appearances > 0.0]
            case "midterm2":
                return [t for t in exam_format.topics if t.midterm2_appearances > 0.0]

    def _select_topics(self, exam_format: ExamAnalysis, exam_type: str) -> list[Exercise]:
        topics:list[Topic] = self._filter_topics(exam_format, exam_type)
        total_exercises = round(exam_format.exercise_amount_avg)

        match exam_type:
            case "final":
                freqs = [t.final_appearances for t in topics]
            case "midterm1":
                freqs = [t.midterm1_appearances for t in topics]
            case "midterm2":
                freqs = [t.midterm2_appearances for t in topics]

        selected: list[Exercise] = []
        topic_counts = {t.topic: 0 for t in topics}

        while len(selected) < total_exercises and topics:
            topic = random.choices(topics, weights=freqs, k=1)[0]
            exercise_type = self._select_exercise_type(topic)
            selected.append(Exercise(topic=topic.topic, type=exercise_type))
            topic_counts[topic.topic] += 1

            #si ya se selecciono mas del promedio de veces que aparece, no se vuelve a seleccionar
            idx = topics.index(topic)
            if topic_counts[topic.topic] >= math.ceil(freqs[idx]):
                topics.pop(idx)
                freqs.pop(idx)

        return selected
    
    def _select_exercise_type(self, topic: Topic) -> str:
        types = ["true_or_false", "multiple_choice", "essay"]
        true_or_false_amount = topic.true_or_false_amount
        multiple_choice_amount = topic.multiple_choice_amount
        essay_amount = topic.essay_amount
        total = true_or_false_amount + multiple_choice_amount + essay_amount
        type_frequency = [true_or_false_amount/total, multiple_choice_amount/total, essay_amount/total]
        return random.choices(types, type_frequency, k=1)[0]

    def process_prompt(self, user_prompt: UserPrompt):
        subject = user_prompt['subject']
        exam_type = user_prompt['type']

        s3_key = f"{subject}/exams/format.json"
        exam_format_str = s3_service.retrieve_file(s3_key)
        exam_format_json = json.loads(exam_format_str)
        exam_format = ExamAnalysis(**exam_format_json)

        exercise_list = self._select_topics(exam_format, exam_type)
        topics_set = {e["topic"] for e in exercise_list}
        topics = [e for e in topics_set]
        documets_by_topic = retrieval_service.retrieve(topics, Metadata(subject=subject))
        
        contexts = []
        for topic in topics:
            if topic not in documets_by_topic:
                continue
            documents = documets_by_topic[topic]
            notes = "\n".join(documents)
            topic_context = f"## {topic}\n{notes}\n"
            contexts.append(topic_context)
        context_string = "".join(contexts)

        prompt = exam_generating_instructions.format(subject=subject, exam_type=exam_type, exercise_list=exercise_list, context_string=context_string)
        
        return llm_service.prompt(system_instructions=prompt, stream=True)

prompt_service = PromptService()

# exam_example = ExamAnalysis(
#     subject="Computer Science",
#     exercise_amount_avg=12,
#     exams_amount=6,
#     topics=[
#         Topic(
#             topic="Data Structures",
#             exercises_per_exam_avg=3.5,
#             true_or_false_amount=2,
#             multiple_choice_amount=4,
#             essay_amount=1,
#             midterm1_appearances=1.2,
#             midterm2_appearances=0.8,
#             final_appearances=2.4,
#         ),
#         Topic(
#             topic="Algorithms",
#             exercises_per_exam_avg=3.0,
#             true_or_false_amount=1,
#             multiple_choice_amount=3,
#             essay_amount=2,
#             midterm1_appearances=2.1,
#             midterm2_appearances=1.7,
#             final_appearances=1.9,
#         ),
#         Topic(
#             topic="Computer Architecture",
#             exercises_per_exam_avg=2.2,
#             true_or_false_amount=1,
#             multiple_choice_amount=2,
#             essay_amount=0,
#             midterm1_appearances=1.3,
#             midterm2_appearances=0.9,
#             final_appearances=1.1,
#         ),
#         Topic(
#             topic="Operating Systems",
#             exercises_per_exam_avg=2.8,
#             true_or_false_amount=0,
#             multiple_choice_amount=3,
#             essay_amount=1,
#             midterm1_appearances=0.7,
#             midterm2_appearances=1.5,
#             final_appearances=1.3,
#         ),
#         Topic(
#             topic="Databases",
#             exercises_per_exam_avg=2.0,
#             true_or_false_amount=2,
#             multiple_choice_amount=2,
#             essay_amount=1,
#             midterm1_appearances=0.9,
#             midterm2_appearances=1.2,
#             final_appearances=1.6,
#         ),
#         Topic(
#             topic="Software Engineering",
#             exercises_per_exam_avg=3.1,
#             true_or_false_amount=1,
#             multiple_choice_amount=4,
#             essay_amount=2,
#             midterm1_appearances=1.8,
#             midterm2_appearances=2.0,
#             final_appearances=2.7,
#         ),
#         Topic(
#             topic="Computer Networks",
#             exercises_per_exam_avg=2.3,
#             true_or_false_amount=1,
#             multiple_choice_amount=3,
#             essay_amount=1,
#             midterm1_appearances=0.6,
#             midterm2_appearances=1.0,
#             final_appearances=1.4,
#         ),
#     ],
# )

# selected_final = prompt_service.select_topics(exam_example, "final")

# print(f"Total selected: {len(selected_final)}")
# for s in selected_final:
#     print(s)
