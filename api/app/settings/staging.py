from .base import *

SECRET_KEY = os.environ.get("SECRET_KEY")
DEBUG = False

# Configure your S3 settings
AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")  # "team-sinta"
AWS_S3_REGION_NAME = os.environ.get("AWS_S3_REGION_NAME")  # "eu-west-1"
AWS_S3_FILE_OVERWRITE = False
AWS_QUERYSTRING_AUTH = False

DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
# Static and Media
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATIC_URL = "/staticfiles/static/"
MEDIA_URL = "/staticfiles/media/"

# HTTPS Settings
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
# SECURE_SSL_REDIRECT = True # must be disabled for CORS

TRUSTED_CSRF_ENV = os.environ.get("CSRF_TRUSTED_ORIGINS")
CSRF_TRUSTED_ORIGINS = TRUSTED_CSRF_ENV.split(",") if TRUSTED_CSRF_ENV else []

# HSTS Settings
SECURE_HSTS_SECONDS = 3153600
SECURE_HSTS_RELOAD = True
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

# Allowed Hosts

ALLOWED_HOSTS_ENV = os.environ.get("ALLOWED_HOSTS")
ALLOWED_HOSTS = ALLOWED_HOSTS_ENV.split(",") if ALLOWED_HOSTS_ENV else []


CORS_ALLOWED_ORIGINS_ENV = os.environ.get("CORS_ALLOWED_ORIGINS")
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS_ENV.split(",") if CORS_ALLOWED_ORIGINS_ENV else []

# DB settings
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
