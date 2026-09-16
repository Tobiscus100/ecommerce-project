from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Category, Order, OrderItem

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login_input = attrs.get('username')
        password = attrs.get('password')

        # 1. Look up user by email or username (case-insensitive)
        user = User.objects.filter(
            Q(email__iexact=login_input) | Q(username__iexact=login_input)
        ).first()

        # 2. Validate password directly against the found user instance
        if user and user.check_password(password):
            if not user.is_active:
                raise serializers.ValidationError({"detail": "User account is disabled."})

            # 3. Mint the JWT pair directly for this user
            refresh = RefreshToken.for_user(user)

            return {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'id': user.id,
                '_id': user.id,
                'username': user.username,
                'email': user.email,
                'name': user.first_name or user.username,
                'isAdmin': user.is_staff,
            }

        raise serializers.ValidationError({"detail": "Invalid credentials. Please verify your email and password."})

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            '_id', 
            'name', 
            'image', 
            'brand', 
            'description', 
            'rating', 
            'numReviews', 
            'price', 
            'countInStock', 
            'createdAt', 
            'category'
        ]

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name

    def get_id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data