# Generated by Django 4.2.7 on 2023-12-07 05:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("interview_templates", "0002_template_image"),
        ("question_response", "0008_merge_20231130_2344"),
    ]

    operations = [
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
