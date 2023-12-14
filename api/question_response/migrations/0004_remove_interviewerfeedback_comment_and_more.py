# Generated by Django 4.2.7 on 2023-11-28 14:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("interview_templates", "0002_template_image"),
        ("question_response", "0003_remove_interviewerfeedback_score_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="interviewerfeedback",
            name="comment",
        ),
        migrations.AddField(
            model_name="interviewerfeedback",
            name="template_question",
            field=models.ForeignKey(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                to="interview_templates.templatequestion",
                null=True,
            ),
            preserve_default=False,
        ),
    ]
