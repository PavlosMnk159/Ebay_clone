from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Messages, Conversations
from .serializers import ConversationSerializer, MessageSerializer

from User.models import CustomUser
from User.permissions import IsApproved

from django.db.models import Q

class GetInConversations(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        conversations = Conversations.objects.filter(seller=user)

        serializer = ConversationSerializer(conversations, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class GetOutConversations(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        conversations = Conversations.objects.filter(buyer=user)

        serializer = ConversationSerializer(conversations, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CheckMessages(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user 

        received_messages = Messages.objects.filter(seen=False, conversation__in=Conversations.objects.filter(Q(seller=user) | Q(buyer=user)))
        if (received_messages):
            return_data = {
                "new_messages": "true",
                "message_count": str(len(received_messages))
            }
        else:
            return_data = {
                "new_messages": "false",
            }

        return Response(return_data, status=status.HTTP_200_OK)
    
class UnreadMessageCountView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        unread_count = Messages.objects.filter(receiver=user, seen=False).count()

        return Response({"unread_count": unread_count})

class GetCOnversationMessages(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user
        conversation_id = request.query_params.get('conversation_id')

        if not conversation_id:
            return Response({"error" : "conversation id is required"}, status=status.HTTP_404_NOT_FOUND)


        conversation = Conversations.objects.filter(Q(id=conversation_id & Q(seller=user) | Q(buyer=user))).first()

        if not conversation:
            return Response({"error" : "Invalid conversation id"}, status=status.HTTP_404_NOT_FOUND)
        

        messages = Messages.objects.filter(conversation=conversation).order_by('timestamp')

        serializer = MessageSerializer(messages, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)




class GetMessage(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        other_user = request.query_params.get("user_id")

        message_id = request.query_params.get("message_id")

        if not other_user or not message_id:
            return Response({"error": "user_id and message_id are required"},
                status=status.HTTP_400_BAD_REQUEST)

        message = Messages.objects.filter(
            (Q(sender=user) & Q(receiver_id=other_user)) |
            (Q(sender_id=other_user) & Q(receiver=user)),
            id=message_id
        ).first()
        

        

        if message:    
            message.seen = True
            message.save(update_fields=['seen'])

            return Response({
                "message_id": message.id,
                "message": message.message,
                "sender_id": message.sender.id,
                "receiver_id": message.receiver.id,
                "timestamp": message.timestamp,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "no such message"}, status=status.HTTP_404_NOT_FOUND)

class GetInMessages(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        # Get all messages received by the user
        messages = Messages.objects.filter(receiver=user).select_related('sender')

        # Build a list of dicts with message id and sender username
        result = [
            {"message_id": msg.id, "sender_username": msg.sender.username, "message": msg.message, "seen": msg.seen}
            for msg in messages
        ]

        return Response(result, status=200)

class GetOutMessages(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def get(self, request):
        user = request.user

        # Get all messages sent by the user
        messages = Messages.objects.filter(sender=user).select_related('sender')

        # Build a list of dicts with message id and receiver username
        result = [
            {"message_id": msg.id, "sender_username": msg.receiver.username, "message": msg.message, "seen": msg.seen}
            for msg in messages
        ]

        return Response(result, status=200)
    
class SendMessage(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def post(self, request):
        sender = request.user

        receiver_name = request.data.get("receiver")
        text = request.data.get("message")

        if not receiver_name or not text:
            return Response(
                {"error": "receiver name and message are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            receiver = CustomUser.objects.get(username=receiver_name)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Receiver does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        conversation = Conversations.objects.filter(
            (Q(seller=sender) & Q(buyer=receiver)) |
            (Q(seller=receiver) & Q(buyer=sender))
        ).first()
        if not conversation:
            return Response(
                {"error": "You cannot message this user"},
                status=status.HTTP_403_FORBIDDEN
            )
        
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
    
class DeleteMessage(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, IsApproved]

    def post(self, request):
        pass