from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path("login/",   views.LoginView.as_view(),  name="login"),
    path("logout/",  views.LogoutView.as_view(), name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/",      views.me,                   name="me"),
    path("users/",   views.UserListCreateView.as_view(), name="users"),
    path("users/<uuid:pk>/", views.UserDetailView.as_view(), name="user_detail"),
]
