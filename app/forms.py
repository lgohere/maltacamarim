# app/forms.py
from django import forms
from .models import Registration

class RegistrationForm(forms.ModelForm):
    class Meta:
        model = Registration
        fields = ['name', 'phone', 'email']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'modern-input', 'placeholder': 'Seu nome'}),
            'phone': forms.TextInput(attrs={'class': 'modern-input', 'placeholder': 'Seu WhatsApp'}),
            'email': forms.EmailInput(attrs={'class': 'modern-input', 'placeholder': 'Seu e-mail'})
        }