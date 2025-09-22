from django.urls import path

from . import views

urlpatterns = [
    path('items/', views.ItemList.as_view(), name='list_items'),
    path('my_items/', views.MyItemList.as_view(), name='my_items'),
    path('items/<int:item_id>/', views.ItemDetail.as_view(), name='item_detail'),
    path('bid/', views.PlaceBid.as_view(), name='bid'),
    path('categories/', views.CategoryList.as_view(), name='categories'),
    path('create_item/', views.CreateAuctionItem.as_view(), name='create_item'),
]