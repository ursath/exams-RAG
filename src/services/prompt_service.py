from src.types.services import UserPrompt, Metadata, Exercise
from src.services.s3_service import s3_service
from src.services.retrieval_service import retrieval_service
from src.services.llm_service import llm_service
from src.helpers.exam_format_validator import ExamAnalysis, Topic
from src.constants.instructions import exam_generating_instructions
from src.constants.services import exam_type_names
from src.constants.subjects import subjects
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
            notes = "\n- ".join(documents)
            topic_context = f"## {topic}\n- {notes}\n"
            contexts.append(topic_context)
        context_string = "".join(contexts)
        
        prettified_exercises = json.dumps(exercise_list, indent=4)

        subject_name = list(filter(lambda x: x['subject']==subject, subjects))[0]['i18n']['es']
        prompt = exam_generating_instructions.format(subject=subject_name, exam_type=exam_type_names[exam_type], exercise_list=prettified_exercises, context_string=context_string)
        print(prompt)
        return llm_service.prompt(system_instructions=prompt, stream=True)

prompt_service = PromptService()

# for msg in prompt_service.process_prompt(UserPrompt(subject="software_project_management", type="midterm1")):
#   print(msg, end="", flush=True)
