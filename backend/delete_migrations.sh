#!/bin/bash

echo "Deleting all migration files (except __init__.py)..."

find . -path "*/migrations/*.py" ! -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete

echo "Migrations deleted."