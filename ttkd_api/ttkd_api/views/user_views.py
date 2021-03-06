"""UserViewSet"""
from ..serializers import UserSerializer, UserPasswordSerializer, UserInfoSerializer
from django.contrib.auth.models import User
from rest_framework import viewsets
from ..permissions import custom_permissions



class UserViewSet(viewsets.ModelViewSet):
    """
    Returns all User objects to the Route.
    GET: Returns all User Objects To The Route, Or An Instance If Given A PK.
    PUT: Update a specific User.
    """
    permission_classes = (custom_permissions.IsAdminOrReadOnly,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "current":
            return self.request.user

        return super(UserViewSet, self).get_object()


class ChangePasswordView(viewsets.ModelViewSet):
    """
    Returns all User objects to the Route.
    GET: Returns all User Objects To The Route, Or An Instance If Given A PK.
    PUT: Update a specific User.
    """
    permission_classes = (custom_permissions.CurrentUserPassword,)
    queryset = User.objects.all()
    serializer_class = UserPasswordSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "current" or not self.request.user.is_staff: # if they aren't staff they should only get their own object (this is to keep users from modding other user passwords)
            return self.request.user

        return super(ChangePasswordView, self).get_object()


class UserInfoView(viewsets.ModelViewSet):
    """
    Returns all User objects to the Route.
    GET: Returns all User Objects To The Route, Or An Instance If Given A PK.
    PUT: Update a specific User.
    """
    permission_classes = (custom_permissions.IsAdminPutOnly,)
    queryset = User.objects.all()
    serializer_class = UserInfoSerializer

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "current":
            return self.request.user

        return super(UserInfoView, self).get_object()