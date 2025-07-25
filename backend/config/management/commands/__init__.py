from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.db import connections
from django.db.migrations.executor import MigrationExecutor
from django.db.utils import OperationalError, ProgrammingError


class Command(BaseCommand):
    help = 'Loads initial or seed data into the database after confirming all migrations are applied.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("🔍 Checking migration state..."))

        if not self._migrations_complete():
            raise CommandError("Unapplied migrations detected. Run `python manage.py migrate` first.")


        try:
            # Use Django fixtures
            call_command('loaddata', 'initial_data.json')


        except Exception as e:
            raise CommandError(f"Failed to load data: {e}")

    def _migrations_complete(self):
        try:
            connection = connections['default']
            executor = MigrationExecutor(connection)
            return not executor.migration_plan(executor.loader.graph.leaf_nodes())
        except (OperationalError, ProgrammingError):
            return False
