#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

echo "Making migrations..."
python manage.py makemigrations

echo "Applying migrations..."
python manage.py migrate


echo "Loading initial data..."
python manage.py load_data --path=data/test_users/users.xml

echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
