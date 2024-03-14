import json
import os
from pathlib import Path
from typing import List

from openai import OpenAI
from tenacity import retry, stop_after_attempt, wait_random_exponential

BASE_DIR = Path(__file__).resolve().parent.parent

EMBEDDING_MODEL = os.environ.get("EMBEDDINGS_MODEL")
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def get_summarized_answer(question, transcript):
    """Generates a summarized answer from a question and transcript using OpenAI's API."""
    try:
        context = f'Question: {question}\nTranscript: """{"".join(transcript)}"""'
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a shadow interviewer. You are incredible at summarizing chunks of interview after it's complete.",
                },
                {
                    "role": "assistant",
                    "content": "You will be given information in the context and followed by a question. This information is the response from an interview candidate. Your task is to help the interviewer evaluate the candidate's response and provide insights. Write your evaluation and insights in the first person, as if you are the interviewer. Ensure your response is formatted in HTML, using <p>, <li>, <ol>, and <strong> tags to organize your insights clearly. Do not use header tags. Directly address the information provided, without adding or inferring information not mentioned.Focus on providing insights related to the interview question, excluding irrelevant content. If the candidate's feedback contains ambiguities, note these ambiguities but avoid speculation or assumptions beyond the provided information.",
                },
                {"role": "user", "content": context},
            ],
            "temperature": 0.5,
            "max_tokens": 150,
            "top_p": 1.0,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0,
        }
        print("Payload before API call:", payload)  # Debug print
        response = client.chat.completions.create(**payload)
        print("Raw response:", response)  # Debug print to inspect the raw response structure
        last_message = response.choices[0].message.content
        return last_message.strip()
    except Exception as e:
        print(f"Error in generating summary: {str(e)}")
        return "Error in generating summary."


def get_transcript_summary(transcript_text):
    """Generates a summary for the entire interview transcript using OpenAI's API."""
    try:
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a shadow interviewer. You are incredible at summarizing chunks of interview after it's complete.",
                },
                {
                    "role": "assistant",
                    "content": "You will be given all necessary information in the context. Your task is to create a concise summary for the interviewer. Format your summary using HTML, employing <p> tags for paragraphs and <h1> or <h2> tags for headings to organize and highlight main points or sections. Exclude any information not directly relevant to the core insights of the interview. Rely solely on the provided context without introducing any new information or assumptions.",
                },
                {"role": "user", "content": transcript_text},
            ],
            "temperature": 0.5,
            "max_tokens": 300,
            "top_p": 1.0,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0,
        }
        print("Payload before API call:", payload)  # Debug print
        response = client.chat.completions.create(**payload)
        print("Raw response:", response)  # Debug print to inspect the raw response structure
        last_message = response.choices[0].message.content
        return last_message.strip()
    except Exception as e:
        print(f"Error in generating transcript summary: {str(e)}")
        return "Error in generating transcript summary."


@retry(wait=wait_random_exponential(min=1, max=20), stop=stop_after_attempt(6))
def get_embedding(text: str) -> List[float]:
    response = client.embeddings.create(input=[text], model=EMBEDDING_MODEL)
    embedding_data = response.data if response.data else []
    print(embedding_data)
    if embedding_data:
        return embedding_data[0].embedding if hasattr(embedding_data[0], "embedding") else []
    return []


def get_answer_notes_for_question(context_text: str, question: str) -> str:
    context = '"""' + "".join(context_text) + '"""' + "Question: " + question

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
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
        top_p=1,
    )

    response_message = response.choices[0].message.content
    print(response_message)

    return ""


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
            content_generated = _summarized_interview_faq_helper(qa_text, retry=retry)
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

    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages, temperature=0, top_p=1)

    if response.choices and len(response.choices) > 0:
        first_choice = response.choices[0]
        if hasattr(first_choice, "message") and first_choice.message:
            return first_choice.message.content
    return ""


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
            "content": "You will be given all the information in the context. The following is a set of questions and answers. I want to generate a summarized version for these question-answer pairs. All questions start with 'Question:' and answers with 'Answer:'. Summarize all the questions into 3-4 distinct questions. And summarize the answers to respond to these questions. Show the data as question-answer pairs. Output the result as a list of JSON file where the keys are 'question' and 'answer'. Throw away any content not relevant to the summary. Ensure that the output can be parsed by the `json.loads` function in python. Ensure all the bullet points start with `-`.",
        },
        {"role": "user", "content": context},
    ]

    # Adds an additional prompt to scold GPT-3 if it generates bad output.
    if retry:
        messages.insert(-1, scold_gpt)

    response = client.chat.completions.create(model="gpt-3.5-turbo", messages=messages, temperature=0, top_p=1)

    if response.choices and len(response.choices) > 0:
        first_choice = response.choices[0]
        if hasattr(first_choice, "message") and first_choice.message:
            return first_choice.message.content
    return ""
