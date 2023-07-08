from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Question, Competency, QuestionBank
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import json
# Create your views here.



@csrf_exempt
def create_question(request):
    if request.method == 'POST':
        # Extract data from the request body
        payload = json.loads(request.body)
        competency_id = payload.get('competency_id')
        question_text = payload.get('question_text')
        guidelines = payload.get('guidelines')
        reply_time = payload.get('reply_time')

        # Create a new Question object
        question = Question()
        question.competency_id = competency_id
        question.question_text = question_text
        question.guidelines = guidelines
        question.reply_time = reply_time
        question.created_at = datetime.now()
        question.updated_at = datetime.now()

        # Save the question to the database
        question.save()

        # Return a JSON response
        return JsonResponse({'status': 'success', 'message': 'Question created successfully'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@csrf_exempt
def update_question(request, question_id):
    if request.method == 'PUT':
        # Extract the payload from the request
        payload = request.body.decode('utf-8')
        data = json.loads(payload)

        # Extract data from the payload
        competency_id = data.get('competency_id')
        question_text = data.get('question_text')
        guidelines = data.get('guidelines')
        reply_time = data.get('reply_time')

        # Get the existing question object from the database
        question = get_object_or_404(Question, pk=question_id)

        # Update the question fields
        if competency_id:
            question.competency_id = competency_id
        if question_text:
            question.question_text = question_text
        if guidelines:
            question.guidelines = guidelines
        if reply_time:
            question.reply_time = reply_time
        question.updated_at = datetime.now()

        # Save the updated question to the database
        question.save()

        # Return a JSON response
        return JsonResponse({'status': 'success', 'message': 'Question updated successfully'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def get_all_questions(request):


    questions = Question.objects.all()
    data = []
    for question in questions:
        data.append({
            'id': question.id,
            'competency': question.competency.competency_text,  # Use competency.competency_text
            'question_text': question.question_text,
            'guidelines': question.guidelines,
            'reply_time': question.reply_time,
            'created_at': question.created_at,
            'updated_at': question.updated_at,
        })
    return JsonResponse(data, safe=False)


@csrf_exempt
def create_question_bank(request):
    if request.method == 'POST':
        # Extract data from the request
        payload = json.loads(request.body)
        name = payload.get('name')
        question_ids = payload.get('questions', [])

        # Create a new QuestionBank object
        question_bank = QuestionBank()
        question_bank.name = name
        question_bank.save()

        # Associate the questions with the question bank
        questions = Question.objects.filter(id__in=question_ids)
        question_bank.questions.set(questions)

        # Return a JSON response
        return JsonResponse({'status': 'success', 'message': 'Question bank created successfully'})

    else:
        # Return an error response for invalid request method
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def get_all_question_banks(request):
    if request.method == 'GET':
        # Retrieve all question banks from the database
        question_banks = QuestionBank.objects.all()

        # Create a list to store the serialized question banks
        serialized_question_banks = []

        # Iterate over the question banks and serialize each one
        for question_bank in question_banks:
            serialized_question_bank = {
                'id': question_bank.id,
                'name': question_bank.name,
                'questions': [question.id for question in question_bank.questions.all()],
            }
            serialized_question_banks.append(serialized_question_bank)

        # Return the serialized question banks as JSON response
        return JsonResponse({'question_banks': serialized_question_banks})

    else:
        # Return an error response for invalid request method
        return JsonResponse({'error': 'Invalid request method'}, status=405)


def get_question_bank_questions(request, question_bank_id):
    if request.method == 'GET':
        # Retrieve the specific question bank from the database
        question_bank = get_object_or_404(QuestionBank, id=question_bank_id)

        # Retrieve the questions associated with the question bank
        questions = question_bank.questions.all()

        # Create a list to store the serialized questions
        serialized_questions = []

        # Iterate over the questions and serialize each one
        for question in questions:
            serialized_question = {
                'id': question.id,
                'competency_id': question.competency_id,
                'question_text': question.question_text,
                'guidelines': question.guidelines,
                'reply_time': question.reply_time,
                'created_at': question.created_at,
                'updated_at': question.updated_at,
            }
            serialized_questions.append(serialized_question)

        # Return the serialized questions as JSON response
        return JsonResponse({'questions': serialized_questions})

    else:
        # Return an error response for invalid request method
        return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def create_competency(request):
    if request.method == 'POST':
        # Extract data from the request
        payload = json.loads(request.body)
        competency_text = payload.get('competency_text')

        # Create a new Competency object
        competency = Competency()
        competency.competency_text = competency_text
        competency.created_at = datetime.now()
        competency.updated_at = datetime.now()

        # Save the competency to the database
        competency.save()

        # Return a JSON response
        return JsonResponse({'status': 'success', 'message': 'Competency created successfully'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


@csrf_exempt
def get_all_competencies(request):
    if request.method == 'GET':
        # Retrieve all competencies from the database
        competencies = Competency.objects.all()

        # Prepare the data to be returned
        competency_data = []
        for competency in competencies:
            competency_data.append({
                'id': competency.id,
                'competency_text': competency.competency_text,
                'created_at': competency.created_at,
                'updated_at': competency.updated_at,
            })

        # Return a JSON response
        return JsonResponse({'status': 'success', 'data': competency_data})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
