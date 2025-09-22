from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import RegistrationSerializer, UserDetailsSerialiser
from .permissions import CanViewUserList, CanViewUserDetails, CanApproveUserRegistration
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from User.models import CustomUser

class RegisterView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User created successfully"}, status=status.HTTP_201_CREATED)
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ViewUserList(APIView):
    """
    Get 10 users from the users list. You can select which by specifing the page (each page contains 10 users)
    """
    permission_classes = [CanViewUserList]

    def get(self, request):
        
        users = CustomUser.objects.all().values_list('username', flat=True)
        
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
    permission_classes = [CanViewUserDetails]

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



