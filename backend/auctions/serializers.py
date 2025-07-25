from rest_framework import serializers
from .models import Category, Item, Bid
from User.models import CustomUser

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BidSerializer(serializers.ModelSerializer):
    bidder_username = serializers.CharField(source='bidder.username', read_only=True)
    class Meta:
        model = Bid
        fields = ['id', 'amount', 'time', 'bidder_username']

class ItemSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True, read_only=True)
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    bids = BidSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = [
            'item_id', 'name', 'categories', 'currently', 'buy_price', 'first_bid',
            'number_of_bids', 'location', 'latitude', 'longitude', 'country', 'started',
            'ends', 'seller_username', 'description', 'active', 'bids'
        ]
