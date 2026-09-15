from django.urls import path
from . import views
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

urlpatterns = [
    path('products/', views.getProducts, name="products"),
    path('products/<str:pk>/', views.getProduct, name="product"),
    path('categories/', views.getCategories, name="categories"),
    
    path('users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/register/', views.registerUser, name='user-register'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('orders/save-order/', views.save_completed_order, name='save-order'),
    path('orders/my-orders/', views.get_my_orders, name='my-orders'),

    path('orders/stripe-checkout/', views.create_stripe_checkout_session, name='stripe-checkout'),
    path('orders/stripe-webhook/', views.stripe_webhook_view, name='stripe-webhook'),
]