from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import QueryRequestSerializer, QueryResponseSerializer, RegistrationSerializer
from .models import AppState
from .utils import process_query

@api_view(['POST'])
@permission_classes([AllowAny])
def chat(request):
    serializer = QueryRequestSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.validated_data['message']
        
        response = process_query(None, message)

        response_serializer = QueryResponseSerializer({'response': response})
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def status_view(request):
    ready = AppState.get_ready_status()
    print(f"ready: {ready}")
    return Response({"ready": ready})

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = QueryRequestSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.validated_data['message']
        
        
        response = process_query(None, message)
        
        response_serializer = QueryResponseSerializer({'response': response})
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print(request.data)
    serializer = QueryRequestSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.validated_data['message']
        
        response = process_query(None, message)
        
        response_serializer = QueryResponseSerializer({'response': response})
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    print(serializer.errors) 
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    authentication_classes = [JWTAuthentication]  # <-- here, for auth
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "User created successfully"}, status=status.HTTP_201_CREATED)
        print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)