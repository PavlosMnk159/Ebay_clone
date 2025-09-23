from rest_framework import serializers
from .models import Category, Item, Bid, Visit
from User.models import CustomUser
from django.utils import timezone

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class BidSerializer(serializers.ModelSerializer):
    bidder_username = serializers.CharField(source='bidder.username', read_only=True)
    class Meta:
        model = Bid
        fields = ['id', 'amount', 'time', 'bidder_username']

    def create(self, validated_data):
        request = self.context.get('request')
        return Bid.objects.create(bidder=request.user, **validated_data)
    
class VisitSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ['item', 'visitor', 'count']

# this allows us to use the category names as fields
class CategoryNameField(serializers.SlugRelatedField):
    def __init__(self, **kwargs):
        # lookup by name
        super().__init__(slug_field='name', queryset=Category.objects.all(), **kwargs)

class AuctionCreation(serializers.ModelSerializer):
    """
    Parses all the data required for the creation of an auction item
    """
    categories = CategoryNameField(many=True)
    currently = serializers.DecimalField(max_digits=10, decimal_places=2)
    buy_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, allow_null=True)
    started = serializers.DateTimeField(default=timezone.now)
    ends = serializers.DateTimeField(
        input_formats=[
            "%Y-%m-%d %H:%M:%S",  # "2025-09-22 15:30:00"
            "%Y-%m-%d",            # "2025-09-22" time defaults to 00:00:00
        ]
    )

    class Meta:
        model = Item
        fields = [
            'item_id', 'name', 'categories', 'currently', 'buy_price', 'started', 'ends'
        ]



    def create(self, validated_data):
        request = self.context.get('request')
        categories = validated_data.pop('categories', [])

        category_objs = []
        for name in categories:
            category, created = Category.objects.get_or_create(name=name)
            category_objs.append(category)
        
        item = Item.objects.create(seller=request.user, **validated_data)
        
        item.categories.set(category_objs)
        return item
    

class ItemSerializer(serializers.ModelSerializer):
    """
    Transforms the data in the format that they will be used in the frontend
    """
    id = serializers.IntegerField(source='item_id')
    category = serializers.SerializerMethodField()
    currently = serializers.DecimalField(max_digits=10, decimal_places=2)
    Buy_Price = serializers.DecimalField(source='buy_price', max_digits=10, decimal_places=2)
    First_Bid = serializers.DecimalField(source='first_bid', max_digits=10, decimal_places=2)
    Number_of_Bids = serializers.IntegerField(source='number_of_bids')
    Bids = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    city = serializers.CharField(source='location')  # assuming "location" field in model is city name
    isActive = serializers.IntegerField(source='active')
    image = serializers.CharField(default="📚")  # customize this if you have image field
    time_left = serializers.SerializerMethodField() 

    class Meta:
        model = Item
        fields = [
            'id', 'name', 'category', 'currently', 'Buy_Price', 'First_Bid',
            'Number_of_Bids', 'Bids', 'started', 'ends', 'time_left', 'seller', 'description',
            'image', 'location', 'city', 'isActive'
        ]

    def get_category(self, obj):
        # if categories is ManyToMany
        categories = obj.categories.all()
        return categories[0].name if categories.exists() else None

    def get_Bids(self, obj):
        # customize this if you want nested bids, otherwise null
        return None  

    def get_seller(self, obj):
        return {
            "sellerId": obj.seller.username,
            "rating": obj.seller.rating if hasattr(obj.seller, "rating") else None
        }

    def get_location(self, obj):
        return {
            "lat": obj.latitude,
            "lng": obj.longitude
        }
        

    def get_time_left(self, obj):
        """
        Returns the time left until 'ends' as a string in the format:
        "Xd Xh Xm Xs". Returns "Ended" if the auction has finished.
        """
        now = timezone.now()
        if obj.ends > now:
            delta = obj.ends - now
            days = delta.days
            hours = delta.seconds // 3600
            minutes = (delta.seconds % 3600) // 60
            seconds = delta.seconds % 60
            return f"{days}d {hours}h {minutes}m {seconds}s"
        return "Ended"
    