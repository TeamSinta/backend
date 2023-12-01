from rest_framework import generics

from .models import File
from .serializers import FileSerializer


class FileList(generics.ListCreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer


class FileDetail(generics.RetrieveDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
