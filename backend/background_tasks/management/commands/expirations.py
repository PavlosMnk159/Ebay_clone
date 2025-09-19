from django.core.management.base import BaseCommand
from background_tasks.tasks import check_expired_items

class Command(BaseCommand):
    help = 'Check expired items (manual run)'

    def handle(self, *args, **options):
        check_expired_items.delay()  # run asynchronously via Celery
        self.stdout.write("Triggered check_expired_items task")