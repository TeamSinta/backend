# Generated by Django 4.2.7 on 2023-12-01 01:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("question_response", "0008_merge_20231130_2344"),
    ]

    operations = [
        migrations.AddField(
            model_name="interviewerfeedback",
            name="comment",
            field=models.CharField(max_length=255, null=True),
        ),
    ]