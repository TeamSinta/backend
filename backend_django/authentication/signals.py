from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from allauth.socialaccount.models import SocialAccount


@receiver(user_signed_up)
def social_login_fname_lname_profilepic(request, user, **kwargs):
    social_account = SocialAccount.objects.filter(user=user).first()

    if social_account:
        # Set the profile picture URL from social account data
        picture_url = social_account.extra_data.get("picture", None)

        if picture_url:
            user.profile_picture = picture_url

        user.save()
