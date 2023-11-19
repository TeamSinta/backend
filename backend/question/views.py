from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpRequest, HttpResponse
from .models import Question, Competency, QuestionBank
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from rest_framework import generics
from .serializers import (
    QuestionSerializer,
    QuestionBankSerializer,
    QuestionBankUpdateSerializer,
)

# Create your views here.
from openai_helper.utils import get_embedding


class QuestionBankList(generics.ListCreateAPIView):
    serializer_class = QuestionBankSerializer

    def get_queryset(self):
        queryset = QuestionBank.objects.all()
        question = self.request.query_params.get("question")
        if question is not None:
            queryset = queryset.filter(question_id=question)
        return queryset


class QuestionBankDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionBankSerializer
    queryset = QuestionBank.objects.all()


class QuestionList(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def perform_create(self, serializer):
        question_instance = serializer.save()
        embedding = get_embedding(question_instance.question_text)
        question_instance.embedding = embedding
        question_instance.save()


class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()


class QuestionBankUpdateView(generics.RetrieveUpdateAPIView):
    queryset = QuestionBank.objects.all()
    serializer_class = QuestionBankUpdateSerializer
