from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return render(request, 'console/login.html')

def admin(request):
	return render(request, 'console/admin.html')

def admin_modal(request):
	return render(request, 'console/admin_modal.html')

def dashboard(request):
	return render(request, 'console/dashboard.html')

def log(request):
	return render(request, 'console/log.html')		

def log_modal(request):
	return render(request, 'console/log_modal.html')

def login(request):
	return render(request, 'console/login.html')

def montoring(request):
	return render(request, 'console/montoring.html')

def service(request):
	return render(request, 'console/service.html')		

def service_modal(request):
	return render(request, 'console/service_modal.html')	

def setting(request):
	return render(request, 'console/setting.html')

def user(request):
	return render(request, 'console/user.html')

def user_modal(request):
	return render(request, 'console/user_modal.html')
