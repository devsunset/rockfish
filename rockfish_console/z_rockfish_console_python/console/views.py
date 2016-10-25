# import
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
import json
import pymongo

# mongodb client
connection = pymongo.MongoClient('mongodb:##rockfish:rockfish@localhost:27017/rockfish')
db = connection.rockfish
collection  = db.rockfish_admin_master

# index page
def index(request):
    return render(request, 'console/index.html')

# admin page
def admin(request):
	return render(request, 'console/admin.html')

# admin popup page
def admin_modal(request):
	return render(request, 'console/admin_modal.html')

# dashboard page
def dashboard(request):
	return render(request, 'console/dashboard.html')

# log page
def log(request):
	return render(request, 'console/log.html')		

# log popup page
def log_modal(request):
	return render(request, 'console/log_modal.html')

# montoring page
def montoring(request):
	return render(request, 'console/montoring.html')

# service page
def service(request):
	return render(request, 'console/service.html')		

# service popup page
def service_modal(request):
	return render(request, 'console/service_modal.html')	

# setting page
def setting(request):
	return render(request, 'console/setting.html')

# user page
def user(request):
	return render(request, 'console/user.html')

# user pupup page
def user_modal(request):
	return render(request, 'console/user_modal.html')

############################################################################################
## LOGIN ,LOGOUT , SESSION CHECK PROCESS
############################################################################################	

# session check process
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
# login process
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

# logout process
def logout(request):
    try:
        del request.session['user_id']
        del request.session['user_name']
    except KeyError:
        pass

    response_data = {}
    response_data['rockfish_result_code'] = 'S'

    return JsonResponse(response_data)

##############################################################################################
## DASHBOARD PROCESS
##############################################################################################

## dashboard top 5 App Service Call process
def dashboardTop5AppInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## dashboard Service Call Summary process
def dashboardServiceInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## dashboard Service Call Result process
def dashboardServiceResultInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## dashboard Service Call History process
def dashboardServiceHistoryInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

##############################################################################################
## MONITORING PROCESS
##############################################################################################

## monitoring Client OS process
def montoringClientOsInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## monitoring Client OS Version process
def montoringClientOsVersionInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## monitoring Send Type process
def montoringSendTypeInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## monitoring Encrypt process
def montoringEncryptInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## monitoring Service Response Http Status Code process
def montoringServiceResponseHttpStatusCodeInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## monitoringService Response Http Code Service Protocol process
def montoringServiceProtocolInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

##############################################################################################
## LOG PROCESS
##############################################################################################

## log search list process
def logSearchList(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## log info process
def logInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)


##############################################################################################
## SERVICE PROCESS
##############################################################################################

## service search list process
def serviceSearchList(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## service info process
def serviceInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## service save process
def serviceSave(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## service delete process
def serviceDelete(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

##############################################################################################
## ADMIN PROCESS
##############################################################################################

## admin search list process
def adminSearchList(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## admin info process
def adminInfo(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## admin save process
def adminSave(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)

## admin delete process
def adminDelete(request):
    #TO-DO
    response_data = {}
    
    return JsonResponse(response_data)
