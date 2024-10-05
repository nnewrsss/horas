# permissions.py

from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Custom permission to allow only admin users to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.userprofile.role == 'admin'
