from django.urls import path
from .views import dashboard, add_client, add_deal

urlpatterns = [
    path('', dashboard, name='dashboard'),
    path('add-client/', add_client, name='add_client'),
    path('add-deal/', add_deal, name='add_deal'),
]