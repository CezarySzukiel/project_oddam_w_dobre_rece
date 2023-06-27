from django.contrib.auth.models import User
from django.db import models

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name


class Institution(models.Model):
    TYPE_CHOICES = (
        ('fundacja', 'fundacja'),
        ('organizacja pozarządowa', 'organizacja pozarządowa'),
        ('zbiórka lokalna', 'zbiórka lokalna')
    )
    name = models.CharField(max_length=128)
    description = models.TextField()
    type = models.CharField(max_length=64, choices=TYPE_CHOICES, default='fundacja')
    categories = models.ManyToManyField(Category)

    def __str__(self):
        return self.name

# Stwórz model dla daru - Donation posiadający następujące atrybuty:
# - quantity (liczba worków)
# - categories (relacja ManyToMany do modelu Category)
# - institution (klucz obcy do modelu Institution)
# - address (ulica plus numer domu)
# - phone_number (numer telefonu)
# - city
# - zip_code
# - pick_up_date
# - pick_up_time
# - pick_up_comment
# - user (klucz obcy do tabeli user; domyślna tabela zakładana przez django; może być Nullem, domyślnie Null).


class Donation(models.Model):
    quantity = models.IntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=128)
    phone_number = models.CharField(max_length=16)
    city = models.CharField(max_length=128)
    zip_code = models.CharField(max_length=16)
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.TextField()
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, default=None)

