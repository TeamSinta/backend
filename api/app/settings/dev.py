from .base import *

print("DEV ENVIRONMENT SETTINGS LOADED")
DEBUG = True
SECRET_KEY = os.environ.get("SECRET_KEY")

# Default Admin Account
ADMINS = [(os.environ.get("SUPERUSER"), os.environ.get("SUPERUSER_EMAIL"))]

ALLOWED_HOSTS = ["localhost", "*"]
CORS_ALLOWED_ORIGINS = ["http://localhost:3001", "https://localhost"]

# Database Settings
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST"),
        "PORT": os.environ.get("DB_PORT"),
    }
}

# Static and Media
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = "/staticfiles/static/"
MEDIA_URL = "/staticfiles/media/"
