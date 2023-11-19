from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
# Create your views here. 

class TimeSlotView(APIView):

    serializer_class = TimeSlotSerializer

    def get(self, request):
        day = request.GET.get('day', '01')
        month = request.GET.get('month', '01')
        year = request.GET.get('year', '1900')
        start_time = f"{int(year):04d}-{int(month) + 1:02d}-{int(day) - 1 :02d}T23:59:59Z"
        end_time =  f"{int(year):04d}-{int(month) + 1:02d}-{(int(day)):02d}T00:00:00Z"

        ts = [ {"id": timeslot.id,"start_time": timeslot.start_time, "end_time": timeslot.end_time}
                   for timeslot in TimeSlot.objects.raw(f'SELECT * FROM doodle_timeslot WHERE start_time between "{start_time}" and  "{end_time}"')]
        
        return Response(ts)

    def post(self, request):
        print(request.data)
        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data) 
