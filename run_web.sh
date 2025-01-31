#!/bin/sh

# Wait for the PostgreSQL server to start
sleep 10

# Change directory to the application source folder
cd /usr/src/app

# Prepare initial migrations for the 'formulavis' app
su -m myuser -c "python manage.py makemigrations formulavis"

# Apply migrations to ensure the database has the latest schema
su -m myuser -c "python manage.py migrate"

# Create a superuser with specified credentials
su -m myuser -c  "python manage.py create_superuser(
                 username='admin_formulavis',
                 email='admin@formulavis',
                 password='admin_formulavis')"

# Start the Django development server on the public IP interface, on port 8000
su -m myuser -c "python manage.py runserver backend:8000"

# Start the Celery Flower monitoring tool on port 5555
su -m myuser -c "celery -A profiles flower --port=5555"
