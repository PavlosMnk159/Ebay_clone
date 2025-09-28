from django.urls import path

from . import views



urlpatterns = [
    path('send_message/', views.SendMessage.as_view(), name='send_message'),
    path('get_in_conversations/', views.GetInConversations.as_view(), name='get_in_conversations'),
    path('get_out_conversations/', views.GetOutConversations.as_view(), name='get_out_conversations'),
    path('get_conversation_messages/', views.GetConversationMessages.as_view(), name='get_conversation_messages'),
    path('delete_conversation/', views.DeleteConversationView.as_view(), name='delete_conversation'),
]