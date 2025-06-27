from django.contrib import admin
from django.urls import path
from app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/', views.chat, name='chat'),
    path('status/', views.status_view, name='status'),
]