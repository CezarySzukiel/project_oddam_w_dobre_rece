from django.db.models import Sum
from django.shortcuts import render
from django.views import View

from oddam_w_dobre_rece.models import Donation, Institution


# Create your views here.
class LandingPage(View):
    def get(self, request):
        total_quantity = Donation.objects.aggregate(total_quantity=Sum('quantity'))['total_quantity']
        total_supported_institutions = Donation.objects.values('institution').distinct().count()
        institutions = Institution.objects.all()
        context = {'total_quantity': total_quantity,
                   'total_supported_institutions': total_supported_institutions,
                   'institutions': institutions}
        return render(request, 'index.html', context)


class AddDonation(View):
    def get(self, request):
        return render(request, 'form.html')


class Login(View):
    def get(self, request):
        return render(request, 'login.html')


class Register(View):
    def get(self, request):
        return render(request, 'register.html')


class FormConfirmation(View):
    def get(self, request):
        return render(request, 'form-confirmation.html')