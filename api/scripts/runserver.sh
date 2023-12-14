python manage.py makemigrations company
python manage.py makemigrations user
python manage.py makemigrations
python manage.py migrate
echo "Migrations completed"
python manage.py initsite
python manage.py initsocial_app
python manage.py runserver 0.0.0.0:8000
