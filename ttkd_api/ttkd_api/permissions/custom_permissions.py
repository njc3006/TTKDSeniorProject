"""Custom Permissions for more specific definitions"""
from rest_framework import permissions

class IsUserOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow the user being edited or admins to edit it.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method == "POST" and not request.user.is_staff:
            return False
            
        if request.method in permissions.SAFE_METHODS:
            return True

        # Is the user being modified or an admin.
        return request.user.is_staff


    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method == "POST" and not request.user.is_staff:
        	return False
        	
        if request.method in permissions.SAFE_METHODS:
            return True

        data = request.data.dict()

        # Is the user being modified or an admin.
        return request.user.is_staff or (obj.id == request.user.id and ("is_staff" not in data or not data["is_staff"]))

class IsAdminOrAuthReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow admins to edit it but anyone to read it.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.user.is_anonymous:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        # Is an admin.
        return request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.user.is_anonymous and request.method != "OPTIONS":
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        # Is an admin.
        return request.user.is_staff
	


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow admins to edit it but anyone to read it.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Is an admin.
        return request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Is an admin.
        return request.user.is_staff
    


class ReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow admins to edit it but anyone to read it.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Is an admin.
        return False

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Is an admin.
        return False
    


class IsAuthenticatedOrOptions(permissions.BasePermission):
    """
    Object-level permission to only allow admins to edit it but anyone to read it.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.user.is_anonymous and request.method != "OPTIONS":
            return False

        return True