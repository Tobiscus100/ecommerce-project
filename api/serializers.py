from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
# IMPORT THE CORRECT BASE SERIALIZER:
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Product 

# =====================================================================
# 1. PRODUCT SERIALIZER (Restored for HomeScreen / ProductScreen)
# =====================================================================
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


# =====================================================================
# 2. USER PROFILE SERIALIZERS (For Authentication Flow)
# =====================================================================
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email
        return name


# FIXED: Inheriting from the correct TokenObtainPairSerializer class!
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['name'] = user.first_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Injects your custom fields (including 'token') into the final login response
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
            
        return data


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)