from rest_framework import serializers
from .models import Deal
class DealSerializer(serializers.ModelSerializer):
    client_name=serializers.CharField(source='client.name')
    class Meta:
        model = Deal
        fields = ['id', 'client_name', 'value','stage','assigned_to']