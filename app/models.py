# app/models.py
from django.db import models

class Registration(models.Model):  # Mudamos de Fan para Registration
    name = models.CharField(max_length=100, verbose_name='Nome')
    phone = models.CharField(max_length=20, verbose_name='WhatsApp')
    email = models.EmailField(unique=True, verbose_name='E-mail')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de Cadastro')

    class Meta:
        verbose_name = 'Cadastro'
        verbose_name_plural = 'Cadastros'
        ordering = ['-created_at']  # Ordena do mais recente para o mais antigo

    def __str__(self):
        return f"{self.name} - {self.email}"