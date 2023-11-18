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

#per la registrazione
from rest_framework.generics import CreateAPIView


# Create your views here. 

class TimeSlotView(APIView):

    serializer_class = TimeSlotSerializer

    def get(self, request):
        ts = [ {"id": timeslot.id,"start_time": timeslot.start_time, "end_time": timeslot.end_date, "user": timeslot.user.id}
                   for timeslot in TimeSlot.objects.all()]
        return Response(ts)

    def post(self, request):

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