from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404

from string import ascii_uppercase, digits

from . serializers import *


@api_view(['GET', 'POST'])
def api_meetings(request):
    if request.method == 'POST' or not request.GET:
        meetings = Meeting.objects.all()
        return Response(MeetingSerializer(instance=meetings, many=True).data, status=status.HTTP_200_OK)
    else:
        if 'title' in request.GET:
            meetings = Meeting.objects.filter(title__icontains=request.GET["title"]).order_by("title")
            return Response(MeetingSerializer(instance=meetings, many=True).data, status=status.HTTP_200_OK)

@api_view(['GET'])
def last_meeting(request):
    try:
        last_meeting = Meeting.objects.latest('pk')
        meeting = get_object_or_404(Meeting, pk=last_meeting.id)
        return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
    except Meeting.DoesNotExist:
        raise Http404("Meeting not found")

@api_view(['GET'])
def api_meeting(request):
    if(request.GET):
        try:
            meeting = get_object_or_404(Meeting, pk=request.GET["id"])
            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            raise Http404("Meeting not found")

@api_view(['POST'])
def api_meeting_book(request, meeting_id):
    try:
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        
        if "final_date" in request.data:
            time_slot_id = request.data["final_date"]
            
            time_slot, created = TimeSlot.objects.get_or_create(pk=time_slot_id)

            meeting.final_date = time_slot
            meeting.save()

            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "final_date is required in the request data"})
    except Meeting.DoesNotExist:
        raise Http404("Meeting not found")

@api_view(['POST'])
def api_meetings_create(request):
    data = request.data
    timeslots = data.pop("timeslots", None)
    timeslots_data = None
    if timeslots:
        timeslot_serializer = TimeSlotSerializer(timeslots, many=True)
        if timeslot_serializer.is_valid():
            timeslots_data = timeslot_serializer.data
    
    data["creation_date"] = now()
    data["passcode"] = get_random_string(5, allowed_chars=ascii_uppercase + digits)
    meeting_serializer = MeetingSerializer(data=data)

    if meeting_serializer.is_valid():
        meeting_serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST, data=meeting_serializer.errors)

@api_view(['GET', 'POST'])
def api_meetings_edit(request, meeting_id, meeting=None):
    '''
        Get single meeting (No editing)
    '''
    if request.method == 'GET':
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def api_meetings_delete(request, meeting_id, meeting=None):
    pass
