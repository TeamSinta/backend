from django.db import models
from user.models import User
from interview.models import InterviewRoundQuestion
from pgvector.django import VectorField

class Answer(models.Model):
    question = models.ForeignKey(InterviewRoundQuestion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class AnswerChunk(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    answer_text = models.TextField()
    answer_text_embeddings = VectorField(dimensions=1536, null=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(auto_now=True)

class InterviewerFeedback(models.Model):
    class EmojiChoice(models.IntegerChoices):
        FIRE = 1
        THUMBS_UP = 2
        THUMBS_DOWN = 3
        HEART = 4
        LAUGH = 5

    class ScoreChoice(models.IntegerChoices):
        ONE = 1
        TWO = 2
        THREE = 3
        FOUR = 4
        FIVE = 5

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    note = models.TextField()
    reaction = models.IntegerField(choices=EmojiChoice.choices)
    score = models.IntegerField(choices=ScoreChoice.choices)
