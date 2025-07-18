from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Book, Author, Genre, Publisher,
    CartItem, Order, OrderItem
)
from .serializers import (
    BookSerializer, AuthorSerializer, GenreSerializer,
    PublisherSerializer, CartItemSerializer, OrderSerializer
)

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genres']
    search_fields = ['title', 'authors__name']
    ordering_fields = ['title', 'price', 'publication_year', 'rating']
    ordering = ['-rating']

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_paginated_response(self, data):
        total_price = sum(
            item.book.price * item.quantity
            for item in self.get_queryset()
        )
        return Response({
            'count': self.paginator.page.paginator.count,
            'next': self.paginator.get_next_link(),
            'previous': self.paginator.get_previous_link(),
            'results': data,
            'total_price': total_price
        })

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)
            
        if not cart_items.exists():
            return Response({'detail': 'Cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(user=user)
        for item in cart_items:
            OrderItem.objects.create(order=order, book=item.book, quantity=item.quantity)
        cart_items.delete()

        return Response({'detail': 'Order created successfully.', 'order_id': order.id})
    
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)