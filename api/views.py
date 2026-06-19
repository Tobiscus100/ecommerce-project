from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.conf import settings
import stripe

# Import BOTH models and all needed serializers correctly
from .models import Product, Order, OrderItem, ShippingAddress
from .serializers import ProductSerializer, UserSerializer, UserSerializerWithToken, OrderSerializer

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer

# Initialize Stripe with your active secret key configuration token 
stripe.api_key = settings.STRIPE_SECRET_KEY


# =====================================================================
# 1. PRODUCT VIEWS (Powers HomeScreen and ProductScreen)
# =====================================================================

@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


# =====================================================================
# 2. USER AUTHENTICATION & REGISTRATION VIEWS
# =====================================================================

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        if User.objects.filter(username=data['email']).exists():
            content = {'detail': 'User with this email already exists'}
            return Response(content, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
        
    except Exception as e:
        content = {'detail': 'Something went wrong during registration'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user 
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data
    
    # Update core details
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    
    # Only update password if the user typed something into that field
    if data.get('password', '') != '':
        user.password = make_password(data['password'])
        
    user.save()
    
    # Generate the fresh token dataset
    serializer = UserSerializerWithToken(user, many=False)
    responseData = serializer.data
    
    # 🌟 THE BULLETPROOF LOCK: Mirror the token to both potential frontend keys
    responseData['access'] = responseData.get('token')
    
    return Response(responseData)


# =====================================================================
# 3. STRIPE SECURE TRANSACTION VIEWS
# =====================================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    try:
        data = request.data
        cart_items = data.get('cartItems', [])

        if not cart_items:
            return Response({'detail': 'Your shopping cart is currently empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total amount explicitly in CENTS ($10.50 = 1050 cents)
        total_amount = 0
        for item in cart_items:
            price_in_cents = int(float(item['price']) * 100)
            total_amount += price_in_cents * int(item['qty'])

        # Mirror frontend flat-rate shipping rule: Add $10 if subtotal is below $100
        if total_amount < 10000:
            total_amount += 1000

        # Register secure intent payload parameters on Stripe infrastructure
        intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency='usd',
            metadata={
                'user_id': request.user.id,
                'email': request.user.email
            }
        )

        # Hand back the verification token to Axios
        return Response({
            'clientSecret': intent.client_secret
        }, status=status.HTTP_200_OK)

    except stripe.error.StripeError as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    order_items = data.get('orderItems', [])

    if not order_items:
        return Response({'detail': 'No Order Items Found'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # 1. Create the base Order instance record inside your database
        # Make sure these model attributes match your Order model field names exactly
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice']
        )

        # 2. Create the ShippingAddress instance record associated with this order
        ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # 3. Create OrderItem instances and update database product stock levels
        for item in order_items:
            product = Product.objects.get(_id=item['product'])

            # Create individual transaction items
            order_item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item['qty'],
                price=item['price'],
                image=product.image if product.image else ''
            )

            # Reduce product stock level based on purchased amount
            product.countInStock -= int(order_item.qty)
            product.save()

        # Serialize and return the newly generated database invoice instance structure
        # Replace OrderSerializer with your exact matching serializer name if different
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)