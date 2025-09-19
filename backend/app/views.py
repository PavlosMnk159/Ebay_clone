from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import QueryRequestSerializer, QueryResponseSerializer
from .models import AppState
from .utils import process_query
import asyncio
import logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def chat(request):
    serializer = QueryRequestSerializer(data=request.data)
    if serializer.is_valid():
        message = serializer.validated_data['message']
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            response = loop.run_until_complete(process_query(None, message))
        finally:
            loop.close()
        
        response_serializer = QueryResponseSerializer({'response': response})
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def status_view(request):
    ready = AppState.get_ready_status()
    logger.info(f"ready: {ready}")
    return Response({"ready": ready})


