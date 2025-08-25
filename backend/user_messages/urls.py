from django.urls import path

from . import views



urlpatterns = [
    path('chat/', views.Chat.as_view(), name='chat'),
    path('check_messages/', views.CheckMessages.as_view(), name='check_messages'),
    path('get_messages/', views.GetMessages.as_view(), name='get_messages'),
]