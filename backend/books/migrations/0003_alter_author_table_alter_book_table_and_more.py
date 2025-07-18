# Generated by Django 5.2.4 on 2025-07-06 07:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0002_alter_book_cover_image_url_alter_book_description_and_more'),
    ]

    operations = [
        migrations.AlterModelTable(
            name='author',
            table='authors',
        ),
        migrations.AlterModelTable(
            name='book',
            table='books',
        ),
        migrations.AlterModelTable(
            name='bookauthor',
            table='book_authors',
        ),
        migrations.AlterModelTable(
            name='bookgenre',
            table='book_genres',
        ),
        migrations.AlterModelTable(
            name='genre',
            table='genres',
        ),
        migrations.AlterModelTable(
            name='publisher',
            table='publishers',
        ),
    ]
