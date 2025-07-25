from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import AppState

@api_view(['GET'])
def check_status(request):
    is_ready = AppState.get_ready_status()
    return Response({'ready': is_ready})