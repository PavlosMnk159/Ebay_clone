from rest_framework import serializers
from .models import Conversations, Messages

class ConversationInSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source="buyer.username", read_only=True)
    buyer_email = serializers.EmailField(source="buyer.email", read_only=True)
    avatar = serializers.SerializerMethodField()
    unread = serializers.SerializerMethodField()

    class Meta:
        model = Conversations
        fields = ['id', 'buyer_name', 'buyer_email', 'avatar', 'unread', 'created_at']

    def get_avatar(self, obj):
        # You can customize avatar here, for simplicity using emoji
        return "📚"

    def get_unread(self, obj):
        # Count messages where receiver is current user and not seen
        user = self.context['request'].user
        return obj.messages.filter(receiver=user, seen=False).count()
    
class ConversationOutSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source="seller.username", read_only=True)
    seller_email = serializers.EmailField(source="seller.email", read_only=True)
    avatar = serializers.SerializerMethodField()
    unread = serializers.SerializerMethodField()

    class Meta:
        model = Conversations
        fields = ['id', 'seller_name', 'seller_email', 'avatar', 'unread', 'created_at']

    def get_avatar(self, obj):
        # You can customize avatar here, for simplicity using emoji
        return "📚"

    def get_unread(self, obj):
        # Count messages where receiver is current user and not seen
        user = self.context['request'].user
        return obj.messages.filter(receiver=user, seen=False).count()

class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Messages
        fields = ['id', 'conversation', 'sender', 'receiver', 'message', 'timestamp']

    def get_sender(self, obj):
        return obj.sender.username if obj.sender else None

    def get_receiver(self, obj):
        return obj.receiver.username if obj.receiver else None
    
class MessageCreateSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField(read_only=True)
    receiver_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Messages
        fields = ['id', 'conversation', 'sender', 'receiver', 'sender_name', 'receiver_name', 'message', 'timestamp']
        read_only_fields = ['timestamp']

    def get_sender_name(self, obj):
        return obj.sender.username if obj.sender else None

    def get_receiver_name(self, obj):
        return obj.receiver.username if obj.receiver else None

class ConversationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversations
        fields = ['seller', 'buyer']  # only fields needed to create

    def create(self, validated_data):
        return Conversations.objects.create(**validated_data)