from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404

from string import ascii_uppercase, digits
from django.http import JsonResponse
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
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def api_meeting(request):
    if(request.GET):
        try:
            meeting = get_object_or_404(Meeting, pk=request.GET["id"])
            return Response(MeetingSerializer(meeting).data, status=status.HTTP_200_OK)
        except Meeting.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)

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
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_meetings_create(request):
    data = request.data
    timeslots = data.pop("timeslots", [])
    meeting = None

    data["creation_date"] = now()
    data["passcode"] = get_random_string(5, allowed_chars=ascii_uppercase + digits)
    meeting_serializer = MeetingSerializer(data=data)

    if meeting_serializer.is_valid():
        meeting = meeting_serializer.save()

        schedule_pool = SchedulePool.objects.create(
            meeting=meeting,
            voting_start_date=meeting.creation_date,
            voting_deadline=meeting.deadline            
        )

        for timeslot in timeslots:
            timeslot["schedule_pool_id"] = schedule_pool.id
        timeslot_serializer = TimeSlotSerializer(data=timeslots, many=True)
        if timeslot_serializer.is_valid():
            timeslots = timeslot_serializer.save()

        meeting_data = meeting_serializer.data
        meeting_data["timeslots"] = timeslot_serializer.data
        
        return Response(status=status.HTTP_201_CREATED, data=meeting_data)
    return Response(status=status.HTTP_400_BAD_REQUEST, data=meeting_serializer.errors)

    
@api_view(['PUT'])
def api_meetings_edit(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    serializer = MeetingSerializer(meeting, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def api_meetings_delete(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    meeting.delete()
    return JsonResponse({'message': 'Meeting deleted successfully'}, status=204)

