# Generated by Django 4.2.4 on 2024-01-16 18:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("question", "0008_alter_question_competency"),
    ]

    operations = [
        migrations.AlterField(
            model_name="question",
            name="competency",
            field=models.CharField(blank=True, default=None, max_length=200, null=True),
        ),
    ]