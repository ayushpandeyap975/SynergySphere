from django.urls import path
from .views import test_auth

urlpatterns = [
    path("test/", test_auth),
]
