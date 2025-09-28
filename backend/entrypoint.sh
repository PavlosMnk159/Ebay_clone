#!/bin/bash

mkdir -p /app/certs

if [ ! -f /app/certs/cert.pem ] || [ ! -f /app/certs/key.pem ]; then
  echo "Generating self-signed SSL certificate..."
  openssl req -x509 -nodes -days 365 \
    -newkey rsa:2048 \
    -keyout /app/certs/key.pem \
    -out /app/certs/cert.pem \
    -subj "/C=US/ST=Local/L=Local/O=DjangoDev/OU=Dev/CN=localhost"
fi

if [ "$RESET_DB" = "true" ]; then
    echo "Rebuilding the db"
    #remove the preexisting database to make sure we get a freshly loaded one for testing
    rm -f db.sqlite3
    ./delete_migrations.sh

    echo "Making migrations..."
    python manage.py makemigrations
fi



echo "Applying migrations..."
python manage.py migrate --noinput


if [ "$LOAD_USERS" = "true" ]; then

    echo "Loading initial data..."
    python manage.py load_data --users_path=data/test_users/users.xml --items_path=data/test_items/

fi

echo "Starting server..."
exec python manage.py runsslserver 0.0.0.0:8000 \
  --certificate /app/certs/cert.pem \
  --key /app/certs/key.pem