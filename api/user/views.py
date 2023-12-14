from allauth.socialaccount.models import SocialAccount
from dj_rest_auth.views import UserDetailsView
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from company.models import Department
from company.serializers import DepartmentSerializer
from user.models import UserCompanies, UserDepartments

from .models import CustomUser
from .serializers import CustomUserSerializer


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
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(self.object, data=request.data, partial=True)

        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUserByUsername(APIView):
    # permission_classes = [IsAuthenticated, isAdminRole, isInterviewerRole]

    def get(self, request, username):
        # Use the get_object_or_404 method to try to get a user by their username.
        user = get_object_or_404(CustomUser, username=username)

        # Serialize the user instance.
        serializer = CustomUserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)


class GetUserById(APIView):
    # permission_classes = [IsAuthenticated, isAdminRole, isInterviewerRole]

    def get(self, request, candidate_id):
        # Use the get_object_or_404 method to try to get a user by their username.
        user = get_object_or_404(CustomUser, id=candidate_id)

        # Serialize the user instance.
        serializer = CustomUserSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDepartmentsView(ListAPIView):
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        company_id = self.kwargs["pk"]

        get_object_or_404(UserCompanies, user__id=user_id, company__id=company_id)

        user_departments = UserDepartments.objects.filter(user__id=user_id, department__company__id=company_id)

        department_ids = user_departments.values_list("department_id", flat=True)
        return Department.objects.filter(id__in=department_ids)
