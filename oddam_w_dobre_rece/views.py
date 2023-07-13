from datetime import date, time, datetime

from django.contrib.auth import login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.db.models import Sum, F
from django.shortcuts import render, redirect
from django.views import View
from .forms import RegisterForm, LoginForm
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from oddam_w_dobre_rece.models import Donation, Institution, Category


# Create your views here.
class LandingPage(View):
    def get(self, request):
        total_quantity = Donation.objects.aggregate(total_quantity=Sum('quantity'))['total_quantity']
        total_supported_institutions = Donation.objects.values('institution').distinct().count()
        institutions = Institution.objects.all()
        context = {'total_quantity': total_quantity,
                   'total_supported_institutions': total_supported_institutions,
                   'institutions': institutions}
        response = render(request, 'index.html', context)
        # response.set_cookie('data', 'false')
        return response


class AddDonation(LoginRequiredMixin, View):
    def get(self, request):
        context = {'categories': Category.objects.all(),
                   'institutions': Institution.objects.all()}

        return render(request, 'form.html', context)


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
            # _______________register confirmation on mail____________________
            token = user.auth_token.key
            subject = 'Potwierdzenie rejestracji'
            html_message = render_to_string('register-confirmation-email.html', {'user': user, 'token': token}) #todo sprawdzić to wszystko jak to ma działać, może wyszukaćna forum?
            plain_message = strip_tags(html_message)
            send_mail(subject, plain_message, 'cezary.gra2@gmail.com', [user.email], html_message=html_message)

            # __________________________________________________________________
            return redirect('login')
        return render(request, 'register.html', {'form': form})


class FormConfirmation(View):
    def get(self, request):
        return render(request, 'form-confirmation.html')
        # return redirect('index')

    def post(self, request):
        quantity = request.POST['bags']
        quantity = int(quantity)
        categories = request.POST.getlist('categories')
        categories = [int(category) for category in categories]
        institution = request.POST['organization']
        institution = int(institution)
        address = request.POST['address']
        phone_number = request.POST['phone']
        city = request.POST['city']
        zip_code = request.POST['postcode']
        pick_up_date = request.POST['data']
        pick_up_time = request.POST['time']
        pick_up_comment = request.POST['more_info']
        user = request.user
        donation = Donation(quantity=quantity,
                            # categories=categories,
                            institution=Institution.objects.get(pk=institution),
                            address=address,
                            phone_number=phone_number,
                            city=city,
                            zip_code=zip_code,
                            pick_up_date=pick_up_date,
                            pick_up_time=pick_up_time,
                            pick_up_comment=pick_up_comment,
                            user=user)
        donation.save()
        categories = [Category.objects.get(pk=category) for category in categories]
        donation.categories.set(categories)
        return render(request, 'form-confirmation.html')


class Profile(View):
    def get(self, request):
        donations = Donation.objects.filter(user=request.user).order_by(F('is_taken').asc(), 'id')
        return render(request, 'user-profile.html', {'donations': donations})

    def post(self, request):
        donation_id = request.POST['donation_id']
        donation = Donation.objects.get(pk=donation_id)
        donation.is_taken = True
        donation.pick_up_date = date.today()
        donation.pick_up_time = datetime.now().time()
        donation.save()
        return redirect('profile')


class RegisterConfirmation(View):
    def get(self, request):
        return render(request, 'register-confirmation.html')
