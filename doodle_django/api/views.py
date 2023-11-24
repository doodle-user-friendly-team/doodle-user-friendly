from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from string import ascii_uppercase, digits
from . serializers import *
from . exceptions import *


@api_view(['GET', 'POST'])
def api_meetings(request):
    if request.method == 'POST' or not request.GET:
        meetings = Meeting.objects.all()
        timeslots = TimeSlot.objects.filter(schedule_pool_id__meeting_id__in=meetings.values_list("id", flat=True))
        for meeting in meetings:
            meeting.timeslots = timeslots.filter(schedule_pool_id__meeting_id=meeting.pk)
        return Response(MeetingTimeSlotSerializer(meetings, many=True).data, status=status.HTTP_200_OK)
    else:
        if 'title' in request.GET:
            meetings = Meeting.objects.filter(title__icontains=request.GET["title"]).order_by("title")
            timeslots = TimeSlot.objects.filter(schedule_pool_id__meeting_id__in=meetings.values_list("id", flat=True))
            for meeting in meetings:
                meeting.timeslots = timeslots.filter(schedule_pool_id__meeting_id=meeting.pk)
            return Response(MeetingTimeSlotSerializer(meetings, many=True).data, status=status.HTTP_200_OK)

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

@api_view(['POST', 'PUT'])
def api_meeting_book(request, meeting_id):
    try:
        meeting = get_object_or_404(Meeting, pk=meeting_id)

        serializer = MeetingSerializer(meeting, data={'final_date': request.data.get('final_date')}, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Meeting.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_meetings_create(request):
    data = request.data
    timeslots = data.pop("timeslots", [])
    meeting = None

    if len(timeslots) == 0:
        raise MissingDataException(detail={"Failure": "error", "TimeSlots": "required field not provided"}, status_code=status.HTTP_400_BAD_REQUEST)

    data["passcode"] = get_random_string(5, allowed_chars=ascii_uppercase + digits)
    meeting_serializer = MeetingSerializer(data=data)

    if not meeting_serializer.is_valid():
        return Response(status=status.HTTP_400_BAD_REQUEST, data=meeting_serializer.errors)
    
    meeting = Meeting(**meeting_serializer.validated_data)

    timeslot_serializer = TimeSlotSerializer(data=timeslots, many=True)

    if not timeslot_serializer.is_valid():
        return Response(status=status.HTTP_400_BAD_REQUEST, data=timeslot_serializer.errors)
    
    meeting.save()  #persist

    schedule_pool = SchedulePool.objects.create( #persist
        meeting=meeting,
        voting_start_date=meeting.creation_date,
        voting_deadline=meeting.deadline            
    )

    timeslots_data = timeslot_serializer.data
    for ts_data in timeslots_data:
        ts_data["schedule_pool_id"] = schedule_pool


    timeslots = TimeSlot.objects.bulk_create( #persist
        map(lambda item: TimeSlot(**item), timeslots_data)
    ) 

    meeting.timeslots = timeslots
    return Response(status=status.HTTP_201_CREATED, data=MeetingTimeSlotSerializer(meeting).data)
    

@api_view(['GET', 'POST', 'PUT'])
def api_meetings_edit(request, meeting_id, meeting=None):
    if request.method == 'GET':
        print("ID ", meeting_id)
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        timeslots = TimeSlot.objects.filter(schedule_pool_id__meeting_id=meeting.pk)
        meeting.timeslots = timeslots
        return Response(MeetingTimeSlotSerializer(meeting).data, status=status.HTTP_200_OK)
    elif request.method == 'PUT' or request.method == 'POST':
        meeting = get_object_or_404(Meeting, pk=meeting_id)
        serializer = MeetingSerializer(meeting, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


@api_view(['DELETE', 'POST'])
def api_meetings_delete(request, meeting_id):
    meeting = get_object_or_404(Meeting, pk=meeting_id)
    meeting.delete()
    return JsonResponse({'message': 'Meeting deleted successfully'}, status=204)

