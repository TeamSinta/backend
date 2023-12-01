from openai import OpenAI

from tenacity import retry, wait_random_exponential, stop_after_attempt
from dotenv import dotenv_values
from typing import List
import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
KEYS = dotenv_values(BASE_DIR / ".env")

EMBEDDING_MODEL = KEYS["EMBEDDINGS_MODEL"]
client = OpenAI(api_key=KEYS["OPENAI_API_KEY"])



@retry(wait=wait_random_exponential(min=1, max=20), stop=stop_after_attempt(6))
def get_embedding(text: str) -> List[float]:
    response = client.embeddings.create(input=[text], model=EMBEDDING_MODEL)
    print(response)
    embedding_data = response.get("data", [])
    print(embedding_data)
    if embedding_data:
        return embedding_data[0].get("embedding", [])
    return []


def get_answer_notes_for_question(context_text: str, question: str) -> str:
    context = '"""' + "".join(context_text) + '"""' + "Question: " + question

    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system",
            "content": "You are a shadow interviewer. You are incredible at summarizing chunks of interview after it's complete.",
        },
        {
            "role": "assistant",
            "content": "You will be given all the information in the context and followed by a question. This is the response from an interview candidate. You are helping the interviewer gain insights from the interview. Respond in first person. Use 3-4 bullet points to respond. Throw away any content not relevant to the question. Ensure all the bullet points start with `-`.",
        },
        {"role": "user", "content": context},
    ],
    temperature=0,
    top_p=1)

    return response["choices"][0]["message"]["content"]


def summarize_interview(qa_text: str) -> str:
    """
    This function summarizes a text of all the questions and answers in an interview.

    Args:
        qa_text (str): The text of all the questions and answers in the interview.

    Returns:
        str: The summarized text.
    """
    retry = 0
    max_retries = 4
    content_generated = _summarized_interview_faq_helper(qa_text)
    content_json = []
    q_text_list = []

    while retry < max_retries:
        try:
            content_json = json.loads(content_generated)
        except json.decoder.JSONDecodeError:
            retry += 1
            content_generated = json.loads(
                _summarized_interview_faq_helper(qa_text, retry=retry)
            )
        finally:
            if len(content_json) > 1:
                break

    for qa_pair in content_json:
        q_text_list.append(qa_pair["question"])

    description = _summarized_interview_description_helper(q_text_list)

    return description, content_json


def _summarized_interview_description_helper(q_text_list: List) -> str:
    context = '"""' + " ".join(q_text_list) + '"""'
    messages = [
        {
            "role": "system",
            "content": "You are a shadow interviewer. You are incredible at summarizing chunks of questions into a description of the interview.",
        },
        {
            "role": "assistant",
            "content": "You will be given all the information in the context. The following is a set of questions. I want to generate a summarized version for these questions to form a description of the overall interview. Generate a high-level description given these interview questions to understand what was discussed in the interview. Output the result as a string. Throw away any content not relevant to the summary.",
        },
        {"role": "user", "content": context},
    ]

    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=messages,
    temperature=0,
    top_p=1)

    content_generated = response["choices"][0]["message"]["content"]

    return content_generated


def _summarized_interview_faq_helper(qa_text: str, retry: int = 0) -> str:
    context = '"""' + "".join(qa_text) + '"""'

    scold_gpt = {
        "role": "user",
        "content": "This is a bad output. Please generate content that is a list of hashes keyed by 'question' and 'answer'. The output needs to be parsed by Python's `json.loads` function.",
    }

    messages = [
        {
            "role": "system",
            "content": "You are a shadow interviewer. You are incredible at summarizing chunks of question-answer pairs into more succinct pairs of questions and answers.",
        },
        {
            "role": "assistant",
            "content": "You will be given all the information in the context. The following is a set of questions and answers. I want to generate a summarized version for these question-answer pairs. All questions start with 'Question:' and answer with 'Answer:'. Summarize all the questions into 3-4 distinct questions. And summarize the answers to respond to these questions. Show the data as question-answer pairs. Output the result as a list of JSON file where the keys are 'question' and 'answer'. Throw away any content not relevant to the summary. Ensure that the output can be parsed by the `json.loads` function in python. Ensure all the bullet points start with `-`.",
        },
        {"role": "user", "content": context},
    ]

    # Adds an additional prompt to scold GPT-3 if it generates bad output.
    if retry:
        messages.insert(-1, scold_gpt)

    response = client.chat.completions.create(model="gpt-3.5-turbo",
    messages=messages,
    temperature=0,
    top_p=1)

    content_generated = response["choices"][0]["message"]["content"]

    return content_generated
