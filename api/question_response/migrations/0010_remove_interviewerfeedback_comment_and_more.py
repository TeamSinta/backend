# Generated by Django 4.2.7 on 2023-12-01 06:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("interview_templates", "0002_template_image"),
        ("question_response", "0009_interviewerfeedback_comment"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="interviewerfeedback",
            name="comment",
        ),
        migrations.AlterField(
            model_name="interviewerfeedback",
            name="template_question",
            field=models.ForeignKey(
                default=None,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="interview_templates.templatequestion",
            ),
        ),
    ]
