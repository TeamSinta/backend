from rest_framework import generics
from rest_framework.permissions import IsAuthenticated


# Create your views here.
from openai_helper.utils import get_embedding

from .models import Question, QuestionBank
from .serializers import QuestionBankSerializer, QuestionBankUpdateSerializer, QuestionSerializer


class QuestionBankList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionBankSerializer

    def get_queryset(self):
        queryset = QuestionBank.objects.all()
        question = self.request.query_params.get("question")
        if question is not None:
            queryset = queryset.filter(question_id=question)
        return queryset


class QuestionBankDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionBankSerializer
    queryset = QuestionBank.objects.all()


class QuestionList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def perform_create(self, serializer):
        question_instance = serializer.save()
        embedding = get_embedding(question_instance.question_text)
        question_instance.embedding = embedding
        question_instance.save()


class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()


class QuestionBankUpdateView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = QuestionBank.objects.all()
    serializer_class = QuestionBankUpdateSerializer
