from .base import *

print("DEV ENVIRONMENT SETTINGS LOADED")
DEBUG = True
SECRET_KEY = os.environ.get("SECRET_KEY")

INSTALLED_APPS += ["drf_spectacular"]

rest_framework_settings = REST_FRAMEWORK.copy()
rest_framework_settings.update(
    {
        "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    }
)
REST_FRAMEWORK = rest_framework_settings

SPECTACULAR_SETTINGS = {
    "TITLE": "Sinta API",
    "DESCRIPTION": "Endpoint documentation for Sinta running Django DRF.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")  # "team-sinta"
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME")  # "eu-west-1"
AWS_S3_FILE_OVERWRITE = False
AWS_QUERYSTRING_AUTH = False

DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"

ALLOWED_HOSTS = ["*"]
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3001",
    "https://9fa0-212-78-174-2.ngrok-free.app ",
    "http://localhost",
    "http://127.0.0.1:3001",
    "http://127.0.0.1",
]

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
STATIC_ROOT = "vol/web/static"
STATIC_URL = "/static/"
MEDIA_URL = "/media/"
