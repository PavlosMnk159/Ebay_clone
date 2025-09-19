from django.urls import path

from . import views

urlpatterns = [
    path('items/', views.ItemDetail.as_view(), name='list_items'),
    path('items/<int:item_id>/', views.ItemList.as_view(), name='item_detail')
]