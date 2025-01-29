# app/admin.py
from django.contrib import admin
from .models import Registration

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'phone', 'email')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    # Campos que aparecerão na tela de edição
    fieldsets = (
        ('Informações Pessoais', {
            'fields': ('name', 'phone', 'email')
        }),
        ('Informações do Sistema', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    def has_delete_permission(self, request, obj=None):
        return True