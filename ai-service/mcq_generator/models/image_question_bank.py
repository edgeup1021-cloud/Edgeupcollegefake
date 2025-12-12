
from django.db import models
from .user_management import Admins

class QuestionBank(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    question = models.TextField()
    correct_answer = models.IntegerField()
    s3link = models.CharField(max_length=255)
    options = models.JSONField()
    explanation = models.TextField()
    question_image = models.TextField()
    option_count = models.IntegerField()
    is_image_based = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'question_bank'
