from django.db import models

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