# Generated by Django 4.2.7 on 2023-11-28 14:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("interview", "0004_alter_interviewround_candidate"),
    ]

    operations = [
        migrations.AddField(
            model_name="interviewroundquestion",
            name="time",
            field=models.CharField(blank=True, null=True),
        ),
    ]
