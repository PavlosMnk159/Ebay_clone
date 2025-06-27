from rest_framework import serializers

class QueryRequestSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=10000)

class QueryResponseSerializer(serializers.Serializer):
    response = serializers.CharField()