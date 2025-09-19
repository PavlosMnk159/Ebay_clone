from celery import shared_task
from django.utils import timezone
from auctions.models import Item
from user_messages.models import Conversations

@shared_task
def check_expired_items():
    now = timezone.now()
    expired_items = Item.objects.filter(active=True, ends__lte=now).order_by('ends')
    print("item expired")
    for item in expired_items:
        # Get highest bid
        highest_bid = item.bids.order_by('-amount', 'time').first()

        if highest_bid:
            # Create conversation between seller and winning bidder
            Conversations.objects.create(
                seller=item.seller,
                buyer=highest_bid.bidder
            )

        # Mark item inactive
        item.active = False
        item.save(update_fields=['active'])