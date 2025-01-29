# malta_lp/urls.py
from django.contrib import admin
from django.urls import path
from app.views import landing_page

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', landing_page, name='home'),
    path('success/', landing_page, name='success'),  # Mantemos esta URL para compatibilidade
]