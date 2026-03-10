from django.shortcuts import render
from .models import Deal, FollowUp
from django.db.models import Count
from datetime import date
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Deal
from .serializers import DealSerializer

@api_view(['GET'])
def deals_api(request):
    deals = Deal.objects.all()
    serializer = DealSerializer(deals, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
def update_deal_stage(request, deal_id):
    try:
        deal = Deal.objects.get(id=deal_id)
    except Deal.DoesNotExist:
        return Response({"error": "Deal not found"}, status=404)
    
    deal.stage=request.data.get("stage")
    deal.save()
    return Response({"message": "Stage updated"})

def dashboard(request):

    lead_deals = Deal.objects.filter(stage="Lead")
    contacted_deals = Deal.objects.filter(stage="Contacted")
    demo_deals = Deal.objects.filter(stage="Demo")
    negotiation_deals = Deal.objects.filter(stage="Negotiation")
    won_deals = Deal.objects.filter(stage="Won")
    lost_deals = Deal.objects.filter(stage="Lost")
    
    # Get overdue follow-ups
    overdue_followups = FollowUp.objects.filter(follow_up_date__lt=date.today(), completed=False)
    
    # Pipeline data for breakdown
    pipeline_data = Deal.objects.values('stage').annotate(count=Count('id')).order_by('stage')

    context = {
        "lead_deals": lead_deals,
        "contacted_deals": contacted_deals,
        "demo_deals": demo_deals,
        "negotiation_deals": negotiation_deals,
        "won_deals": won_deals,
        "lost_deals": lost_deals,

        "total_deals": Deal.objects.count(),
        "won_deals_count": won_deals.count(),
        "lost_deals_count": lost_deals.count(),
        "overdue_followups_count": overdue_followups.count(),
        
        "overdue_followups": overdue_followups,
        "pipeline_data": pipeline_data,
    }

    return render(request, "dashboard.html", context)
from .forms import ClientForm, DealForm
from django.shortcuts import redirect

def add_client(request):
    if request.method == "POST":
        form = ClientForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('dashboard')
    else:
        form = ClientForm()

    return render(request, "add_client.html", {"form": form})


def add_deal(request):
    if request.method == "POST":
        form = DealForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('dashboard')
    else:
        form = DealForm()

    return render(request, "add_deal.html", {"form": form})