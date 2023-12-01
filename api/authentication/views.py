import os

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView


# API receives a authorization code from FE and then goes on with creating/authenticating the user.
class GoogleLogin(SocialLoginView):
    authentication_classes = ()
    permission_classes = ()
    adapter_class = GoogleOAuth2Adapter
    callback_url = os.environ.get("FRONTEND_CALLBACK_URL")
    client_class = OAuth2Client
