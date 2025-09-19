from celery.schedules import crontab

beat_schedule = {
    'check-expired-items-every-minute': {
        'task': 'auctions_tasks.tasks.check_expired_items',
        'schedule': crontab(minute='*'),  # runs every minute
    },
}