# Generated by Django 4.2.4 on 2024-01-03 07:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("company", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="company",
            name="deleted_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="department",
            name="deleted_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
