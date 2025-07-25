from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404

from .models import Item
from .serializers import ItemSerializer


        
class ItemList(APIView):
    """
    View to list all available (active and not yet ended) items.
    GET /items/
    """
    def get(self, request):
        now = timezone.now()
        available_items = Item.objects.filter(active=True, ends__gt=now).order_by('ends')
        serializer = ItemSerializer(available_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ItemDetail(APIView):
    """
    View to retrieve a single item by item_id.
    GET /items/<item_id>/
    """
    def get(self, request, item_id):
        item = get_object_or_404(Item, item_id=item_id)
        serializer = ItemSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK)