from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from django.db.models import Sum
from django.shortcuts import render, redirect
from django.views import View
from .forms import RegisterForm, LoginForm

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
        context = {'form': LoginForm()}
        return render(request, 'login.html', context)

    def post(self, request):
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            if user is not None:
                login(request, user)
                return redirect('index')
        return redirect('register')


class Logout(View):
    def get(self, request):
        logout(request)
        return redirect('index')


class Register(View):
    def get(self, request):
        context = {'form': RegisterForm()}
        return render(request, 'register.html', context)

    def post(self, request):
        form = RegisterForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            surname = form.cleaned_data['surname']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password1']
            user = User.objects.create_user(password=password,
                                            first_name=name,
                                            last_name=surname,
                                            email=email,
                                            username=email)
            user.save()
            return redirect('login')
        return render(request, 'register.html', {'form': form})


class FormConfirmation(View):
    def get(self, request):
        return render(request, 'form-confirmation.html')