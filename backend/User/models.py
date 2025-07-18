from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

class AppState(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    
    class Meta:
        app_label = 'app'
    
    @classmethod
    def get_ready_status(cls):
        try:
            state = cls.objects.get(key='ready')
            print(state.value.lower())
            return state.value.lower() == 'true'
        except cls.DoesNotExist:
            cls.objects.create(key='ready', value='true')
            return True
    
    @classmethod
    def set_ready_status(cls, ready=True):
        state, created = cls.objects.get_or_create(
            key='ready',
            defaults={'value': str(ready).lower()}
        )
        if not created:
            state.value = str(ready).lower()
            state.save()

class CustomUser(AbstractUser):
    country = models.CharField(max_length=256)
    region = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    postal_code = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
    house_number = models.IntegerField()
    phone = PhoneNumberField(region='GR')
    AFM = models.IntegerField()

    def __str__(self):
        return self.username