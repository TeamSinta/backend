# Generated by Django 4.2.7 on 2023-11-28 14:53

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("question_response", "0003_remove_interviewerfeedback_score_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="interviewerfeedback",
            name="time",
            field=models.CharField(blank=True, null=True),
        ),
    ]
