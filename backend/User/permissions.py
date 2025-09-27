from rest_framework.permissions import BasePermission

class CanApproveUserRegistration(BasePermission):
    """Only users with 'can_approve_user_registration' permission can access."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.has_perm("users.can_approve_user_registration")
        )


class CanViewUserList(BasePermission):
    """Only users with 'can_view_user_list' permission can access."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.has_perm("users.can_view_user_list")
        )


class CanViewUserDetails(BasePermission):
    """Only users with 'can_view_user_details' permission can access."""
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.has_perm("users.can_view_user_details")
        )
    
class IsApproved(BasePermission):
    """
    Allows access only to users whose registration has been approved.
    """
    message = "Your account has not been approved yet."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, "is_approved", False))