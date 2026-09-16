from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Product, Category, Order, OrderItem

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Allow sign in with either username OR email
        account_identifier = attrs.get('username')
        
        if account_identifier:
            # Check if there is a matching user by email or username (case-insensitive)
            matched_user = User.objects.filter(
                Q(username__iexact=account_identifier) | Q(email__iexact=account_identifier)
            ).first()

            if matched_user:
                # Reassign the actual Django username so SimpleJWT internal authentication succeeds
                attrs['username'] = matched_user.username

        data = super().validate(attrs)

        # Include custom user profile fields in JWT response
        data['id'] = self.user.id
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['name'] = self.user.first_name or self.user.username
        return data

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