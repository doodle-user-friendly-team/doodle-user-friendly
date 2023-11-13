from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.utils.crypto import get_random_string

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

@api_view(['POST'])
def api_meetings_create(request):
    data = request.data
    data["creation_date"] = now()
    data["passcode"] = get_random_string(5, allowed_chars=ascii_uppercase + digits)
    serializer = MeetingSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def api_meetings_edit(request, meeting_id, meeting=None):
    pass
        
@api_view(['POST'])
def api_meetings_delete(request, meeting_id, meeting=None):
    pass
