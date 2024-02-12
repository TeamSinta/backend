import os

from django.shortcuts import get_object_or_404
from django.utils import timezone
from june import analytics
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from openai_helper.utils import get_embedding
from user.models import UserCompanies

from .models import Question, QuestionBank
from .serializers import (
    QuestionBankSerializer,
    QuestionBankUpdateSerializer,
    QuestionSerializer,
)

DELETE_SUCCESS = {"detail": "Successfully deleted"}

analytics.write_key = os.environ.get("JUNE_ANALYTICS_WRITE_KEY", "default_key_if_not_set")


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
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        question_instance.embedding = embedding
        question_instance.company_id = company_id
        question_instance.user_id = self.request.user.id
        user_id = self.request.user.id  # Assuming user ID is available in the request context
        analytics.identify(user_id=str(user_id), traits={"email": self.request.user.email})
        analytics.track(user_id=str(user_id), event="question_created")
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


class QuestionBankQuestionDeleteView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        question_bank_id = self.kwargs["pk"]
        question_ids = request.data.get("question_ids", [])
        user_company = get_object_or_404(UserCompanies, user=self.request.user)
        company_id = user_company.company_id
        queryset = QuestionBank.objects.filter(id=question_bank_id, company=company_id, deleted_at__isnull=True)

        if queryset.exists():
            question_bank = queryset.first()
            question_bank.questions.remove(*question_ids)
            question_bank.save()
            return Response({"detail": "Successfully deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Question bank not found"}, status=status.HTTP_404_NOT_FOUND)
