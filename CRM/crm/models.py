from django.db import models
from django.contrib.auth.models import User

class Client(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    company = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Deal(models.Model):
    PIPELINE_STAGES = [
        ('Lead', 'Lead'),
        ('Contacted', 'Contacted'),
        ('Demo', 'Demo'),
        ('Negotiation', 'Negotiation'),
        ('Won', 'Won'),
        ('Lost', 'Lost'),
    ]

    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    value = models.IntegerField()
    stage = models.CharField(max_length=20, choices=PIPELINE_STAGES)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.name} - {self.stage}"


class Activity(models.Model):
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.deal.client.name} activity"


class FollowUp(models.Model):
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE)
    follow_up_date = models.DateField()
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Follow-up for {self.deal.client.name}"