from .base import *

print("STAGING ENVIRONMENT SETTINGS LOADED")

DEBUG = True
SECRET_KEY = os.environ.get("SECRET_KEY")

# Default Admin Account
ADMINS = [(os.environ.get("SUPERUSER"), os.environ.get("SUPERUSER_EMAIL"))]

ALLOWED_HOSTS_ENV = os.environ.get("ALLOWED_HOSTS")
ALLOWED_HOSTS = ALLOWED_HOSTS_ENV.split(",") if ALLOWED_HOSTS_ENV else []

CORS_ALLOWED_ORIGINS_ENV = os.environ.get("CORS_ALLOWED_ORIGINS")
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS_ENV.split(",") if CORS_ALLOWED_ORIGINS_ENV else []
print(ALLOWED_HOSTS)


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
STATIC_URL = "/static/static/"
MEDIA_URL = "/static/media/"
