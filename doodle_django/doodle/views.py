from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
from django.shortcuts import get_object_or_404
from rest_framework import status

# Create your views here. 

class TimeSlotView(APIView):

    serializer_class = TimeSlotSerializer

    def get(self, request):
        ts = [ {"id": timeslot.id,"start_time": timeslot.start_time,  "schedul_pool_id" : timeslot.schedule_pool.id  , "end_time": timeslot.end_time, "user" : timeslot.user.id}
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
            print('Data received:', request.data)
            serializer = TimeSlotSerializer(timeslot)
            return Response(serializer.data)
        except TimeSlot.DoesNotExist:
            return Response({'detail': 'Time slot non trovato'}, status=status.HTTP_404_NOT_FOUND)


    def put(self, request, pk, format=None):
        try:
            timeslot = TimeSlot.objects.get(pk=pk)
            print('Data received:', request.data)
            serializer = TimeSlotSerializer(timeslot, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print('Serializer errors:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TimeSlot.DoesNotExist:
            return Response({'detail': 'Time slot non trovato'}, status=status.HTTP_404_NOT_FOUND)

        
        
class CheckUser(APIView):
    
    def login_view(request):
        request.session['email'] = UserFake.email
        print(UserFake.email)
        return Response({'message': 'Login successful'})


class UserByIdView(APIView):
    
    def get(self, request, user_id):
        user = get_object_or_404(UserFake, id = user_id)
        
        serializer = UserFakeSerializer(user)
       
        return Response(serializer.data)
     
        