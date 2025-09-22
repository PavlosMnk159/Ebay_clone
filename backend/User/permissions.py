from rest_framework.permissions import BasePermission

class CanApproveUserRegistration(BasePermission):
    """Only users with 'can_approve_user_registration' permission can access."""
    def has_permission(self, request, view):
        return (
            request.CustomUser
            and request.CustomUser.is_authenticated
            and request.CustomUser.has_perm("users.can_approve_user_registration")
        )


class CanViewUserList(BasePermission):
    """Only users with 'can_view_user_list' permission can access."""
    def has_permission(self, request, view):
        return (
            request.CustomUser
            and request.CustomUser.is_authenticated
            and request.CustomUser.has_perm("users.can_view_user_list")
        )


class CanViewUserDetails(BasePermission):
    """Only users with 'can_view_user_details' permission can access."""
    def has_permission(self, request, view):
        return (
            request.CustomUser
            and request.CustomUser.is_authenticated
            and request.CustomUser.has_perm("users.can_view_user_details")
        )
