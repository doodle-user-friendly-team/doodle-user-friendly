from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
# Create your views here. 

class TimeSlotView(APIView):

    serializer_class = TimeSlotSerializer

    def get(self, request):
        ts = [ {"id": timeslot.id,"start_time": timeslot.start_time, "end_time": timeslot.end_date}
                   for timeslot in TimeSlot.objects.all()]
        return Response(ts)

    def post(self, request):

        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data) 

class TimeSlotVotatedView(APIView):

    serializer_class = RecapVoteSerializer

    def post(self, request):

        try:
            # input: user, meeting da frontend
            user_id = request.data.get('user')
            meeting_id = request.data.get('meeting')
        except:
            return Response({'message': 'Input non valido'}, status=400)
        
        try:
            # controllo che l'utente e la riunione esistano
            user = UserFake.objects.get(id=user_id)
            meeting = Meeting.objects.get(id=meeting_id)

            print("Controllo utente e riunione esistenti")

            # ottieni tutti i voti dell'utente per i timeslot associati alla riunione
            votes = Vote.objects.filter(user=user_id, time_slot__schedule_pool__meeting_id=meeting_id)

            serializer = RecapVoteSerializer(votes, many=True)
            print(serializer.data)
            return Response(serializer.data,status=200)
        
        except (UserFake.DoesNotExist, Meeting.DoesNotExist):
            return Response({'message': 'User o meeting non trovato'}, status=404)

    
