python manage.py makemigrations user
python manage.py migrate user
python manage.py makemigrations
python manage.py migrate
echo "Migrations completed"
python manage.py initadmin
python manage.py initsite
python manage.py initsocial_app
python manage.py runserver 0.0.0.0:8000
