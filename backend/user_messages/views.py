from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Messages, Conversations
from .serializers import ConversationInSerializer, ConversationOutSerializer, MessageSerializer

from User.models import CustomUser
from User.permissions import IsApproved

from auctions.views import assign_expired_auctions_to_highest_bidders

from django.db.models import Q

class GetInConversations(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        assign_expired_auctions_to_highest_bidders()

        # Only conversations not deleted by this seller
        conversations = Conversations.objects.filter(seller=user, deleted_by_sender=False)

        serializer = ConversationInSerializer(conversations, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class GetOutConversations(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        # Only conversations not deleted by this buyer
        conversations = Conversations.objects.filter(buyer=user, deleted_by_receiver=False)

        assign_expired_auctions_to_highest_bidders()

        serializer = ConversationOutSerializer(conversations, many=True, context={'request': request})

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UnreadMessageCountView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        unread_count = Messages.objects.filter(receiver=user, seen=False).count()

        return Response({"unread_count": unread_count})

class GetConversationMessages(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user
        conversation_id = request.query_params.get('conversation_id')

        if not conversation_id:
            return Response({"error": "conversation id is required"}, status=status.HTTP_404_NOT_FOUND)

        try:
            conversation_id = int(conversation_id)
        except ValueError:
            return Response({"error": "conversation id must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        # Correct query
        conversation = Conversations.objects.filter(
            Q(id=conversation_id) & (Q(seller=user) | Q(buyer=user))
        ).first()

        if not conversation:
            return Response({"error": "Invalid conversation id"}, status=status.HTTP_404_NOT_FOUND)

        # Mark all messages received by this user as seen
        Messages.objects.filter(conversation=conversation, receiver=user, seen=False).update(seen=True)

        messages = Messages.objects.filter(conversation=conversation).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SendMessage(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def post(self, request):
        sender = request.user

        conversation_id = request.data.get("conversation_id")
        text = request.data.get("message")

        if not conversation_id or not text:
            return Response(
                {"error": "conversation_id and message are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate conversation
        try:
            conversation = Conversations.objects.get(id=conversation_id)
        except Conversations.DoesNotExist:
            return Response(
                {"error": "Conversation does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Ensure sender is part of the conversation
        if conversation.seller != sender and conversation.buyer != sender:
            return Response(
                {"error": "You are not a participant in this conversation"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Figure out receiver
        receiver = conversation.seller if conversation.buyer == sender else conversation.buyer

        # Create message
        message = Messages.objects.create(
            conversation=conversation,
            sender=sender,
            receiver=receiver,
            message=text
        )

        return Response(
            {"success": True, "message_id": message.id},
            status=status.HTTP_201_CREATED
        )

    
class DeleteConversationView(APIView):
    """
    Deletes a conversation
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]
    
    def post(self, request):
        user = request.user  # Make sure the user is authenticated
        conversation_id = request.data.get("conversation_id")

        if not conversation_id:
            return Response({"error": "conversation_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        conversation = get_object_or_404(Conversations, id=conversation_id)

        # Determine if the user is seller or buyer
        if conversation.seller == user:
            conversation.deleted_by_sender = True
        elif conversation.buyer == user:
            conversation.deleted_by_receiver = True
        else:
            return Response({"error": "You are not part of this conversation."}, status=status.HTTP_403_FORBIDDEN)

        # If both have marked it deleted, remove from DB
        if conversation.deleted_by_sender and conversation.deleted_by_receiver:
            conversation.delete()
            return Response({"message": "Conversation permanently deleted."}, status=status.HTTP_200_OK)

        # Otherwise, just mark as deleted for this user
        conversation.save()
        return Response({"message": "Conversation marked as deleted for you."}, status=status.HTTP_200_OK)
