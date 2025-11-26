from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Trip(models.Model):
    name = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField()
    members = models.ManyToManyField(User, related_name='trips')

    def __str__(self):
        return self.name

class Suggestion(models.Model):
    CATEGORY_CHOICES = [
        ('ACTIVITY', 'Atividade'),
        ('LODGING', 'Hospedagem'),
        ('FOOD', 'Comida'),
        ('TRANSPORT', 'Transporte'),
    ]
    
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='suggestions')
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    proposed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return self.title

class Option(models.Model):
    suggestion = models.ForeignKey(Suggestion, on_delete=models.CASCADE, related_name='options')
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.name

class Vote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    suggestion = models.ForeignKey(Suggestion, on_delete=models.CASCADE, null=True, blank=True)
    option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    is_approved = models.BooleanField(default=False) 
    
    class Meta:
        unique_together = (('user', 'suggestion'), ('user', 'option'))