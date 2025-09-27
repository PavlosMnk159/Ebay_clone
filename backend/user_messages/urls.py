from django.urls import path

from . import views



urlpatterns = [
    path('send_message/', views.SendMessage.as_view(), name='send_message'),
    path('get_message/', views.GetMessage.as_view(), name='get_message'),
    path('check_messages/', views.CheckMessages.as_view(), name='check_messages'),
    path('unread_messages/', views.UnreadMessageCountView.as_view(), name='unread_messages'),
    path('get_out_messages/', views.GetOutMessages.as_view(), name='get_out_messages'),
    path('get_in_messages/', views.GetInMessages.as_view(), name='get_in_messages'),
]