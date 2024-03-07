from rest_framework import serializers


class ErrorSerializer(serializers.Serializer):
    detail = serializers.CharField(required=True)
    # code = serializers.CharField(required=False)


class CommonResponseSerializer(serializers.Serializer):
    detail = serializers.CharField(required=True)
