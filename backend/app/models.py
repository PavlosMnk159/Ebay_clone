from django.db import models

class AppState(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    
    class Meta:
        app_label = 'app'
    
    @classmethod
    def get_ready_status(cls):
        try:
            state = cls.objects.get(key='ready')
            return state.value.lower() == 'true'
        except cls.DoesNotExist:
            return False
    
    @classmethod
    def set_ready_status(cls, ready):
        state, created = cls.objects.get_or_create(
            key='ready',
            defaults={'value': str(ready).lower()}
        )
        if not created:
            state.value = str(ready).lower()
            state.save()