from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
from django.shortcuts import get_object_or_404

#per l'autenticazione
from django.contrib.auth import authenticate, login
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from datetime import datetime, timedelta


class FormatError(Exception):
    pass

class TimeError(Exception):
    pass

class TimeLessThanNowError(Exception):
    pass

class TimeSlotView(APIView):

    serializer_class = TimeSlotSerializer

    def get(self, request):
        day = request.data['day']
        month = request.data['month']
        year = request.data['year']
        start_time = f"{int(year):04d}-{int(month) + 1:02d}-{int(day) :02d}T23:59:59Z"
        end_time =  f"{int(year):04d}-{int(month) + 1:02d}-{(int(day)):02d}T00:00:00Z"
        
        try:
            start_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%SZ") - timedelta(days=1)
            end_time = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%SZ")
        except:
            raise FormatError

        ts = [ {"id": timeslot.id,"start_time": timeslot.start_time, "end_time": timeslot.end_time}
                   for timeslot in TimeSlot.objects.raw(f'SELECT * FROM doodle_timeslot WHERE start_time between "{start_time}" and  "{end_time}"')]
        
        return Response(ts)

    def post(self, request):
        print(request.data)
        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data) 
