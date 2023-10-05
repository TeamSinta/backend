from django.shortcuts import get_object_or_404
from allauth.socialaccount.models import SocialAccount
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from dj_rest_auth.views import UserDetailsView
from rest_framework.generics import RetrieveAPIView, ListAPIView
from .models import Company, CustomUser
from .serializers import CompanySerializer, CustomUserSerializer


# API for deactivating user account, hence "deleting it".
class DeleteUser(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        social_account = get_object_or_404(SocialAccount, user=request.user)

        user = social_account.user
        user.is_active = False
        user.save()

        return Response({"message": "User account deactivated"})


class CustomUserDetailsView(UserDetailsView):
    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(self.object, data=request.data, partial=True)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetCompany(RetrieveAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class CompanyMembers(ListAPIView):
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        company_id = self.kwargs["pk"]

        get_object_or_404(Company, id=company_id)

        return CustomUser.objects.filter(company__id=company_id)

    serializer_class = CustomUserSerializer
