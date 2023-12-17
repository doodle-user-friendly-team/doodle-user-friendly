from urllib import response
from django.shortcuts import render
from django.utils import timezone
from django.utils.timezone import get_current_timezone
from django.contrib.auth.models import BaseUserManager, AbstractUser
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from .utils import *
from django.db.models import Count


from rest_framework.permissions import IsAuthenticated

import requests

from django.db.models import Q
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

# per l'autenticazione
from django.contrib.auth import authenticate, login
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from datetime import datetime, timedelta

from rest_framework.generics import CreateAPIView

from rest_framework import viewsets

class FormatError(Exception):
    pass


class TimeError(Exception):
    pass


class TimeLessThanNowError(Exception):
    pass


class MeetingDetailView(APIView):
    serializer_class = MeetingSerializer

    def get(self, request, link):
        meeting = Meeting.objects.get(organizer_link=link)
        serializer = CompleteMeetingSerializer(meeting)
        return Response(serializer.data)

    def put(self, request, link):
        meeting = Meeting.objects.get(organizer_link=link)
        serializer = MeetingSerializer(meeting, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    def delete(self, request, link):
        meeting = Meeting.objects.get(organizer_link=link)
        meeting.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeetingTimeSlotsView(APIView):
    serializer_class = TimeSlotSerializer

    def get(self, request, link):
        meeting = Meeting.objects.get(organizer_link=link)
        schedule_pool = SchedulePool.objects.get(meeting=meeting)
        time_slots = TimeSlot.objects.filter(schedule_pool=schedule_pool)
        serializer_result = DetailedTimeSlotSerializer(time_slots, many=True)
        return Response(serializer_result.data)


class MeetingView(APIView):
    
    def get(self, request, user_id):
        user = UserFake.objects.get(id=user_id)
        meetings = Meeting.objects.filter(user=user)
        print(len(meetings))
        serializer_result = MeetingSerializer(meetings, many=True)
        return Response(serializer_result.data)
    

    def post(self, request, user_id):
        if not UserFake.objects.filter(email=request.data['organizer_email']).exists():
            user = UserFake.objects.create(name=request.data['organizer_name'],
                                           surname=request.data['organizer_surname'],
                                           email=request.data['organizer_email'])
        user = UserFake.objects.filter(email=request.data['organizer_email'])

        link = genera_codice_recap()
        Meeting.objects.create(name=request.data['name'], description=request.data['description'],
                               location=request.data['location'], duration=request.data['duration'],
                               period_start_date=request.data['period_start_date'],
                               period_end_date=request.data['period_end_date'], organizer_link=link, user=user[0])
        meeting = Meeting.objects.get(organizer_link=link)
        serializer = MeetingSerializer(meeting)
        schedule_pool = SchedulePool.objects.create(voting_start_date=datetime.now().date(),
                                                    voting_deadline=datetime.strptime(
                                                        request.data['period_start_date'],
                                                        '%Y-%m-%d').date() - timedelta(days=2),
                                                    pool_link=genera_codice_invito(), meeting=meeting)

        send_meeting_creation_email(meeting)
        return Response(serializer.data)


class TopTimeSlotsView(APIView):
    serializer_class = TopTimeSlotSerializer


    def get(self, request, link):
        try:
            # Ottieni i time slot del schedule pool con il link specificato
            schedule_pool = SchedulePool.objects.get(pool_link=link)
            time_slots = TimeSlot.objects.filter(schedule_pool=schedule_pool.id)

            results = []
            max_score = 0

            # Trova il punteggio massimo
            for time_slot in time_slots:
                preferences_count = Vote.objects.filter(time_slot=time_slot).values('preference').annotate(count=Count('preference'))

                preferences = {
                    'Available': 0,
                    'Unavailable': 0,
                    'Maybe available': 0
                }

                for entry in preferences_count:
                    preferences[entry['preference']] = entry['count']

                score = preferences['Available'] * 2 + preferences['Maybe available']

                if score > max_score:
                    max_score = score

            # Raccogli tutti i time slot con il punteggio massimo
            for time_slot in time_slots:
                preferences_count = Vote.objects.filter(time_slot=time_slot).values('preference').annotate(count=Count('preference'))

                preferences = {
                    'Available': 0,
                    'Unavailable': 0,
                    'Maybe available': 0
                }

                for entry in preferences_count:
                    preferences[entry['preference']] = entry['count']

                score = preferences['Available'] * 2 + preferences['Maybe available']

                if score == max_score:
                    result_entry = {
                        'id': time_slot.id,
                        'start_time': time_slot.start_time,
                        'end_time': time_slot.end_time,
                        'user': {
                            'name': time_slot.user.name,
                            'surname': time_slot.user.surname
                        },
                        'count_available': preferences['Available'],
                        'count_unavailable': preferences['Unavailable'],
                        'count_maybe': preferences['Maybe available'],
                        'score': score
                    }
                    results.append(result_entry)

            # Serializza i risultati
            serializer = self.serializer_class(results, many=True)

            # Restituisci la risposta JSON con i dati serializzati
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SchedulePool.DoesNotExist:
            return Response({'error': 'Schedule not found'}, status=status.HTTP_404_NOT_FOUND)
        

class SchedulePoolView(APIView):
    serializer_class = SchedulePoolSerializer
    queryset = SchedulePool.objects.all()

    def get(self, request, link):
        schedule_pool = SchedulePool.objects.filter(pool_link=link)
        serializer_result = DetailedSchedulePoolSerializer(schedule_pool, many=True)
        return Response(serializer_result.data)
    
    # Patch per aggiornare la data finale
    def patch(self, request, link):
        schedule_pool = SchedulePool.objects.get(pool_link=link)
        # Estrae il campo 
        new_final_date = request.data.get('final_date')
        # Verifica che il campo sia presente nei dati della richiesta
        if new_final_date is not None:
            # Aggiorna solo il campo specificato
            schedule_pool.final_date = new_final_date
            schedule_pool.save()

            send_meeting_date_decision_email(schedule_pool)
            serializer = SchedulePoolSerializer(schedule_pool)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'error': 'Campo final_date errato'}, status=status.HTTP_400_BAD_REQUEST)

class AuthMeetingView(APIView):
    serializer_class = MeetingSerializer
    queryset = Meeting.objects.all()

    def get(self, request):
        meetings = Meeting.objects.all()
        serializer_result = MeetingSerializer(meetings, many=True)
        return Response(serializer_result.data)

    def post(self, request):
        meeting = Meeting.objects.create(name=request.data['name'], description=request.data['description'],
                                         location=request.data['location'], duration=request.data['duration'],
                                         period_start_date=request.data['period_start_date'],
                                         period_end_date=request.data['period_end_date'],
                                         organizer_link=genera_codice_recap(),
                                         user=UserFake.objects.get(id=request.data['user']))
        serializer = MeetingSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            schedule_pool = SchedulePool.objects.create(voting_start_date=datetime.now().date(),
                                                        voting_deadline=datetime.strptime(
                                                            request.data['period_start_date'],
                                                            '%Y-%m-%d').date() - timedelta(days=2),
                                                        pool_link=genera_codice_invito(), meeting=meeting)
            return Response(serializer.data)


class TimeSlotView(viewsets.ViewSet):

    serializer_class = TimeSlotSerializer

    def get_all(self, request):
        timeslots = TimeSlot.objects.all()
        serializer_result = TimeSlotSerializer(timeslots, many=True)
        return Response(serializer_result.data)

    def get_data(self, request, _data):
        day, month, year = _data.split('_')

        start_time = f"{int(year):04d}-{int(month) + 1:02d}-{int(day) :02d}T23:59:59Z"
        end_time = f"{int(year):04d}-{int(month) + 1:02d}-{(int(day)):02d}T23:59:59Z"

        try:
            start_time = datetime.strptime(start_time, "%Y-%m-%dT%H:%M:%SZ") - timedelta(days=1)
            end_time = datetime.strptime(end_time, "%Y-%m-%dT%H:%M:%SZ")
        except:
            raise FormatError

        ts = [ {"id": timeslot.id,"start_time": timeslot.start_time, "end_time": timeslot.end_time, "user": timeslot.user.id}
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
            # return Response({'detail': 'start_time deve essere diverso da end_time'}, status=status.HTTP_400_BAD_REQUEST)
            raise TimeError

        if start_time < datetime.now():
            # return Response({'detail': 'start_time deve essere maggiore di adesso'}, status=status.HTTP_400_BAD_REQUEST)
            raise TimeLessThanNowError

        if end_time < datetime.now():
            # return Response({'detail': 'end_time deve essere maggiore di adesso'}, status=status.HTTP_400_BAD_REQUEST)
            raise TimeLessThanNowError
        print(request.data)
        serializer = TimeSlotSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    def put(self, request, pk, format=None):
        try:
            timeslot = TimeSlot.objects.get(pk=pk)
            print('Data received:', request.data)

            # Usa request.data invece di updated_data
            serializer = TimeSlotSerializer(timeslot, data=request.data)

            # Verifica la validità del serializer
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                print('Serializer errors:', serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except TimeSlot.DoesNotExist:
            return Response({'detail': 'Time slot non trovato'}, status=status.HTTP_404_NOT_FOUND)
        except TimeSlot.DoesNotExist:
            return Response({'detail': 'Time slot non trovato'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Gestisci altre eccezioni
            print('Exception:', e)
            print('Response status code:', status.HTTP_500_INTERNAL_SERVER_ERROR)
            print('Response content:', response.content)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetUserByIdView(APIView):
    @permission_classes([AllowAny])
    def get(self, request):
        user_id = request.GET.get('id', '')
        user = get_object_or_404(UserFake, id=user_id)
        serializer = UserFakeSerializer(user)
        return Response(serializer.data)


class UserAuthenticationView(APIView):
    serializer_class = UserFakeSerializer

    @permission_classes([AllowAny])
    def get(self, request):
        # Estrai l'email dalla stringa di query
        email = request.GET.get('email', '')

        # Verifica se l'email è presente nel database
        try:
            user = UserFake.objects.get(email=email)
            return Response({'message': 'User authenticated successfully'})
        except UserFake.DoesNotExist:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserRegistrationView(CreateAPIView):
    serializer_class = UserFakeSerializer

    def post(self, request):
        # Chiamiamo il metodo create del serializer per gestire la creazione dell'utente
        print(request.data)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Ritorniamo una risposta di successo con i dati dell'utente appena creato
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



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
    if not TimeSlot.objects.filter(id=time_slot_id).exists():
        return Response([], status=200)
    specified_time_slot = TimeSlot.objects.get(id=time_slot_id)
    if not Vote.objects.filter(time_slot=specified_time_slot).exists():
        return Response([], status=200)
    votes = Vote.objects.filter(time_slot=specified_time_slot)
    serializer_result = DetailedVoteSerializer(votes, many=True)
    return Response(serializer_result.data)


@csrf_exempt
@api_view(('GET',))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def get_timeslot(request, time_slot_id):
    specified_time_slot = TimeSlot.objects.get(id=time_slot_id)
    serializer_result = DetailedTimeSlotSerializer(specified_time_slot)
    return Response(serializer_result.data)


@csrf_exempt
@api_view(('GET',))
def get_timeslot_from_schedule_pool(request, schedule_pool_id):
    print("Ciao")
    print(TimeSlot.objects.all())
    if TimeSlot.objects.filter(schedule_pool=schedule_pool_id).exists():
        specified_time_slot = TimeSlot.objects.get(schedule_pool=schedule_pool_id)
        serializer_result = DetailedTimeSlotSerializer(specified_time_slot)
        return Response(serializer_result.data)
    return Response([], status=200)

@csrf_exempt
@api_view(('GET',))
def get_schedule_pool(request, code_schedule_pool):
    specified_time_slot = SchedulePool.objects.get(pool_link=code_schedule_pool)
    serializer_result = SchedulePoolSerializer(data=specified_time_slot)
    if serializer_result.is_valid():
        print(serializer_result.data)
        return Response(serializer_result)
    return Response(serializer_result.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
@api_view(('GET',))
def get_schedule_pool_from_user_id(request, user_id):
    try:
        meetings_user = Meeting.objects.filter(user=user_id)
        schedule_pool = SchedulePool.objects.filter(pool_link=meetings_user[0].organizer_link)
        serializer_result = DetailedSchedulePoolSerializer(schedule_pool, many=True)
        return Response(serializer_result.data)
    except Meeting.DoesNotExist:
        return Response({"error": "Meeting not found for the given user ID"}, status=status.HTTP_404_NOT_FOUND)
    except SchedulePool.DoesNotExist:
        return Response({"error": "SchedulePool not found for the given user ID"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class djangoUsers(APIView):

    serializers_class = djangoUserSerializer
    
    def get(self, request):
        email = request.GET.get('email', '')
        password = request.GET.get('password', '')
        print("sono qua")
        UserModel = get_user_model()
    
        try:
            # below line gives query set,you can change the queryset as per your requirement
            user = UserModel.objects.filter(
                Q(username__iexact=email) |
                Q(email__iexact=email)
            ).distinct()
    
        except UserModel.DoesNotExist:
            return Response({'message': 'user not found (user model empty)'}, status=status.HTTP_401_UNAUTHORIZED)
    
        if user.exists():
            user_obj = user.first()
            if user_obj.check_password(password):
                login(request, user_obj, backend='django.contrib.auth.backends.ModelBackend')
                return Response(requests.post("http://localhost:8000/api/v1/auth/login/", data={'username': user_obj, 'password': password}))
            return Response({'message': 'wrong password'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({'message': 'user not found'}, status=status.HTTP_401_UNAUTHORIZED)

class PasswordChangeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print("Request received at PasswordChangeAPIView") 
        
        new_password1 = request.data.get('new_password1', '')
        new_password2 = request.data.get('new_password2', '')

        user = request.user

        user.set_password(new_password1)
        user.save()
        return Response({'detail': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        

@api_view(['POST'])
def send_link_by_email(request, meeting_id):
    if request.method == 'POST':
        try:
            # Ottieni i dati JSON dalla richiesta
            data = request.data
            emails = data.get('emails', [])

            print("L'id del meeting nella view è: ", meeting_id)
            print("Le email ottenute nella view sono: ", emails)

            send_meeting_invitation_email(emails, meeting_id)

            # Risposta di successo
            return Response({'message': 'Emails sent successfully'}, status=status.HTTP_200_OK)

        except Exception as e:
            # Gestisci eventuali eccezioni qui
            print("Error:", str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)