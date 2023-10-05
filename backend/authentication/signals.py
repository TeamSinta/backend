from django.dispatch import receiver
import random, string
from allauth.account.signals import user_signed_up
from allauth.socialaccount.models import SocialAccount
from user.models import Company


@receiver(user_signed_up)
def assign_profile_picture(request, user, **kwargs):
    social_account = SocialAccount.objects.filter(user=user).first()

    if social_account:
        # Set the profile picture URL from social account data
        picture_url = social_account.extra_data.get("picture", None)

        if picture_url:
            user.profile_picture = picture_url

        user.save()


@receiver(user_signed_up)
def assign_company_to_login(request, user, **kwargs):
    social_account = SocialAccount.objects.filter(user=user).first()

    if social_account:
        # Set a randomly generated company name.
        company, created = Company.objects.get_or_create(name=generate_company_name(10))

    if company:
        user.company = company

    user.save()


def generate_company_name(length):
    letters = string.ascii_letters
    result = "".join(random.choice(letters) for i in range(length))
    return result
