from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
# Create your views here. 

class TimeSlotView(APIView):

    serializer_class = TimeSlotSerializer

    def get(self, request):
        ts = [ {"id": timeslot.id,"start_time": timeslot.start_time, "end_time": timeslot.end_time}
                   for timeslot in TimeSlot.objects.all()]
        return Response(ts)

    def post(self, request):

        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data) 
class UpdateTimeSlotView(APIView):

    def get(self, request, pk, format=None):
        try:
            timeslot = TimeSlot.objects.get(pk=pk)
            serializer = TimeSlotSerializer(timeslot)
            return Response(serializer.data)
        except TimeSlot.DoesNotExist:
            return Response({'detail': 'Time slot non trovato'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        try:
            timeslot = TimeSlot.objects.get(pk=pk)
            serializer = TimeSlotSerializer(timeslot, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TimeSlot.DoesNotExist:
            return Response({'detail': 'Time slot non trovato'}, status=status.HTTP_404_NOT_FOUND)
