from django.shortcuts import get_object_or_404
from allauth.socialaccount.models import SocialAccount
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser

# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework_simplejwt.views import TokenObtainPairView


# API for deactivating user account, hence "deleting it".
class DeleteUser(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        social_account = get_object_or_404(SocialAccount, user=request.user)

        user = social_account.user
        user.is_active = False
        user.save()

        return Response({"message": "User account deactivated"})
