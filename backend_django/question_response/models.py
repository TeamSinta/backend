from django.db import models
from user.models import User
from question.models import Question

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transcript_chunk = models.TextField()
    start_time = models.DateTimeField(auto_now_add=True)

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
