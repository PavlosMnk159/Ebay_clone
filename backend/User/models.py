from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

class CustomUser(AbstractUser):
    is_admin = models.BooleanField()
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