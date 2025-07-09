from django.db import models
from django.conf import settings

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
    price = models.DecimalField(max_digits=10, decimal_places=2)
    authors = models.ManyToManyField(Author, through='BookAuthor', related_name='books')
    genres = models.ManyToManyField(Genre, through='BookGenre', related_name='books')

    class Meta:
        db_table = 'books'

    def __str__(self):
        return self.title

class BookAuthor(models.Model):
    id = models.AutoField(primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)

    class Meta:
        db_table = 'book_authors'
        unique_together = ('book', 'author')
        constraints = [
            models.UniqueConstraint(fields=['book', 'author'], name='unique_book_author')
        ]

class BookGenre(models.Model):
    id = models.AutoField(primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)

    class Meta:
        db_table = 'book_genres'
        unique_together = ('book', 'genre')
        constraints = [
            models.UniqueConstraint(fields=['book', 'genre'], name='unique_book_genre')
        ]

class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart_items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('user', 'book')

    def __str__(self):
        return f'{self.quantity} x {self.book.title} (User: {self.user.email})'
    
class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Order #{self.id} by {self.user.email}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.quantity} x {self.book.title} (Order #{self.order.id})'

cover_image = models.ImageField(upload_to='covers/', blank=True, null=True)