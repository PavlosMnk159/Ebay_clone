from django.db import models
from User.models import CustomUser
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Item(models.Model):
    item_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    categories = models.ManyToManyField(Category)
    currently = models.DecimalField(max_digits=10, decimal_places=2)
    buy_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    first_bid = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_bids = models.IntegerField(default=0)
    location = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    country = models.CharField(max_length=100, null=True)
    started = models.DateTimeField()
    ends = models.DateTimeField()
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='items_for_sale')
    description = models.TextField(null=True)
    active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.item_id})"
    
class Bid(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='bids')
    time = models.DateTimeField(default=timezone.now)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"${self.amount} by {self.bidder.username} on {self.item.name}"