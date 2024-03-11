from celery import shared_task
from django.utils import timezone

from interview.models import InterviewRound, InterviewRoundQuestion
from openai_helper.utils import get_summarized_answer, get_transcript_summary
from question_response.models import Answer
from summary.models import Summary

from .bot import (
    start_bot,  # Ensure this import matches the location of your adapted bot.py
)
from .utils import get_transcript_from_s3, send_progress_update


@shared_task
def create_transcription_bot(meeting_url, interview_round_id):
    start_bot(meeting_url, interview_round_id)


@shared_task
def process_transcription_summary(interview_round_id):
    interview_round = InterviewRound.objects.get(pk=interview_round_id)
    transcript_data = get_transcript_from_s3(interview_round_id)

    send_progress_update(interview_round_id, "Summarization process started")

    transcriptions = transcript_data.get("transcriptions", [])
    transcript_text = " ".join(transcriptions)
    send_progress_update(interview_round_id, "Summarizing Interview")
    transcript_summary = get_transcript_summary(transcript_text)

    question_answers = []
    for interview_round_question in InterviewRoundQuestion.objects.filter(interview_round=interview_round):
        template_question = interview_round_question.question
        actual_question = template_question.question
        question_text = actual_question.question_text

        send_progress_update(interview_round_id, f"Processing Answers for: {question_text}")

        summarized_answer = get_summarized_answer(question_text, transcript_text)
        question_answers.append(
            {
                "question": question_text,
                "answer": summarized_answer,
            }
        )

    save_summary_and_qa(interview_round, transcript_summary, question_answers)

    send_progress_update(interview_round_id, "Summarization and QA processing completed")

    return print("Summarization and Q&A processing completed")


def save_summary_and_qa(interview_round, transcript_summary, question_answers):
    try:
        summary_instance, summary_created = Summary.objects.update_or_create(
            interview_round=interview_round,
            defaults={
                "description": transcript_summary,
                "company": interview_round.company,
                "user": interview_round.user,
                "updated_at": timezone.now(),
            },
        )
        print(f"{'Created' if summary_created else 'Updated'} summary for interview_round ID: {interview_round.id}")

        for qa in question_answers:
            question_text = qa["question"]
            answer_text = qa["answer"]

            # Corrected to traverse the relationships properly
            interview_round_question = InterviewRoundQuestion.objects.filter(
                interview_round=interview_round,
                question__question__question_text=question_text,  # Note the double underscore syntax here
            ).first()

            if interview_round_question:
                answer, answer_created = Answer.objects.update_or_create(
                    question=interview_round_question,
                    defaults={
                        "answer_text": answer_text,
                        "updated_at": timezone.now(),
                    },
                )
                print(f"{'Created' if answer_created else 'Updated'} answer for question: {question_text}")
            else:
                print(f"No matching InterviewRoundQuestion found for question: {question_text}")

        return print("Success: Summary and answers processed and saved.")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return "Error: An issue occurred during processing."
