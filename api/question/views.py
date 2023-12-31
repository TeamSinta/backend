from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

# Create your views here.
from openai_helper.utils import get_embedding
from user.models import UserCompanies

from .models import Question, QuestionBank
from .serializers import QuestionBankSerializer, QuestionBankUpdateSerializer, QuestionSerializer


class QuestionBankList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionBankSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        queryset = QuestionBank.objects.filter(company=company_id)
        question = self.request.query_params.get("question")
        if question is not None:
            queryset = queryset.filter(question_id=question)
        return queryset


class QuestionBankDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionBankSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = QuestionBank.objects.filter(company=company_id)
        return queryset


class QuestionList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = Question.objects.filter(company=company_id)
        return queryset

    def perform_create(self, serializer):
        question_instance = serializer.save()
        embedding = get_embedding(question_instance.question_text)
        question_instance.embedding = embedding
        question_instance.save()


class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = Question.objects.filter(company=company_id)
        return queryset


class QuestionBankUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = QuestionBank.objects.filter(company=company_id)
        return queryset

    serializer_class = QuestionBankUpdateSerializer
