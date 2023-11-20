from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
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
        end_time = f"{int(year):04d}-{int(month) + 1:02d}-{(int(day)):02d}T00:00:00Z"

        ts = [{"id": timeslot.id, "start_time": timeslot.start_time, "end_time": timeslot.end_time}
              for timeslot in TimeSlot.objects.raw(
                f'SELECT * FROM doodle_timeslot WHERE start_time between "{start_time}" and  "{end_time}"')]

        return Response(ts)

    def post(self, request):
        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class VotesView(APIView):

    serializers_class = VoteSerializer

    def get(self, request):
        votes = Vote.objects.all()
        serializer_result = VoteSerializer(votes, many=True)
        return Response(serializer_result.data)

    def post(self, request):
        serializer = VoteSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
class ModifyMyPreferenceView(APIView):
    
        serializer_class = VoteSerializer
        
        #@permission_classes([IsAuthenticated])
        #@authentication_classes([SessionAuthentication, BasicAuthentication])
        def put(self, request):
            
            #todo: sistemare con serializer
    
            serializer = VoteSerializer(data=request.data)
            #print(request.data)
            #print(serializer)
            
            voto_id = request.data.get('id')
            preference = request.data.get('preference')
            user_id = request.data.get('user')
            timeslot_id = request.data.get('time_slot')

            try:
                # Verifica se esiste il voto e il time slot
                #print("->"+str(voto_id))
                voto = Vote.objects.get(id=voto_id, user=user_id)
                timeslot = TimeSlot.objects.get(id=timeslot_id)

                # Esegui l'operazione di aggiornamento nel database
                voto.preference = preference
                voto.save()
                return Response({'message': 'Preferenza aggiornata con successo'})
            except (Vote.DoesNotExist, TimeSlot.DoesNotExist):
                return Response({'message': 'Voto o time slot non trovato'}, status=400)


@csrf_exempt
@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_preferences(request, time_slot_id):
    specified_time_slot = TimeSlot.objects.get(id=time_slot_id)
    votes = Vote.objects.filter(time_slot=specified_time_slot)
    print(votes)
    serializer_result = DetailedVoteSerializer(votes, many=True)
    return Response(serializer_result.data)


@csrf_exempt
@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_timeslot(request, time_slot_id):
    specified_time_slot = TimeSlot.objects.get(id=time_slot_id)
    serializer_result = TimeSlotSerializer(specified_time_slot)
    return Response(serializer_result.data)


