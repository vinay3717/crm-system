from django.contrib import admin
from .models import Client, Deal, Activity, FollowUp

admin.site.register(Client)
admin.site.register(Deal)
admin.site.register(Activity)
admin.site.register(FollowUp)