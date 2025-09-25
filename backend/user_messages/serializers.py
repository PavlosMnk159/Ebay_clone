from rest_framework import serializers


from .models import Conversations, Messages

class QueryRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=10000)

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversations
        fields = ['seller', 'buyer', 'created_at']

    created_at = serializers.DateTimeField(read_only=True)

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Messages
        fields = ['conversation', 'message', 'timestamp']

    timestamp = serializers.DateTimeField(read_only=True)