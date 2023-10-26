python manage.py makemigrations company
python manage.py makemigrations user
python manage.py makemigrations
python manage.py migrate
echo "Migrations completed"
python manage.py initadmin
python manage.py initsite
python manage.py initsocial_app
echo "Seeding Database"
python manage.py seed_users
python manage.py seed_questions
python manage.py seed_templates
python manage.py seed_interviews
python manage.py runserver 0.0.0.0:8000
