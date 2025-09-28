from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

urlpatterns = [
    path('items/', views.ItemList.as_view(), name='list_items'),
    path('my_items/', views.MyItemList.as_view(), name='my_items'),
    path('items/<int:item_id>/', views.ItemDetail.as_view(), name='item_detail'),
    path('bid/', views.PlaceBid.as_view(), name='bid'),
    path("item_bids/", views.ItemBidsView.as_view(), name="item-bids"),
    path('buy', views.BuyOut.as_view(), name='buy'),
    path('categories/', views.CategoryList.as_view(), name='categories'),
    path('create_item/', views.CreateAuctionItem.as_view(), name='create_item'),
    path('extract_xml/', views.ActiveItemsXMLView.as_view(), name='extract_xml'),
    path('extract_json/', views.ActiveItemsExportView.as_view(), name='extract_json'),
    path('delete_item/', views.DeleteAuctionItem.as_view(), name='delete_item'),
    path('edit_item/', views.EditAuctionItem.as_view(), name='edit_item'),
    path('start_auction/', views.ActivateItemView.as_view(), name='start_auction'),
    path('my_bids/', views.MyBids.as_view(), name='my_bids'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)