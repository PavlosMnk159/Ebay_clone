from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('token/', views.LoginView.as_view(), name='token_obtain_pair'),  # login
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # refresh token
    path('user_list/', views.ViewUserList.as_view(), name='user_list'),
    path('unapproved_user_list/', views.ViewInactiveUserList.as_view(), name='unapproved_user_list'),
    path('approve_user/', views.AproveAccount.as_view(), name='approve_user'),
    path('request_count/', views.ViewInactiveUserCount.as_view(), name='request_count')
]