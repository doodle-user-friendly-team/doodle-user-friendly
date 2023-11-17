# myapp/views.py
from django.shortcuts import render, get_object_or_404, redirect
from .models import Meeting
from .forms import MeetingForm
from django.utils import timezone

# def modify_meeting(request, meeting_id):
#     meeting = get_object_or_404(Meeting, pk=meeting_id)

#     if request.method == 'POST':
#         form = MeetingForm(request.POST, instance=meeting)
#         if form.is_valid():
#             # Check if the entered date and time are in the future
#             date_and_time = form.cleaned_data.get('date_and_time')
#             if date_and_time < timezone.now():
#                 form.add_error('date_and_time', 'Meeting date and time must be in the future.')
#             else:
#                 form.save()
#                 return redirect('meetings', meeting_id=meeting_id)
#     else:
#         form = MeetingForm(instance=meeting)

#     return render(request, 'modify_meeting.html', {'form': form, 'meeting': meeting})



def meeting_detail(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    return render(request, 'meeting_detail.html', {'meeting': meeting})

# myapp/views.py


def delete_meeting(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)

    if request.method == 'POST':
        meeting.delete()
        return redirect('meetings')
    else:
        return render(request, 'delete_meeting.html', {'meeting': meeting})
