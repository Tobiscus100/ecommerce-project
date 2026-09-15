from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import Order

@receiver(post_save, sender=Order)
def send_invoice_email(sender, instance, created, **kwargs):
    if not created and instance.isPaid:
        if not getattr(instance, '_email_sent', False):
            try:
                subject = f"Your Premium Shop Invoice - Order #{instance._id}"
                recipient_email = instance.user.email
                
                plain_message = (
                    f"Hello {instance.user.username},\n\n"
                    f"Thank you for your purchase! We have successfully processed your payment via Stripe.\n\n"
                    f"--- ORDER SUMMARY ---\n"
                    f"Order ID: #{instance._id}\n"
                    f"Total Amount Paid: ${instance.totalPrice}\n\n"
                    f"Your items are being packed and prepared for shipping immediately.\n\n"
                    f"Best regards,\n"
                    f"The Premium Shop Team"
                )

                send_mail(
                    subject=subject,
                    message=plain_message,
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[recipient_email],
                    fail_silently=False,
                )
                
                instance._email_sent = True
                print(f"Success! Invoice email cleanly dispatched to {recipient_email}")
                
            except Exception as e:
                print(f"Mail Dispatch Error: {str(e)}")