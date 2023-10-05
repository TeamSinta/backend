from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpRequest, HttpResponse
from .models import Question, Competency, QuestionBank
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json

# Create your views here.
from openai_helper.utils import get_embedding


@csrf_exempt
def create_question(request: HttpRequest) -> JsonResponse:
    if request.method == "POST":
        payload = json.loads(request.body)
        question_text = payload.get("question_text")
        guidelines = payload.get("guidelines")
        reply_time = payload.get("reply_time")
        review = payload.get("review")

        question = Question()
        question.question_text = question_text
        question.guidelines = guidelines
        question.reply_time = reply_time
        question.embedding = get_embedding(
            question_text
        )  # Assuming you have a function called get_embedding
        question.created_at = datetime.now()
        question.updated_at = datetime.now()

        # Set the review field if provided
        if review is not None:
            question.review = review

        question.save()

        return JsonResponse(
            {"status": "success", "message": "Question created successfully"}
        )
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})


@csrf_exempt
def update_question(request: HttpRequest, question_id: int) -> JsonResponse:
    if request.method == "PUT":
        payload = json.loads(request.body.decode("utf-8"))

        question_text = payload.get("question_text")
        guidelines = payload.get("guidelines")
        reply_time = payload.get("reply_time")
        review = payload.get("review")

        question = get_object_or_404(Question, pk=question_id)

        if question_text:
            question.question_text = question_text
        if guidelines:
            question.guidelines = guidelines
        if reply_time:
            question.reply_time = reply_time

        # Update the review field if provided
        if review is not None:
            question.review = review

        question.updated_at = datetime.now()

        question.save()

        return JsonResponse(
            {"status": "success", "message": "Question updated successfully"}
        )
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})


def get_all_questions(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        questions = Question.objects.all()
        data = []
        for question in questions:
            data.append(
                {
                    "id": question.id,
                    "question_text": question.question_text,
                    "guidelines": question.guidelines,
                    "reply_time": question.reply_time,
                    "competency": question.competency,
                    "created_at": question.created_at,
                    "updated_at": question.updated_at,
                }
            )
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})


@csrf_exempt
def create_question_bank(request: HttpRequest) -> JsonResponse:
    if request.method == "POST":
        payload = json.loads(request.body)
        name = payload.get("name")
        question_ids = payload.get("questions", [])

        question_bank = QuestionBank()
        question_bank.name = name
        question_bank.save()

        questions = Question.objects.filter(id__in=question_ids)
        question_bank.questions.set(questions)

        return JsonResponse(
            {"status": "success", "message": "Question bank created successfully"}
        )

    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})


def get_all_question_banks(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        question_banks = QuestionBank.objects.all()
        serialized_question_banks = []

        for question_bank in question_banks:
            serialized_questions = []
            for question in question_bank.questions.all():
                serialized_question = {
                    "id": question.id,
                    "title": question.question_text,
                    "competencies": question.competency,
                    "time": question.reply_time,
                    "level": question.difficulty,
                    "detail": question.guidelines,
                }
                serialized_questions.append(serialized_question)

            serialized_question_bank = {
                "id": question_bank.id,
                "title": question_bank.title,
                "questions": serialized_questions,
            }
            serialized_question_banks.append(serialized_question_bank)

        return JsonResponse({"question_banks": serialized_question_banks})

    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


def get_question_bank_questions(
    request: HttpRequest, question_bank_id: int
) -> JsonResponse:
    if request.method == "GET":
        question_bank = get_object_or_404(QuestionBank, id=question_bank_id)

        questions = question_bank.questions.all()

        serialized_questions = []

        for question in questions:
            serialized_question = {
                "id": question.id,
                "competency_id": question.competency_id,
                "question_text": question.question_text,
                "guidelines": question.guidelines,
                "reply_time": question.reply_time,
                "created_at": question.created_at,
                "updated_at": question.updated_at,
            }
            serialized_questions.append(serialized_question)

        return JsonResponse({"questions": serialized_questions})

    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def create_competency(request: HttpRequest) -> JsonResponse:
    if request.method == "POST":
        payload = json.loads(request.body)
        competency_text = payload.get("competency_text")

        competency = Competency()
        competency.competency_text = competency_text
        competency.created_at = datetime.now()
        competency.updated_at = datetime.now()

        competency.save()

        return JsonResponse(
            {"status": "success", "message": "Competency created successfully"}
        )
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})


@csrf_exempt
def get_all_competencies(request: HttpRequest) -> JsonResponse:
    if request.method == "GET":
        competencies = Competency.objects.all()

        competency_data = []
        for competency in competencies:
            competency_data.append(
                {
                    "id": competency.id,
                    "competency_text": competency.competency_text,
                    "created_at": competency.created_at,
                    "updated_at": competency.updated_at,
                }
            )

        return JsonResponse({"status": "success", "data": competency_data})
    else:
        return JsonResponse({"status": "error", "message": "Invalid request method"})
