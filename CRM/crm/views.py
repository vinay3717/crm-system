from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Deal, FollowUp
from datetime import date
from django.db.models import Count

@login_required
def dashboard(request):
    total_deals = Deal.objects.count()
    won_deals = Deal.objects.filter(stage='Won').count()
    lost_deals = Deal.objects.filter(stage='Lost').count()
    pipeline_data = Deal.objects.values('stage').annotate(count=Count('stage'))

    overdue_followups = FollowUp.objects.filter(
        follow_up_date__lt=date.today(),
        completed=False
    )

    context = {
        'total_deals': total_deals,
        'won_deals': won_deals,
        'lost_deals': lost_deals,
        'overdue_followups_count': overdue_followups.count(),
        'overdue_followups': overdue_followups,
        'pipeline_data': pipeline_data,
    }

    return render(request, 'dashboard.html', context)