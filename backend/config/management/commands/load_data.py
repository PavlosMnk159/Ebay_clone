from django.core.management.base import BaseCommand, CommandError
from django.db import connections
from django.db.migrations.executor import MigrationExecutor
from django.db.utils import OperationalError, ProgrammingError
import os

from config.utils import load_users_from_xml, load_items_from_xml

class Command(BaseCommand):
    help = 'Loads data fixtures into the database after confirming all migrations are applied.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--users_path',
            type=str,
            help='Path to a fixture file or directory containing user data. Can be relative or absolute.',
            required=True
        )
        parser.add_argument(
            '--items_path',
            type=str,
            help='Path to a fixture file or directory containing user data. Can be relative or absolute.',
            required=True
        )

    def handle(self, *args, **options):
        users_path = options['users_path']
        items_path = options['items_path']

        if not self._migrations_complete():
            raise CommandError("Unapplied migrations detected. Run `python manage.py migrate` first.")

        if not os.path.exists(users_path):
            raise CommandError(f"Users path does not exist: {users_path}")
        
        if not os.path.exists(items_path):
            raise CommandError(f"Items path does not exist: {items_path}")

        try:
            load_users_from_xml(users_path)
            load_items_from_xml(items_path)
            
        except Exception as e:
            raise CommandError(f"Loading Failed: {e}")

    def _migrations_complete(self):
        try:
            connection = connections['default']
            executor = MigrationExecutor(connection)
            return not executor.migration_plan(executor.loader.graph.leaf_nodes())
        except (OperationalError, ProgrammingError):
            return False
