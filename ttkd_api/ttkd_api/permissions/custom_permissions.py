"""Custom Permissions for more specific definitions"""
from rest_framework import permissions
import json

class IsUserOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow the user being edited or admins to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method == "POST" and not request.user.is_staff:
        	return False
        	
        if request.method in permissions.SAFE_METHODS:
            return True

        data = dict(request.data.lists())
        print(request.method)

        # Is the user being modified or an admin.
        return request.user.is_staff or (obj.id == request.user.id and ("is_staff" not in data or not data["is_staff"]))

class IsAdminOrAuthReadOnly(permissions.BasePermission):
	pass


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow admins to edit it but anyone to read it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Is an admin.
        return request.user.is_staff