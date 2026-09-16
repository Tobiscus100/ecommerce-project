import os
import stripe
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from django.http import HttpResponse 
from django.views.decorators.csrf import csrf_exempt
from django.dispatch import Signal, receiver
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Product, Category, Order, OrderItem
from .serializers import ProductSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

order_completed_signal = Signal()

def format_shipping_address(raw_address):
    if isinstance(raw_address, dict):
        street = raw_address.get('address', '')
        city = raw_address.get('city', '')
        country = raw_address.get('country', '')
        postal_code = raw_address.get('postalCode', '')
        
        parts = [p for p in [street, city, country] if p]
        formatted = ", ".join(parts)
        if postal_code:
            formatted += f", {postal_code}"
        return formatted if formatted else 'Not specified'
    
    if isinstance(raw_address, str) and raw_address.strip() != '':
        return raw_address
        
    return 'Not specified'

@api_view(['GET'])
def getProducts(request):
    category_slug = request.query_params.get('category', '')
    products = Product.objects.all()

    if category_slug:
        products = products.filter(category__slug=category_slug)

    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.filter(_id=pk).first()
        if not product:
            product = Product.objects.get(id=pk)
        
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {'detail': 'Product not found in our database records.'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
def getCategories(request):
    categories = Category.objects.all()
    data = [{'name': cat.name, 'slug': cat.slug} for cat in categories]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_stripe_checkout_session(request):
    user = request.user
    data = request.data
    cart_items = data.get('cartItems', [])

    if not cart_items:
        return Response({'detail': 'Your shopping cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        line_items = []
        for item in cart_items:
            line_items.append({
                'price_data': {
                    'currency': 'ngn',
                    'product_data': {
                        'name': item['name'],
                    },
                    'unit_amount': int(float(item['price']) * 100),
                },
                'quantity': int(item['qty']),
            })

        # Dynamically point back to the client origin (Netlify in prod, localhost in dev)
        origin = request.headers.get('Origin')
        frontend_url = origin if origin else os.environ.get('FRONTEND_URL', 'https://premium-shopweb.netlify.app')

        session_kwargs = {
            'payment_method_types': ['card'],
            'line_items': line_items,
            'mode': 'payment',
            'success_url': f"{frontend_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            'cancel_url': f"{frontend_url}/cart",
            'metadata': {
                'user_id': user.id,
                'username': user.username
            }
        }

        if user.email and user.email.strip() != "":
            session_kwargs['customer_email'] = user.email

        session = stripe.checkout.Session.create(**session_kwargs)

        return Response({'url': session.url}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        if User.objects.filter(email=data.get('email')).exists():
            return Response(
                {'detail': 'A user account with this email address already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if User.objects.filter(username=data.get('username')).exists():
            return Response(
                {'detail': 'This username is already taken.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create(
            first_name=data.get('name', ''),
            username=data.get('username'),
            email=data.get('email'),
            password=make_password(data.get('password'))
        )

        refresh = RefreshToken.for_user(user)
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'name': user.first_name,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'detail': 'Registration processing error. Please confirm all payload values are filled correctly.'},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def save_completed_order(request):
    user = request.user
    data = request.data
    
    cart_items = data.get('cartItems', [])
    total_price = data.get('totalPrice', '0.00')
    session_id = data.get('sessionId', '')
    raw_shipping_address = data.get('shippingAddress', 'Not specified')

    if not cart_items:
        return Response({'detail': 'Cannot persist empty order arrays.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        cleaned_total_price = str(total_price).replace('₦', '').replace(',', '').strip()
        formatted_address = format_shipping_address(raw_shipping_address)

        order = Order.objects.create(
            user=user,
            paymentMethod='Stripe Card',
            totalPrice=cleaned_total_price,
            shippingAddress=formatted_address,
            stripeSessionId=session_id,
            isPaid=True,
            paidAt=timezone.now()
        )

        for item in cart_items:
            product_instance = Product.objects.filter(_id=item.get('id')).first() if item.get('id') else None
            cleaned_item_price = str(item.get('price', '0.00')).replace('₦', '').replace(',', '').strip()

            OrderItem.objects.create(
                order=order,
                product=product_instance,
                name=item['name'],
                qty=int(item['qty']),
                price=float(cleaned_item_price),
                image=item.get('image', '')
            )

        order_completed_signal.send(
            sender=Order,
            order_instance=order,
            user_instance=user,
            items_array=cart_items
        )

        return Response({'success': True, 'order_id': order._id}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'detail': f'Database logging execution error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@receiver(order_completed_signal)
def trigger_automated_purchase_email(sender, order_instance, user_instance, items_array, **kwargs):
    order_id = getattr(order_instance, '_id', 'N/A')
    total_price = getattr(order_instance, 'totalPrice', 'N/A')
    shipping_address = getattr(order_instance, 'shippingAddress', 'Not specified')
    customer_email = getattr(user_instance, 'email', None)
    username = getattr(user_instance, 'username', 'Customer')
    first_name = getattr(user_instance, 'first_name', '')

    if not customer_email:
        return

    customer_subject = f"Order Confirmed! Premium Shop Receipt - Order #{order_id}"
    customer_message = f"Hello {first_name or username},\n\n"
    customer_message += f"Thank you for your purchase! We received your order successfully.\n\n"
    customer_message += "--- YOUR ORDER SUMMARY ---\n"
    for item in items_array:
        customer_message += f"✔ {item['name']} x {item['qty']} — (₦{item['price']})\n"
    customer_message += "-------------------------------\n"
    customer_message += f"Total Securely Processed: ₦{total_price}\n"
    customer_message += f"Shipping Route Allocated: {shipping_address}\n\n"
    customer_message += "Thank you for shopping with us!"

    admin_email = "isaac.oluwaseun.bright@gmail.com"  
    admin_subject = f"NEW ORDER ALERT! - Order #{order_id} Processed Successfully"
    admin_message = f"Hello Admin,\n\n"
    admin_message += f"Great news! A customer just completed a successful transaction via Stripe.\n\n"
    admin_message += f"--- TRANSACTION DETAILS ---\n"
    admin_message += f"👤 Buyer Profile: {first_name or username} ({customer_email})\n"
    admin_message += f"💰 Total Funds Captured: ₦{total_price}\n"
    admin_message += f"📍 Shipping Destination: {shipping_address}\n\n"
    admin_message += "--- ITEMS GRABBED ---\n"
    for item in items_array:
        admin_message += f"📦 {item['name']} x {item['qty']}\n"
    admin_message += "---------------------------\n\n"
    admin_message += "Log into your Stripe Dashboard and Django Admin Panel to process fulfillment."

    try:
        send_mail(
            subject=customer_subject,
            message=customer_message,
            from_email="no-reply@premiumshop.com",
            recipient_list=[customer_email],
            fail_silently=False,
        )

        send_mail(
            subject=admin_subject,
            message=admin_message,
            from_email="system-alerts@premiumshop.com",
            recipient_list=[admin_email],
            fail_silently=False,
        )

    except Exception as err:
        pass

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-createdAt')
    
    orders_data = []
    for order in orders:
        orders_data.append({
            '_id': order._id,
            'createdAt': order.createdAt.strftime('%Y-%m-%d %H:%M'),
            'totalPrice': str(order.totalPrice),
            'isPaid': order.isPaid,
            'paidAt': order.paidAt.strftime('%Y-%m-%d %H:%M') if order.paidAt else 'N/A',
            'shippingAddress': order.shippingAddress
        })
        
    return Response(orders_data, status=status.HTTP_200_OK)

@csrf_exempt
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)
    except stripe.error.SignatureVerificationError:
        return HttpResponse(status=status.HTTP_400_BAD_REQUEST)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        customer_email = session.get('customer_details', {}).get('email')
        total_amount = session.get('amount_total', 0) / 100

        matched_user = User.objects.filter(email=customer_email).first()

        order_completed_signal.send(
            sender=stripe.checkout.Session,
            order_instance=None, 
            user_instance=matched_user or User(username=customer_email.split('@')[0], email=customer_email),
            items_array=[{"name": f"Stripe Checkout Line Items (Ref: {session.get('id')[:12]})", "qty": 1, "price": total_amount}]
        )

    return HttpResponse(status=status.HTTP_200_OK)