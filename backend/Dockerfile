FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /app

CMD python manage.py makemigrations app && \
    python manage.py migrate && \
    python manage.py runserver 0.0.0.0:8000