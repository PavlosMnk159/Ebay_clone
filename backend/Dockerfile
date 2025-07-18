FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Delete all migration files except __init__.py during build
RUN find . -path "*/migrations/*.py" -not -name "__init__.py" -delete && \
    find . -path "*/migrations/*.pyc" -delete

CMD python manage.py makemigrations app && \
    python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000