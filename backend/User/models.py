from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

class CustomUser(AbstractUser):
    country = models.CharField(max_length=256)
    region = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    postal_code = models.CharField(max_length=256)
    address = models.CharField(max_length=256)
    house_number = models.IntegerField()
    phone = PhoneNumberField(region='GR')
    AFM = models.IntegerField()
    is_approved = models.BooleanField(default=False)

    class Meta:
        permissions = [
            ("can_approve_user_registration", "can approve user registration"),
            ("can_view_user_list", "can view user list"),
            ("can_view_user_details", "can view user details")
        ]

    def __str__(self):
        return self.username