from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, renderer_classes, permission_classes, authentication_classes
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *

# for identification
from django.contrib.auth import authenticate, login
from rest_framework.permissions import AllowAny
from rest_framework import status

# for registration
from rest_framework.generics import CreateAPIView


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

    def post(self, request, *args, **kwargs):
        # Chiamiamo il metodo create del serializer per gestire la creazione dell'utente
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Ritorniamo una risposta di successo con i dati dell'utente appena creato
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


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


