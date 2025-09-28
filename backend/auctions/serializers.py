from rest_framework import serializers
from .models import Category, Item, Bid, Visit, ItemImage
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
    categories = serializers.ListField(
        child=serializers.CharField(max_length=100), write_only=True
    )
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    class Meta:
        model = Item
        fields = [
            'name', 'categories', 'currently', 'buy_price', 'first_bid', 
            'number_of_bids', 'location', 'latitude', 'longitude', 
            'country', 'started', 'ends', 'description', 'images'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        categories_data = validated_data.pop('categories', [])
        images_data = validated_data.pop('images', [])

        # Handle categories
        category_objs = []
        for name in categories_data:
            category, created = Category.objects.get_or_create(name=name)
            category_objs.append(category)

        # Create item
        item = Item.objects.create(seller=request.user, **validated_data)
        item.categories.set(category_objs)

        # Handle images
        for image in images_data:
            ItemImage.objects.create(item=item, image=image)

        return item
    
class AuctionEditor(serializers.ModelSerializer):
    categories = serializers.ListField(
        child=serializers.CharField(max_length=100),
        write_only=True,
        required=False
    )
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

    name = serializers.CharField(required=False)
    currently = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    buy_price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    first_bid = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    number_of_bids = serializers.IntegerField(required=False)
    latitude = serializers.FloatField(required=False, allow_null=True)
    longitude = serializers.FloatField(required=False, allow_null=True)
    country = serializers.CharField(required=False, allow_blank=True)
    started = serializers.DateTimeField(required=False)
    ends = serializers.DateTimeField(required=False)
    description = serializers.CharField(required=False)

    class Meta:
        model = Item
        fields = [
            'name', 'categories', 'currently', 'buy_price', 'first_bid',
            'number_of_bids', 'latitude', 'longitude',
            'country', 'started', 'ends', 'description', 'images'
        ]

    def update(self, instance, validated_data):
        categories_data = validated_data.pop('categories', None)
        images_data = validated_data.pop('images', None)

        # Update basic fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update categories if provided
        if categories_data is not None:
            category_objs = []
            for name in categories_data:
                category, _ = Category.objects.get_or_create(name=name)
                category_objs.append(category)
            instance.categories.set(category_objs)

        # Update images if provided
        if images_data is not None:
            instance.images.all().delete()  # clear existing
            for image in images_data:
                ItemImage.objects.create(item=instance, image=image)

        return instance

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
    time_left = serializers.SerializerMethodField() 
    images = serializers.SerializerMethodField()
    ends = serializers.DateTimeField(
        input_formats=[
            "%Y-%m-%dT%H:%M:%S.%fZ",  # 2025-09-27T10:00:00.123456Z
            "%Y-%m-%dT%H:%M:%S.%f",   # 2025-09-27T10:00:00.123456
            "%Y-%m-%dT%H:%M:%S",      # 2025-09-27T10:00:00
            "%Y-%m-%dT%H:%M",         # 2025-09-27T10:00
            "%Y-%m-%d %H:%M:%S",      # 2025-09-27 10:00:00
            "%Y-%m-%d %H:%M",         # 2025-09-27 10:00
            "%Y-%m-%d",               # 2025-09-27 (no time, defaults to 00:00:00)
        ],
        required=True
    )

    class Meta:
        model = Item
        fields = [
            'id', 'name', 'category', 'currently', 'Buy_Price', 'First_Bid',
            'Number_of_Bids', 'Bids', 'started', 'ends', 'time_left', 'seller', 'description',
            'location', 'city', 'country', 'isActive', 'images'
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
    
    def get_images(self, obj):
        """
        Returns a list of URLs for all images of the item.
        """
        return [img.image.url for img in obj.images.all()] 
    
class MyBidItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='item_id')
    category = serializers.SerializerMethodField()
    currently = serializers.DecimalField(max_digits=10, decimal_places=2)
    Buy_Price = serializers.DecimalField(source='buy_price', max_digits=10, decimal_places=2)
    First_Bid = serializers.DecimalField(source='first_bid', max_digits=10, decimal_places=2)
    Number_of_Bids = serializers.IntegerField(source='number_of_bids')
    Bids = serializers.SerializerMethodField()
    user_bid = serializers.SerializerMethodField()  # NEW: User's latest bid
    seller = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    city = serializers.CharField(source='location')  # assuming "location" field in model is city name
    isActive = serializers.IntegerField(source='active')
    time_left = serializers.SerializerMethodField() 
    images = serializers.SerializerMethodField()
    ends = serializers.DateTimeField(
        input_formats=[
            "%Y-%m-%dT%H:%M:%S.%fZ",
            "%Y-%m-%dT%H:%M:%S.%f",
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%dT%H:%M",
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%d %H:%M",
            "%Y-%m-%d",
        ],
        required=True
    )

    class Meta:
        model = Item
        fields = [
            'id', 'name', 'category', 'currently', 'Buy_Price', 'First_Bid',
            'Number_of_Bids', 'Bids', 'user_bid', 'started', 'ends', 'time_left', 
            'seller', 'description', 'location', 'city', 'country', 'isActive', 'images'
        ]

    def get_category(self, obj):
        categories = obj.categories.all()
        return categories[0].name if categories.exists() else None

    def get_Bids(self, obj):
        # keep as null for frontend
        return None  

    def get_user_bid(self, obj):
        """
        Returns the latest bid amount from the current logged-in user on this item.
        """
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None

        latest_user_bid = obj.bids.filter(bidder=request.user).order_by('-time').first()
        return float(latest_user_bid.amount) if latest_user_bid else None

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
        now = timezone.now()
        if obj.ends > now:
            delta = obj.ends - now
            days = delta.days
            hours = delta.seconds // 3600
            minutes = (delta.seconds % 3600) // 60
            seconds = delta.seconds % 60
            return f"{days}d {hours}h {minutes}m {seconds}s"
        return "Ended"

    def get_images(self, obj):
        return [img.image.url for img in obj.images.all()] 