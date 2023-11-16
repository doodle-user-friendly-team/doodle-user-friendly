from django.shortcuts import render, get_object_or_404, redirect
from .models import Meeting
from .forms import MeetingForm

def meeting_list(request):
    meetings = Meeting.objects.all()
    return render(request, 'meeting_list.html', {'meetings': meetings})

def modify_meeting(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    
    if request.method == 'POST':
        form = MeetingForm(request.POST, instance=meeting)
        if form.is_valid():
            form.save()
            return redirect('meeting_list')
    else:
        form = MeetingForm(instance=meeting)

    return render(request, 'modify_meeting.html', {'form': form, 'meeting': meeting})
    # return redirect('meeting_list')
def delete_meeting(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    return render(request, 'confirm_delete_meeting.html', {'meeting': meeting})

def confirm_delete_meeting(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    
    if request.method == 'POST':
        # Perform deletion logic
        meeting.delete()
        return redirect('meeting_list')

    return render(request, 'confirm_delete_meeting.html', {'meeting': meeting})