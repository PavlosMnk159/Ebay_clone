
from django.urls import path
from .views import check_status

urlpatterns = [
    path('status/', check_status, name='status'),
]