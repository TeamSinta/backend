# Generated by Django 4.2.4 on 2024-01-04 14:02

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("interview_templates", "0006_rename_company_id_templatetopic_company"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="templatequestion",
            name="company",
        ),
        migrations.RemoveField(
            model_name="templatequestion",
            name="user",
        ),
    ]
