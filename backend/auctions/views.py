from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.db.models import Q

from decimal import Decimal

from .models import Item, Category, Visit, Bid
from .serializers import ItemSerializer, BidSerializer, AuctionCreation
from .recomendation_utils import recommend_items

from user_messages.serializers import ConversationSerializer, MessageSerializer


class CategoryList(APIView):
    """
    View that returns all the categories of items that are currently active
    """
    def get(self, request):
        now = timezone.now()
        categories = Category.objects.filter(item__active=True, item__ends__gt=now).values_list('name', flat=True).distinct()
        return JsonResponse(list(categories), safe=False)

class ItemList(APIView):
    """
    View to list all available (active and not yet ended) items.
    GET /items/
    """
    def get(self, request):
        category = request.GET.get('category')
        min = request.GET.get('min')
        max = request.GET.get('max')
        query = request.GET.get('query')
        

        now = timezone.now()
        available_items = Item.objects.filter(active=True, ends__gt=now).order_by('ends')
        
        if (category):
            available_items = available_items.filter(category=category)

        if (min is not None and min != ''):
            available_items = available_items.filter(currently__gte=Decimal(min))
        
        if (max is not None and max != ''):
            available_items = available_items.filter(currently__lte=Decimal(max))

        if (query):
            available_items = available_items.filter(Q(name__icontains=query) | Q(description__icontains=query))
        
        available_items = list(available_items)

        if (request.user.is_authenticated):
            bids_from_user = list(Bid.objects.filter(bidder=request.user).values_list('item_id', flat=True))
            if bids_from_user:
                return recommend_items(request, Bid, available_items)
            else:
                vistis_from_users = list(Visit.objects.filter(visitor=request.user).values_list('item_id', flat=True))
                if vistis_from_users:
                    return recommend_items(request, Visit, available_items)
                else:            
                    serializer = ItemSerializer(available_items, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)



        serializer = ItemSerializer(available_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MyItemList(APIView):
    """
    View to list all the items auctioned by the logged in user.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        my_items = Item.objects.filter(seller=user)
        serialiser = ItemSerializer(my_items, many=True)
        return Response(serialiser.data, status=status.HTTP_200_OK)


class ItemDetail(APIView):
    """
    View to retrieve a single item by item_id.
    GET /items/<item_id>/
    """
    def get(self, request, item_id):
        item = get_object_or_404(Item, item_id=item_id)
        serializer = ItemSerializer(item)

        if (request.user.is_authenticated):
            visit, created = Visit.objects.get_or_create(item=item, visitor=request.user)
            if (not created):
                visit.count += 1
                visit.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CreateAuctionItem(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    """
    View that creates an auction item
    """

    def post(self, request):
        serialiser = AuctionCreation(data=request.data, context={'request': request})

        if (serialiser.is_valid()):
            serialiser.save()
            return Response({"detail": "Item created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PlaceBid(APIView):
    """
    View to place a bid on a specific item
    """
    
    def post(self, request):
        serialiser = BidSerializer(data=request.data)
        if (serialiser.is_valid()):
            serialiser.save()
            return Response({"detail": "Bid placed successfully"}, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

class BuyOut(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    """
    View that allows the user to buy the product now ignoring the auction
    """
    
    def post(self, request):
        item_id = request.data.get('item_id')
        user = request.user

        if not item_id:
            return Response(
                {"error": "Item ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        item = get_object_or_404(Item, id=item_id)
        
        if not item:
            return Response(
                {"error": "This item does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )            

        if item.buyer:
            return Response(
                {"error": "This item has already been sold."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        item.buyer = user
        item.active = False

        conversation_data = {
            "seller": item.seller.id,
            "buyer": user.id
        }

        # Create conversation with user
        conversation = ConversationSerializer(data = conversation_data)
        if conversation.is_valid():
            conversation.save()
        else:
            return Response(
                {"error": "Failed to create conversation", "details": conversation.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        #add an initial message to the conversation
        message_data = {
            "conversation": conversation.id,
            "message": f"Hi, I am {user.first_name} and i have just purchased {item.name}",
        }

        message = MessageSerializer(data = message_data)
        if (message.is_valid()):
            message.save()
        else:
            return Response(
                {"error": "Failed to send initial message", "details": conversation.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Item successfully purchased.",
                "item_id": item.id,
                "price": str(item.buy_price),
            },
            status=status.HTTP_201_CREATED
        )
