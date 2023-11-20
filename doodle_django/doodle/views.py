from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
from django.db.models import Count, Case, When, IntegerField
from django.shortcuts import get_object_or_404


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

            # ottieni tutti i voti dell'utente per i timeslot associati alla riunione
            votes = Vote.objects.filter(user=user_id, time_slot__schedule_pool__meeting_id=meeting_id)

            serializer = RecapVoteSerializer(votes, many=True)
            print(serializer.data)
            return Response(serializer.data,status=200)
        
        except (UserFake.DoesNotExist, Meeting.DoesNotExist):
            return Response({'message': 'User o meeting non trovato'}, status=404)



class TopThreeView(APIView):

    serializer_class = RecapVoteSerializer

    def get(self, request, meeting_id):
    
        # controllo che la riunione esista
        meeting = get_object_or_404(Meeting,id=meeting_id)

        time_slots = TimeSlot.objects.filter(schedule_pool__meeting=meeting)


        results = []
        for time_slot in time_slots:
            # Ottieni il numero di voti per ogni preferenza
            preferences_count = Vote.objects.filter(time_slot=time_slot).values('preference').annotate(count=Count('preference'))

            # Inizializza il dizionario delle preferenze
            preferences = {
                'Available': 0,
                'Unavailable': 0,
                'Maybe available': 0
            }

            # Aggiungi le preferenze al dizionario
            for entry in preferences_count:
                preferences[entry['preference']] = entry['count']

            score = preferences['Available'] * 2 + preferences['Maybe available']

            # Crea un dizionario con i risultati
            result_entry = {
                'time_slot_id': time_slot.id,
                'start_time': time_slot.start_time,
                'end_time': time_slot.end_time,
                'available': preferences['Available'],
                'maybe_available': preferences['Maybe available'],
                'unavailable': preferences['Unavailable'],
                'score': score
            }
            # Aggiungi il dizionario dei risultati alla lista dei risultati
            results.append(result_entry)

        # Ordina i risultati in base al punteggio in ordine decrescente
        sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)

        # Seleziona i primi 3 risultati (top 3)
        top_three_results = sorted_results[:3]

        #print(top_three_results)

        # Serializza i risultati usando il TopThreeSerializer
        serializer = TopThreeSerializer(top_three_results, many=True)

        # Restituisci la risposta JSON con i dati serializzati
        return Response(serializer.data, status=200)
    

        
        
        


    
