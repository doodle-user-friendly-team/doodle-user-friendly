# myapp/forms.py

from django import forms
from django.utils import timezone
from .models import Meeting

class MeetingForm(forms.ModelForm):
    class Meta:
        model = Meeting
        fields = ['title', 'description', 'location', 'video_conferencing', 'duration', 'date_and_time', 'deadline']

   
