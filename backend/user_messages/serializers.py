from rest_framework import serializers
from .models import Conversations, Messages

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversations
        fields = ['id', 'seller', 'buyer', 'created_at']

    created_at = serializers.DateTimeField(read_only=True)

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ['id', 'conversation', 'message', 'timestamp']

    timestamp = serializers.DateTimeField(read_only=True)