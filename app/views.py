# app/views.py
from django.shortcuts import render
from django.http import JsonResponse
from .forms import RegistrationForm
import requests
import json

def landing_page(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            try:
                # Dados simplificados diretamente no body
                webhook_data = {
                    "name": form.cleaned_data['name'],
                    "whatsapp": form.cleaned_data['phone'],
                    "email": form.cleaned_data['email']
                }

                webhook_url = 'https://n8n.texts.com.br/webhook/mataia'
                headers = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }

                response = requests.post(
                    webhook_url,
                    data=json.dumps(webhook_data),
                    headers=headers,
                    timeout=10
                )
                
                print(f"Dados enviados: {webhook_data}")  # Debug
                print(f"Status: {response.status_code}")   # Debug

                if response.status_code in [200, 201]:
                    registration = form.save()
                    return JsonResponse({
                        'success': True,
                        'message': 'Dados enviados com sucesso!'
                    })
                else:
                    return JsonResponse({
                        'success': False,
                        'message': 'Erro ao processar sua solicitação. Por favor, tente novamente.'
                    }, status=500)

            except requests.exceptions.RequestException as e:
                print(f"Erro no webhook: {str(e)}")
                return JsonResponse({
                    'success': False,
                    'message': 'Erro de conexão. Por favor, tente novamente.'
                }, status=500)
            
            except Exception as e:
                print(f"Erro inesperado: {str(e)}")
                return JsonResponse({
                    'success': False,
                    'message': 'Erro inesperado. Por favor, tente novamente.'
                }, status=500)
        else:
            print(f"Erros de validação: {form.errors}")
            return JsonResponse({
                'success': False,
                'message': 'Por favor, verifique os dados informados.',
                'errors': form.errors
            }, status=400)
    else:
        form = RegistrationForm()
    
    return render(request, 'app/index.html', {'form': form})