from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *


# Create your views here.

class TimeSlotView(APIView):
    serializer_class = TimeSlotSerializer

    def get(self, request):
        ts = [{"id": timeslot.id, "start_time": timeslot.start_time, "end_time": timeslot.end_date}
              for timeslot in TimeSlot.objects.all()]
        return Response(ts)

    def post(self, request):
        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class VoteView(APIView):

    def get(self, request, time_slot_id):
        print(time_slot_id)

        specified_time_slot = TimeSlot.objects.get(id=time_slot_id)
        votes = Vote.objects.filter(time_slot=specified_time_slot)
        print(len(votes))
        serializer_result = DetailedVoteSerializer(votes, many=True)
        return Response(serializer_result.data)

    def post(self, request):
        serializer = CreateVoteSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
