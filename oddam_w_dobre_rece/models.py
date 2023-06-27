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