# Generated by Django 4.2.4 on 2024-03-04 06:58

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("question", "0009_alter_question_competency"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="question",
            name="embedding",
        ),
    ]