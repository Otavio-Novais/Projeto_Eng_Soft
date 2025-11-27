from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    title = models.CharField(max_length=200) 
    description = models.TextField(blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    
    #manter?
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    
    # ManyToMany pois a viagem pode possuir vários membros -> manter?
    participants = models.ManyToManyField(User, related_name='trips')

    def __str__(self):
        return self.title

class Activity(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=200) 
    location = models.CharField(max_length=200, blank=True)
    date = models.DateTimeField()
    is_confirmed = models.BooleanField(default=False)

class Expense(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='expenses')
    payer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200) 
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    #não teria que ter o budget?