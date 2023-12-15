from urllib import response

from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
from django.shortcuts import get_object_or_404
from rest_framework import status, generics
from .utils import *
from rest_framework import permissions

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


class MeetingView(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        link = self.request.query_params.get("link")
        userId = self.request.query_params.get("id")
        if link is not None:
            if not Meeting.objects.filter(organizer_link=link).exists():
                return None
            meeting = Meeting.objects.get(organizer_link=link)
            return meeting
        elif userId is not None:
            if not Meeting.objects.filter(user=userId).exists():
                return None
            meetings = Meeting.objects.filter(user=userId)
            return meetings
        return None
    
    def create(self, request):
        self.check_object_permissions(request, None)
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
        return Response(serializer.data)

    def update(self, request):
        print(request.data)
        self.check_object_permissions(request, None)
        link = request.data['link']
        meeting = Meeting.objects.get(organizer_link=link)
        serializer = MeetingSerializer(meeting, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
    def destroy(self, request):
        self.check_object_permissions(request, None)
        link = request.data['link']
        meeting = Meeting.objects.get(organizer_link=link)
        meeting.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class SchedulePoolView(viewsets.ModelViewSet):
    serializer_class = SchedulePoolSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        link = self.request.query_params.get("link")
        schedule_pool_id = self.request.query_params.get("schedule_pool_id")
        user_id = self.request.query_params.get("user_id")
        if schedule_pool_id is not None:
            if not SchedulePool.objects.filter(id=schedule_pool_id).exists():
                return Response([], status=200)
            specified_schedule_pool = SchedulePool.objects.get(id=schedule_pool_id)
            serializer_result = DetailedSchedulePoolSerializer(specified_schedule_pool)
            return Response(serializer_result.data)
        elif link is not None:
            if not SchedulePool.objects.filter(pool_link=link).exists():
                return Response([], status=200)
            schedule_pool = SchedulePool.objects.get(pool_link=link)
            serializer_result = DetailedSchedulePoolSerializer(schedule_pool, many=True)
            return Response(serializer_result.data)
        elif user_id is not None:
            if not SchedulePool.objects.filter(user=user_id).exists():
                return Response([], status=200)
            schedule_pool = SchedulePool.objects.filter(user=user_id)
            serializer_result = DetailedSchedulePoolSerializer(schedule_pool, many=True)
            return Response(serializer_result.data)

class TimeSlotView(viewsets.ModelViewSet):

    serializer_class = TimeSlotSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        time_slot_id = self.request.query_params.get("time_slot_id")
        _data = self.request.query_params.get("data")
        link = self.request.query_params.get("link")
        print(time_slot_id)
        if time_slot_id is not None:
            if not TimeSlot.objects.filter(id=time_slot_id).exists():
                return Response([], status=200)
            specified_time_slot = TimeSlot.objects.get(id=time_slot_id)
            serializer_result = DetailedTimeSlotSerializer(specified_time_slot)
            return Response(serializer_result.data)
        elif _data is not None:
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
        elif link is not None:
            meeting = Meeting.objects.get(organizer_link=link)
            schedule_pool = SchedulePool.objects.get(meeting=meeting)
            time_slots = TimeSlot.objects.filter(schedule_pool=schedule_pool)
            serializer_result = DetailedTimeSlotSerializer(time_slots, many=True)
            return Response(serializer_result.data)
        
        timeslots = TimeSlot.objects.all()
        serializer_result = TimeSlotSerializer(timeslots, many=True)
        return timeslots


    def create(self, request):

        self.check_object_permissions(request, None)

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

    def update(self, request):

        self.check_object_permissions(request, None)
        
        try:
            timeslot = TimeSlot.objects.get(pk=request.data['id'])
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


class AuthMeetingView(APIView):
    queryset = Meeting.objects.all()
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        meetings = Meeting.objects.all()
        serializer_result = MeetingSerializer(meetings, many=True)
        return Response(serializer_result.data)

    def post(self, request):
        self.check_object_permissions(request, None)
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

class VotesView(viewsets.ModelViewSet):
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        serializer = VoteSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        self.check_object_permissions(request, None)
        
        serializer = VoteSerializer(data=request.data)
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

    def get_queryset(self):
        time_slot_id = self.request.query_params.get("id")
        print(time_slot_id)
        if not TimeSlot.objects.filter(id=time_slot_id).exists():
            return Response(None, status=200)
        specified_time_slot = TimeSlot.objects.get(id=time_slot_id)
        if not Vote.objects.filter(time_slot=specified_time_slot).exists():
            return Response(None, status=200)
        votes = Vote.objects.filter(time_slot=specified_time_slot)
        serializer_result = DetailedVoteSerializer(votes, many=True)
        return Response(serializer_result.data)
    

class UserView(viewsets.ModelViewSet):
    serializers_class = UserFakeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user_id = self.request.query_params.get("id")
        if not UserFake.objects.filter(id=user_id).exists():
            return Response([], status=200)
        user = UserFake.objects.get(id=user_id)
        serializer_result = UserFakeSerializer(user)
        return Response(serializer_result.data)
    
    def get(self, request, user_id):
        user = get_object_or_404(UserFake, id = user_id)
        serializer = UserFakeSerializer(user)
        return Response(serializer.data) 

@csrf_exempt
@api_view(('GET',))
def get_schedule_pool(request, code_schedule_pool):
    specified_time_slot = SchedulePool.objects.get(pool_link=code_schedule_pool)
    serializer_result = SchedulePoolSerializer(data=specified_time_slot)
    if serializer_result.is_valid():
        print(serializer_result.data)
        return Response(serializer_result)
    return Response(serializer_result.errors, status=status.HTTP_400_BAD_REQUEST)


class djangoUsers(APIView):

    serializers_class = djangoUserSerializer
    
    def get(self, request):
        email = request.GET.get('email', '')
        password = request.GET.get('password', '')
        
        print(email)
        
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
 
