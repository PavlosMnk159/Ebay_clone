from django.db import models
from User.models import CustomUser

class MessageState(models.Model):
    has_messages = models.BooleanField(default=False)

    @classmethod
    def get_message_status(cls):
        """
        A view method that checks if there are any new messages for the user that requested them
        """
        state = cls.objects.first()
        if not state:
            state = cls.objects.create(has_messages=False)
        if not state.has_messages:
            cls.check_for_messages(state)

        return state.has_messages

    @classmethod
    def check_for_messages(cls, state):
        return True
    
class Conversations(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="seller_conversation")
    buyer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="buyer_conversation")
    created_at = models.DateTimeField(auto_now_add=True)

    deleted_by_sender = models.BooleanField(default=False)
    deleted_by_receiver = models.BooleanField(default=False)

    

class Messages(models.Model):
    conversation = models.ForeignKey(Conversations, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)


    class Meta:
        ordering = ["timestamp"] 