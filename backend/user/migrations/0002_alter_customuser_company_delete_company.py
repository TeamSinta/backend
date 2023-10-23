# Generated by Django 4.2.6 on 2023-10-06 01:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("company", "0001_initial"),
        ("interview_templates", "0002_alter_template_company_and_more"),
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="company",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="company.company",
            ),
        ),
        migrations.DeleteModel(
            name="Company",
        ),
    ]
