from django.shortcuts import render
from .models import Deal, FollowUp
from datetime import date

def dashboard(request):
    total_deals = Deal.objects.count()
    won_deals = Deal.objects.filter(stage='Won').count()
    lost_deals = Deal.objects.filter(stage='Lost').count()

    overdue_followups = FollowUp.objects.filter(
        follow_up_date__lt=date.today(),
        completed=False
    ).count()

    context = {
        'total_deals': total_deals,
        'won_deals': won_deals,
        'lost_deals': lost_deals,
        'overdue_followups': overdue_followups,
    }

    return render(request, 'dashboard.html', context)