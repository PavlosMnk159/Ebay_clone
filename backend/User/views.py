from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import RegistrationSerializer, UserDetailsSerialiser, LoginSerialiser
from .permissions import CanViewUserList, CanViewUserDetails, CanApproveUserRegistration
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from User.models import CustomUser
from auctions.models import Bid
from auctions.serializers import BidSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User created successfully"}, status=status.HTTP_201_CREATED)
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerialiser

class ViewUserList(APIView):
    """
    Get users from the users list. You can select which by specifing the page (each page contains 10 users)
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated ,CanViewUserList]

    def get(self, request):
        
        users = CustomUser.objects.all().values_list('id', 'username', flat=True)
        
        #get the page which was requested
        page = request.GET.get('page', 1)
        page = int(page)

        paginator = Paginator(users, 10)
        page_obj = paginator.get_page(page)

        res = {
            'count', paginator.count,
            'num_pages', paginator.num_pages,
            'page', page,
            'results', list(page_obj)   
        }

        return JsonResponse(res)
    
class ViewUserAccount(APIView):
    """
    View details about a specific users account
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated ,CanViewUserDetails]

    def get(self, request):
        user_id = request.GET.get('user_id')
        
        if not user_id:
            return Response({"error": "Missing 'user_id' parameter"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"error": "Invalid 'user_id', must be an integer"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch user or return 404
        user = get_object_or_404(CustomUser, user_id=user_id)

        serializer = UserDetailsSerialiser(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AproveAccount(APIView):
    """
    This view allows the admin to approve or decline the registration of a user
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated ,CanApproveUserRegistration]
    
    def post(self, request):
        user_id = request.data.get('user_id')
        decision = request.data.get('decision')

        if not user_id:
            return Response({"error": "Missing 'user_id' parameter"}, status=status.HTTP_400_BAD_REQUEST)

        if not decision:
            return Response({"error": "Missing 'decision' parameter"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"error": "Invalid 'user_id', must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        
        if isinstance(decision, bool):
            decision_bool = decision
        elif isinstance(decision, str):
            if decision.lower() in ['true', '1']:
                decision_bool = True
            elif decision.lower() in ['false', '0']:
                decision_bool = False
            else:
                return Response({"error": "Invalid 'decision', must be a boolean"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid 'decision', must be a boolean"}, status=status.HTTP_400_BAD_REQUEST)
        
        
        user = get_object_or_404(CustomUser, user_id=user_id)

        user.is_approved = decision_bool
        user.save()

        status_text = "approved" if decision_bool else "declined"
        return Response(
            {"message": f"User '{user.username}' has been {status_text}."},
            status=status.HTTP_200_OK
        )

        
        


class ViewUserBids(APIView):
    """
    View the bids of a specific user account
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated ,CanViewUserDetails]

    def get(self, request):
        user_id = request.GET.get('user_id')

        if not user_id:
            return Response({"error": "Missing 'user_id' parameter"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"error": "Invalid 'user_id', must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_object_or_404(CustomUser, user_id=user_id)

        if not user:
            return Response({"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        bids = Bid.objects.filter(bidder=user)

        serializer = BidSerializer(bids, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
        
        
        




