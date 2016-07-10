from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import json
import pymongo

connection = pymongo.MongoClient('mongodb://rockfish:rockfish@localhost:27017/rockfish')
db = connection.rockfish
collection  = db.rockfish_admin_master

# Create your views here.
def index(request):
    return render(request, 'console/index.html')

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

	

def sessionCheck(request):
	 response_data = {}
	 response_data['rockfish_result_code'] = 'E'

	 if request.session.get('user_id', False):	 	
	 	response_data['rockfish_result_code'] = 'S'
	 	userInfo = {}
	 	userInfo['user_id'] = request.session.get('user_id')
	 	userInfo['user_name'] = request.session.get('user_name')
	 	response_data['rockfish_result_data'] = userInfo

	 return JsonResponse(response_data)

### TO - DO RSA decrypted and AES Encrypted
def login(request):
	print('###########################')
	print('ID :'+request.POST.get('ID',''))
	print('PASSWORD :'+request.POST.get('PASSWORD',''))
	print('###########################')

	docs = collection.find({"ID": "rockfish"})

	for i in docs:
	  print(i)

	request.session['user_id'] = 'rockfish'
	request.session['user_name'] = 'rockfish'

	response_data = {}
	response_data['rockfish_result_code'] = 'S'
	response_data['rockfish_result_msg'] = 'login success.' #login fail.

	return JsonResponse(response_data)


def logout(request):
    try:
        del request.session['user_id']
        del request.session['user_name']
    except KeyError:
        pass

    response_data = {}
    response_data['rockfish_result_code'] = 'S'

    return JsonResponse(response_data)