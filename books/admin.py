from django.contrib import admin
from .models import (
    CartItem, OrderItem, Order,
    Book, Author, Genre, Publisher,
    BookAuthor, BookGenre
)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderItemsAdmin(admin.ModelAdmin):
    list_display = ('order', 'book', 'quantity')

class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'total_price')
    inlines = [OrderItemInline]
    readonly_fields = ['total_price']

    def total_price(self, obj):
        total = sum(item.book.price * item.quantity for item in obj.items.all())
        return f'{total:.2f}'

class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'book', 'quantity', 'total_price')

    def total_price(self, obj):
        return obj.book.price * obj.quantity

class BookAuthorInline(admin.TabularInline):
    model = BookAuthor
    extra = 1

class BookGenreInline(admin.TabularInline):
    model = BookGenre
    extra = 1

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'publisher', 'price', 'publication_year')
    list_filter = ('publisher',)
    search_fields = ('title', 'isbn')
    inlines = [BookAuthorInline, BookGenreInline]

    def cover_image_preview(self, obj):
        if obj.cover_image_url:
            return f'<img src="{obj.cover_image_url}" style="max-height: 200px;" />'
        return "(No Image)"
    cover_image_preview.allow_tags = True
    cover_image_preview.short_description = "Cover Preview"


admin.site.register(Book, BookAdmin)
admin.site.register(Author)
admin.site.register(Genre)
admin.site.register(Publisher)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemsAdmin)
admin.site.register(CartItem, CartItemAdmin)