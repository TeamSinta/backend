import openai
from tenacity import retry, wait_random_exponential, stop_after_attempt
from dotenv import dotenv_values
from typing import List

keys = dotenv_values("/backend_django/.env")
EMBEDDING_MODEL = keys['EMBEDDINGS_MODEL']
openai.api_key = keys['OPENAI_API_KEY']

@retry(wait=wait_random_exponential(min=1, max=20), stop=stop_after_attempt(6))
def get_embedding(text: str) -> List[float]:
    return openai.Embedding.create(input=[text], model=EMBEDDING_MODEL)["data"][0]["embedding"]

def get_answer_notes_for_question(context_text: str, question: str) -> str:
    context = '"""' + "".join(context_text) + '"""' + "Question: " + question

    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {'role': 'system', 'content': "You are a shadow interviewer. You are incredible at summarizing chunks of interview after it's complete."},
            {'role': 'assistant', 'content': "You will be given all the information in the context and followed by a question. This is the response from an interview candidate. You are helping the interviewer gain insights from the interview. Respond in first person. Use 3-4 bullet points to respond. Throw away any content not relevant to the question."},
            {'role': 'user', 'content': context}
        ],
        temperature=0,
        top_p = 1,
    )

    return response["choices"][0]["message"]["content"]