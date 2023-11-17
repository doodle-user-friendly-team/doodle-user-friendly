
# Register your models here.
from django.contrib import admin
from .models import Meeting

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'location', 'video_conferencing', 'duration', 'date_and_time', 'deadline')
    search_fields = ('title', 'description')
