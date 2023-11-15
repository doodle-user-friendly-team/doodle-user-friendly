from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
# Create your views here. 

class TimeSlotView(APIView):

    serializer_class = TimeSlotSerializer

    def get(self, request):
        ts = [ {"id": timeslot.id,"start_time": timeslot.start_time, "end_date": timeslot.end_date}
                   for timeslot in TimeSlot.objects.all()]
        return Response(ts)

    def post(self, request):

        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data) 
