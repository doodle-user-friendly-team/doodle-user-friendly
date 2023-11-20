from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
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

        start_time = None
        end_time = None

        try:
            start_time = datetime.strptime(request.data['start_time'], "%Y-%m-%dT%H:%M:%SZ")
            end_time = datetime.strptime(request.data['end_time'], "%Y-%m-%dT%H:%M:%SZ")
        except:
            raise FormatError

        if start_time > end_time:
            # Response({'detail': 'start_time deve essere minore di end_time'}, status=status.HTTP_400_BAD_REQUEST)
            raise TimeError

        if start_time == end_time:
            #return Response({'detail': 'start_time deve essere diverso da end_time'}, status=status.HTTP_400_BAD_REQUEST)
            raise TimeError

        if start_time < datetime.now():
            #return Response({'detail': 'start_time deve essere maggiore di adesso'}, status=status.HTTP_400_BAD_REQUEST)
            raise TimeLessThanNowError

        if end_time < datetime.now():
            #return Response({'detail': 'end_time deve essere maggiore di adesso'}, status=status.HTTP_400_BAD_REQUEST)
            raise TimeLessThanNowError


        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class GetUserByIdView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(UserFake, id=user_id)
        serializer = UserFakeSerializer(user)
        return Response(serializer.data)



class UserAuthenticationView(APIView):
    serializer_class = UserFakeSerializer

    @permission_classes([AllowAny])
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data['email']
            name = serializer.validated_data['name']
            surname = serializer.validated_data['surname']

            try:
                user = UserFake.objects.get(email=email, name=name, surname=surname)
            except UserFake.DoesNotExist:
                user = None

            if user is not None:
                return Response({'message': 'User authenticated successfully'})
            else:
                return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



class UserRegistrationView(APIView):
    serializer_class = UserFakeSerializer

    def post(self, request, *args, **kwargs):
        # Chiamiamo il metodo create del serializer per gestire la creazione dell'utente
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Ritorniamo una risposta di successo con i dati dell'utente appena creato
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

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
                print("->"+str(voto_id))
                voto = Vote.objects.get(id=voto_id, user=user_id)
                timeslot = TimeSlot.objects.get(id=timeslot_id)

                # Esegui l'operazione di aggiornamento nel database
                voto.preference = preference
                voto.save()
                return Response({'message': 'Preferenza aggiornata con successo'})
            except (Vote.DoesNotExist, TimeSlot.DoesNotExist):
                return Response({'message': 'Voto o time slot non trovato'}, status=404)


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


