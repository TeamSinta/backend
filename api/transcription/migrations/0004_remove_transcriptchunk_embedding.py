# Generated by Django 4.2.4 on 2024-03-04 06:58

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("transcription", "0003_alter_transcriptchunk_speaker_object_id"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="transcriptchunk",
            name="embedding",
        ),
    ]
