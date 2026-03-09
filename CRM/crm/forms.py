from django import forms
from .models import Client, Deal

class ClientForm(forms.ModelForm):
    class Meta:
        model = Client
        fields = ['name', 'email', 'phone', 'company']


class DealForm(forms.ModelForm):
    class Meta:
        model = Deal
        fields = ['client', 'value', 'stage', 'assigned_to']