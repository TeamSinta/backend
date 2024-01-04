from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Create your views here.
from openai_helper.utils import get_embedding
from user.models import UserCompanies

from .models import Question, QuestionBank
from .serializers import QuestionBankSerializer, QuestionBankUpdateSerializer, QuestionSerializer

DELETE_SUCCESS = {"detail": "Successfully deleted"}


class BaseDeleteInstance(generics.DestroyAPIView):
    def perform_destroy(self, instance):
        instance.deleted_at = timezone.now()
        instance.deleted_by = self.request.user
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(DELETE_SUCCESS, status=status.HTTP_204_NO_CONTENT)


class QuestionBankList(BaseDeleteInstance, generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionBankSerializer

    def post(self, request, *args, **kwargs):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)

        # Associate the company from the logged-in user
        request.data["company"] = user_company.company_id
        request.data["user"] = user_company.user_id

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id

        queryset = QuestionBank.objects.filter(company=company_id, deleted_at__isnull=True)
        question = self.request.query_params.get("question")
        if question is not None:
            queryset = queryset.filter(question_id=question)
        return queryset


class QuestionBankDetail(BaseDeleteInstance, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionBankSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = QuestionBank.objects.filter(company=company_id, deleted_at__isnull=True)
        return queryset


class QuestionList(BaseDeleteInstance, generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = Question.objects.filter(company=company_id, deleted_at__isnull=True)

        return queryset

    def perform_create(self, serializer):
        question_instance = serializer.save()
        embedding = get_embedding(question_instance.question_text)
        question_instance.embedding = embedding
        question_instance.save()


class QuestionDetail(BaseDeleteInstance, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = Question.objects.filter(company=company_id, deleted_at__isnull=True)
        return queryset


class QuestionBankUpdateView(BaseDeleteInstance, generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = QuestionBank.objects.filter(company=company_id)
        return queryset

    serializer_class = QuestionBankUpdateSerializer
