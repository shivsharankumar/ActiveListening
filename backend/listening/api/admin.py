from django.contrib import admin

# Register your models here.
from .models import ListeningLevel

class ListeningLevelAdmin(admin.ModelAdmin):
    search_fields =("user","date",)
    # list_display = ("user", "date") 

admin.site.register(ListeningLevel,ListeningLevelAdmin)