from django import forms
from django.utils import timezone
from .models import Meeting

class MeetingForm(forms.ModelForm):
    class Meta:
        model = Meeting
        fields = ['title', 'description', 'location', 'video_conferencing', 'duration', 'date_time', 'dead_line']

    def clean(self):
        cleaned_data = super().clean()

        # No need to manually check for required fields, Django's ModelForm does it automatically.

        return cleaned_data
    
    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
        
    #     # Disable meeting time if it's in the past
    #     meeting_time = self.instance.date_time if self.instance and self.instance.date_time else timezone.now()
    #     if meeting_time < timezone.now():
    #         self.fields['date_time'].widget.attrs['disabled'] = True
    #         self.fields['dead_line'].widget.attrs['disabled'] = True
    #         self.fields['duration'].widget.attrs['disabled'] = True

    #     # # Disable deadline if it's in the past
    #     # deadline = self.instance.dead_line if self.instance and self.instance.dead_line else timezone.now()
    #     # if deadline < timezone.now():
    #     #     self.fields['dead_line'].widget.attrs['disabled'] = True
    # def clean_date_time(self):
    #     date_time = self.cleaned_data['date_time']
    #     if date_time < timezone.now():
    #         raise forms.ValidationError('Meeting time cannot be in the past.')
    #     return date_time
    
    # def clean_dead_line(self):
    #     deadline = self.cleaned_data['dead_line']
    #     if deadline < timezone.now():
    #         raise forms.ValidationError('Meeting deadline cannot be in the past.')
    #     return deadline
    
    # def clean_duration(self):
    #     duration = self.cleaned_data['duration']
    #     if duration <= 0:
    #         raise forms.ValidationError('Duration must be a positive integer.')
    #     return duration