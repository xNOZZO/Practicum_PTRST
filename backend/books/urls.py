from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    BookViewSet, AuthorViewSet, GenreViewSet,
    PublisherViewSet, CartItemViewSet, OrderViewSet
)


router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'authors', AuthorViewSet)
router.register(r'genres', GenreViewSet)
router.register(r'publishers', PublisherViewSet)
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
]