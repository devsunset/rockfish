"""rockfish_console_python URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from . import views

urlpatterns = [
   url(r'^$', views.index),
   url(r'^index.html', views.index),
   url(r'^admin.html', views.admin),
   url(r'^admin_modal.html', views.admin_modal),
   url(r'^dashboard.html', views.dashboard),
   url(r'^log.html', views.log),
   url(r'^log_modal.html', views.log_modal),
   url(r'^montoring.html', views.montoring),
   url(r'^service.html', views.service),
   url(r'^service_modal.html', views.service_modal),
   url(r'^setting.html', views.setting),
   url(r'^user.html', views.user),
   url(r'^user_modal.html', views.user_modal),
   url(r'^console/sessionCheck', views.sessionCheck),
   url(r'^console/login', views.login),
   url(r'^console/logout', views.logout),
]