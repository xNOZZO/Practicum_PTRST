from django.db import models


class Publisher(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'publishers'

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'genres'

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        db_table = 'authors'

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    rating = models.DecimalField(max_digits=4, decimal_places=2, default=0.00)
    page_number = models.PositiveIntegerField()
    publication_year = models.PositiveIntegerField()
    publisher = models.ForeignKey(Publisher, on_delete=models.SET_NULL, null=True, related_name='books')
    isbn = models.CharField(max_length=20, unique=True)
    cover_image_url = models.URLField(max_length=512, blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    authors = models.ManyToManyField(Author, through='BookAuthor', related_name='books')
    genres = models.ManyToManyField(Genre, through='BookGenre', related_name='books')

    class Meta:
        db_table = 'books'

    def __str__(self):
        return self.title


class BookAuthor(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

    class Meta:
        db_table = 'book_authors'
        unique_together = ('book', 'author')


class BookGenre(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

    class Meta:
        db_table = 'book_genres'
        unique_together = ('book', 'genre')
