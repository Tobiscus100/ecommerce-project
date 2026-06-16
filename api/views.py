from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status

from .serializers import UserSerializerWithToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

# 1. Get ALL products
@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

# 2. Get a SINGLE product (by ID)
@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        # Check if email/username is already registered
        if User.objects.filter(username=data['email']).exists():
            content = {'detail': 'User with this email already exists'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            first_name=data['name'],
            username=data['email'], # Use email as username for seamless frontend handling
            email=data['email'],
            password=make_password(data['password']) # Hashes password securely
        )
        
        # Serialize the new user and automatically attach a fresh login token
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
        
    except Exception as e:
        content = {'detail': 'Something went wrong during registration'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)