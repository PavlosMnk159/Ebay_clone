from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from django.db.migrations.executor import MigrationExecutor
from django.db.utils import OperationalError, ProgrammingError
import os

from config.utils import load_users_from_xml

class Command(BaseCommand):
    help = 'Loads data fixtures into the database after confirming all migrations are applied.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--path',
            type=str,
            help='Path to a fixture file or directory. Can be relative or absolute.',
            required=True
        )

    def handle(self, *args, **options):
        path = options['path']

        if not self._migrations_complete():
            raise CommandError("Unapplied migrations detected. Run `python manage.py migrate` first.")

        if not os.path.exists(path):
            raise CommandError(f"Path does not exist: {path}")

        try:
            load_users_from_xml(path)
        except Exception as e:
            raise CommandError(f"Loading Failed: {e}")

    def _migrations_complete(self):
        try:
            connection = connections['default']
            executor = MigrationExecutor(connection)
            return not executor.migration_plan(executor.loader.graph.leaf_nodes())
        except (OperationalError, ProgrammingError):
            return False
