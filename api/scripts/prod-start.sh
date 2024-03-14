#!/bin/bash
# Start Celery worker in the background
celery -A app worker --loglevel=info &
# Perform other startup tasks
python manage.py makemigrations company
python manage.py makemigrations user
python manage.py makemigrations
python manage.py migrate
python manage.py initsite
python manage.py initsocial_app
python manage.py collectstatic --noinput
# Finally, start the Daphne server
daphne -p $PORT -b 0.0.0.0 app.asgi:application
