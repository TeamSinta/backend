from rest_framework import serializers

from .models import Summary


class SummaryDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Summary
        fields = ["description"]  # Only update the description field
