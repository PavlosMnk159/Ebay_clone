#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

#remove the preexisting database to make sure we get a freshly loaded one for testing
rm -f db.sqlite3
./delete_migrations.sh

echo "Making migrations..."
python manage.py makemigrations

echo "Applying migrations..."
python manage.py migrate


echo "Loading initial data..."
python manage.py load_data --users_path=data/test_users/users.xml --items_path=data/test_items/

echo "Create Workers for automated background tasks"
celery -A background_tasks worker -l info
celery -A background_tasks beat -l info

echo "Starting server..."
exec python manage.py runserver 0.0.0.0:8000
