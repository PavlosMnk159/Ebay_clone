from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.db.models import Q
from django.http import HttpResponse


from decimal import Decimal

from .models import Item, Category, Visit, Bid
from .serializers import AuctionEditor, ItemSerializer, BidSerializer, AuctionCreation, MyBidItemSerializer
from .recomendation_utils import recommend_items

from user_messages.serializers import ConversationCreateSerializer, MessageCreateSerializer
from user_messages.models import Conversations, Messages

from User.permissions import CanViewUserDetails, IsApproved

import xml.etree.ElementTree as ET


class CategoryList(APIView):
    """
    View that returns all the categories of items that are currently active
    """
    def get(self, request):
        categories = Category.objects.all().values_list('name', flat=True).distinct()
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
        location = request.GET.get('location')

        
            
        
        now = timezone.now()

        assign_expired_auctions_to_highest_bidders()

        available_items = Item.objects.filter(active=True, ends__gt=now).order_by('ends')

        if (request.user.is_authenticated):
            available_items = available_items.exclude(seller=request.user)

        if (category):
            available_items = available_items.filter(categories__name__iexact=category)

        if (min is not None and min != ''):
            available_items = available_items.filter(currently__gte=Decimal(min))
        
        if (max is not None and max != ''):
            available_items = available_items.filter(currently__lte=Decimal(max))

        if (query):
            available_items = available_items.filter(Q(name__icontains=query) | Q(description__icontains=query))

        if (location):
            available_items = available_items.filter(Q(location__icontains=location) | Q(country__icontains=location))
        

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
    permission_classes = [IsAuthenticated, IsApproved]

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
    permission_classes = [IsAuthenticated, IsApproved]
    """
    View that creates an auction item
    """

    def post(self, request):
        serialiser = AuctionCreation(data=request.data, context={'request': request})

        if (serialiser.is_valid()):
            serialiser.save()
            return Response({"detail": "Item created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EditAuctionItem(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def post(self, request):
        user = request.user
        item_id = request.data.get('id')


        item = get_object_or_404(Item, item_id=item_id)

        # Ensure that only the seller can edit
        if item.seller != user:
            return Response(
                {"error": "You are not allowed to edit this item."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Prevent editing once auction has ended or item sold
        if item.ends <= timezone.now() or item.buyer:
            return Response(
                {"error": "You cannot edit this item after it has ended or been sold."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = AuctionEditor(item, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Item updated successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteAuctionItem(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def post(self, request):
        user = request.user
        item_id = request.data.get("item_id")

        item = get_object_or_404(Item, item_id=item_id)

        if not item:
            return Response({"error": "no such item"}, status=status.HTTP_404_NOT_FOUND)
        
        if (item.seller != user):
            return Response({"error": "You cannot delete this item"}, status=status.HTTP_403_FORBIDDEN)
        
        if item.buyer or item.number_of_bids != 0:
            return Response({"error": "This item cannot be deleted as it has a bid"}, status=status.HTTP_403_FORBIDDEN)
        
        item.delete()
        return Response({"error": "Item deleted successfully"}, status=status.HTTP_200_OK)
    
class ActivateItemView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        item_id = request.data.get('id')
        if not item_id:
            return Response({"error": "Item ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, item_id=item_id)

        if item.seller != request.user:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        item.active = True
        item.save()

        return Response({"detail": "Item activated successfully", "item_id": item.item_id})

class PlaceBid(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def post(self, request):
        item_id = request.data.get('item_id')
        item = get_object_or_404(Item, item_id=item_id)

        if item.seller == request.user:
            return Response({"error": "You cannot bid on your own item."}, status=403)

        serializer = BidSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(item=item)
            return Response({"detail": "Bid placed successfully"}, status=201)
        return Response(serializer.errors, status=400)

class BuyOut(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]
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

        item = get_object_or_404(Item, item_id=item_id)
        
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
        item.save()

        conversation_data = {
            "seller": item.seller.id,
            "buyer": user.id
        }

        # Create conversation with user
        conversation = ConversationCreateSerializer(data = conversation_data, context={'request': request})
        if conversation.is_valid():
            conversation_instance = conversation.save()
        else:
            return Response(
                {"error": "Failed to create conversation", "details": conversation.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        #add an initial message to the conversation
        message_data = {
            "conversation": conversation_instance.id,
            "sender": user.id,
            "receiver": item.seller.id,
            "message": f"Hi, I am {user.first_name} and I have just purchased {item.name}",
        }

        message = MessageCreateSerializer(data = message_data)
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
                "item_id": item.item_id,
                "price": str(item.buy_price),
            },
            status=status.HTTP_201_CREATED
        )

class ActiveItemsXMLView(APIView):
    """
    Returns all active items in XML format, fully matching the example structure.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, CanViewUserDetails]

    def get(self, request):
        items = Item.objects.prefetch_related('categories', 'bids', 'bids__bidder').filter(active=True)

        root = ET.Element("Items")
        for item in items:
            # Item element
            item_el = ET.SubElement(root, "Item", ItemID=str(item.item_id))
            ET.SubElement(item_el, "Name").text = item.name

            # Categories
            for category in item.categories.all():
                ET.SubElement(item_el, "Category").text = category.name

            # Prices and bids
            ET.SubElement(item_el, "Currently").text = f"${item.currently}"
            if item.first_bid:
                ET.SubElement(item_el, "First_Bid").text = f"${item.first_bid}"
            ET.SubElement(item_el, "Number_of_Bids").text = str(item.number_of_bids)

            # Bids
            bids_el = ET.SubElement(item_el, "Bids")
            for bid in item.bids.all():
                bid_el = ET.SubElement(bids_el, "Bid")
                bidder_el = ET.SubElement(
                    bid_el,
                    "Bidder",
                    Rating=str(getattr(bid.bidder, 'rating', 0)),
                    UserID=bid.bidder.username
                )

                ET.SubElement(bid_el, "Time").text = bid.time.strftime("%b-%d-%y %H:%M:%S")
                ET.SubElement(bid_el, "Amount").text = f"${bid.amount}"

            # Item location and country
            ET.SubElement(item_el, "Location").text = item.location or ""
            ET.SubElement(item_el, "Country").text = item.country or ""

            # Auction dates
            ET.SubElement(item_el, "Started").text = item.started.strftime("%b-%d-%y %H:%M:%S")
            ET.SubElement(item_el, "Ends").text = item.ends.strftime("%b-%d-%y %H:%M:%S")

            # Seller info with rating, location, and country
            seller_el = ET.SubElement(
                item_el,
                "Seller",
                Rating=str(getattr(item.seller, 'rating', 0)),
                UserID=item.seller.username
            )

            # Description
            ET.SubElement(item_el, "Description").text = item.description or ""

        xml_str = ET.tostring(root, encoding="utf-8")
        return HttpResponse(xml_str, content_type="application/xml")
    
class ActiveItemsExportView(APIView):
    """
    Returns all active items in XML or JSON depending on 'format' query parameter.
    Use ?format=json or ?format=xml
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        export_format = request.query_params.get("format", "json").lower()
        items = Item.objects.prefetch_related("categories", "bids", "bids__bidder").filter(active=True)

        if export_format == "json":
            data = []
            for item in items:
                item_data = {
                    "ItemID": item.item_id,
                    "Name": item.name,
                    "Categories": [c.name for c in item.categories.all()],
                    "Currently": float(item.currently),
                    "First_Bid": float(item.first_bid) if item.first_bid else None,
                    "Number_of_Bids": item.number_of_bids,
                    "Bids": [
                        {
                            "Bidder": {
                                "UserID": bid.bidder.username,
                                "Rating": getattr(bid.bidder, "rating", 0),
                            },
                            "Time": bid.time.strftime("%b-%d-%y %H:%M:%S"),
                            "Amount": float(bid.amount),
                        }
                        for bid in item.bids.all()
                    ],
                    "Location": item.location or "",
                    "Country": item.country or "",
                    "Started": item.started.strftime("%b-%d-%y %H:%M:%S"),
                    "Ends": item.ends.strftime("%b-%d-%y %H:%M:%S"),
                    "Seller": {
                        "UserID": item.seller.username,
                        "Rating": getattr(item.seller, "rating", 0),
                    },
                    "Description": item.description or "",
                }
                data.append(item_data)
            return JsonResponse(data, safe=False)

        elif export_format == "xml":
            root = ET.Element("Items")
            for item in items:
                item_el = ET.SubElement(root, "Item", ItemID=str(item.item_id))
                ET.SubElement(item_el, "Name").text = item.name
                for category in item.categories.all():
                    ET.SubElement(item_el, "Category").text = category.name

                ET.SubElement(item_el, "Currently").text = f"${item.currently}"
                if item.first_bid:
                    ET.SubElement(item_el, "First_Bid").text = f"${item.first_bid}"
                ET.SubElement(item_el, "Number_of_Bids").text = str(item.number_of_bids)

                bids_el = ET.SubElement(item_el, "Bids")
                for bid in item.bids.all():
                    bid_el = ET.SubElement(bids_el, "Bid")
                    bidder_el = ET.SubElement(
                        bid_el,
                        "Bidder",
                        Rating=str(getattr(bid.bidder, "rating", 0)),
                        UserID=bid.bidder.username,
                    )
                    location = getattr(getattr(bid.bidder, "profile", None), "location", "")
                    country = getattr(getattr(bid.bidder, "profile", None), "country", "")
                    ET.SubElement(bidder_el, "Location").text = location or ""
                    ET.SubElement(bidder_el, "Country").text = country or ""

                    ET.SubElement(bid_el, "Time").text = bid.time.strftime("%b-%d-%y %H:%M:%S")
                    ET.SubElement(bid_el, "Amount").text = f"${bid.amount}"

                ET.SubElement(item_el, "Location").text = item.location or ""
                ET.SubElement(item_el, "Country").text = item.country or ""
                ET.SubElement(item_el, "Started").text = item.started.strftime("%b-%d-%y %H:%M:%S")
                ET.SubElement(item_el, "Ends").text = item.ends.strftime("%b-%d-%y %H:%M:%S")

                seller_el = ET.SubElement(
                    item_el,
                    "Seller",
                    Rating=str(getattr(item.seller, "rating", 0)),
                    UserID=item.seller.username,
                )
                seller_location = getattr(getattr(item.seller, "profile", None), "location", "")
                seller_country = getattr(getattr(item.seller, "profile", None), "country", "")
                if seller_location:
                    ET.SubElement(seller_el, "Location").text = seller_location
                if seller_country:
                    ET.SubElement(seller_el, "Country").text = seller_country

                ET.SubElement(item_el, "Description").text = item.description or ""

            xml_str = ET.tostring(root, encoding="utf-8")
            return HttpResponse(xml_str, content_type="application/xml")

        else:
            return JsonResponse({"error": "Invalid format, must be 'json' or 'xml'."}, status=400)

class ItemBidsView(APIView):
    """
    View to get all bids for a specific item.
    Only the seller (owner) of the item can access this.
    GET /items/bids/?item_id=123
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        item_id = request.GET.get("item_id")
        if not item_id:
            return Response({"error": "item_id query parameter is required"}, status=400)

        item = get_object_or_404(Item, item_id=item_id)

        # Check if the logged-in user is the seller
        if item.seller != request.user:
            return Response({"error": "You are not allowed to view bids for this item."}, status=403)

        bids = Bid.objects.filter(item=item).order_by("-time")
        serializer = BidSerializer(bids, many=True)
        return Response(serializer.data, status=200)

class MyBids(APIView):
    """
    Returns all active auction items. If the user is logged in,
    includes the user's latest bid on each item.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        active_items = Item.objects.filter(active=True, bids__bidder=user).prefetch_related('bids', 'categories', 'images')

        # Serialize with request in context so `user_bid` works
        serializer = MyBidItemSerializer(active_items, many=True, context={'request': request})
        return Response(serializer.data)
    
def assign_expired_auctions_to_highest_bidders():
    """
    Processes all expired auctions where the item is still active.
    For each item:
    - Finds the highest bid.
    - Assigns the bidder as the buyer.
    - Deactivates the item.
    - Creates a conversation and initial message if not exists.

    Returns:
        list: A list of dictionaries with item info and status.
    """
    now = timezone.now()
    results = []

    expired_items = Item.objects.filter(active=True, ends__lte=now)

    for item in expired_items:
        highest_bid = Bid.objects.filter(item=item).order_by('-amount').first()
        if not highest_bid:
            item.active = False
            item.save()
            results.append({
                "item_id": item.item_id,
                "name": item.name,
                "message": "Auction ended with no bids. Item remains unsold."
            })
            continue

        buyer = highest_bid.bidder

        item.buyer = buyer
        item.active = False
        item.save()

        conversation, created = Conversations.objects.get_or_create(
            seller=item.seller,
            buyer=buyer
        )

        Messages.objects.create(
            conversation=conversation,
            sender=buyer,
            receiver=item.seller,
            message=f"Hi, I am {buyer.first_name} and I have just won the auction for {item.name}"
        )

        results.append({
            "item_id": item.item_id,
            "name": item.name,
            "buyer": buyer.username,
            "message": f"Auction ended. Buyer set to highest bidder: {buyer.username}"
        })

    return results