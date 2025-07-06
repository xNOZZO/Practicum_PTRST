from rest_framework import viewsets
from .models import Book, Author, Genre, Publisher
from .serializers import BookSerializer, AuthorSerializer, GenreSerializer, PublisherSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['authors', 'genres']
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'authors__name']


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


class PublisherViewSet(viewsets.ModelViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
