import json
from django.test import TestCase
from django.urls import *
from rest_framework import status
from rest_framework.test import APIClient
from .models import Meeting, SchedulePool, UserFake, TimeSlot, Vote
from datetime import datetime
#serializer
from .serializer import *


class TopThreeViewTest(TestCase):

    @classmethod
    def setUpClass(self):
        super().setUpClass()

        # Dati di esempio nel database per il test
        self.meeting = Meeting.objects.create(name="Meeting Test")
        self.schedule_pool = SchedulePool.objects.create(
            id=1,
            voting_start_date="2023-01-01T00:00:00Z",
            voting_deadline="2023-01-02T00:00:00Z",
            meeting=self.meeting
        )
        self.users =[   
            UserFake.objects.create(id=1,name="John", surname="Doe", email="john.doe@example.com"),
            UserFake.objects.create(id=2,name="Jane", surname="Doe", email="jane.doe@example.com"),
            UserFake.objects.create(id=3,name="Mario", surname="Rossi", email="mario.rossi@example.com")
        ]
        self.time_slots = [
            TimeSlot.objects.create(id=1,start_time="2023-01-01T12:00:00Z", end_time="2023-01-01T14:00:00Z", schedule_pool=self.schedule_pool, user=self.users[0]),
            TimeSlot.objects.create(id=2,start_time="2023-01-01T12:00:00Z", end_time="2023-01-01T14:00:00Z", schedule_pool=self.schedule_pool, user=self.users[1]),
            TimeSlot.objects.create(id=3,start_time="2023-01-01T12:00:00Z", end_time="2023-01-01T14:00:00Z", schedule_pool=self.schedule_pool, user=self.users[2]),
        ]
        self.vote=[
            Vote.objects.create(id=1,preference="Available", time_slot=self.time_slots[0], user=self.users[0]),
            Vote.objects.create(id=2,preference="Available", time_slot=self.time_slots[0], user=self.users[1]),
            Vote.objects.create(id=3,preference="Maybe available", time_slot=self.time_slots[1], user=self.users[0]),
            Vote.objects.create(id=4,preference="Available", time_slot=self.time_slots[1], user=self.users[1]),   
            Vote.objects.create(id=5,preference="Available", time_slot=self.time_slots[2], user=self.users[2]),
        ]


    def test_top_three_view(self):
        # URL della vista con l'ID della riunione
        url = reverse('top-three', args=[self.meeting.id])
        #print(url)
        
        # Client API
        client = APIClient()

        # Richiesta GET alla vista
        response = client.get(url)

        # Verifica che la risposta abbia uno status code 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        
        response_data_formatted = [
            {
                'time_slot_id': result['time_slot_id'],
                'start_time': result['start_time'].strftime("%Y-%m-%dT%H:%M:%SZ"),
                'end_time': result['end_time'].strftime("%Y-%m-%dT%H:%M:%SZ"),
                'available': result['available'],
                'maybe_available': result['maybe_available'],
                'unavailable': result['unavailable'],
            }
            for result in response.data
        ]

        # Verifica che la risposta contenga i dati attesi
        expected_data= [
            {
                'time_slot_id': self.time_slots[0].id,
                'start_time': self.time_slots[0].start_time,
                'end_time': self.time_slots[0].end_time,
                'available': 2,
                'maybe_available': 0,
                'unavailable': 0,
            },
            {
                'time_slot_id': self.time_slots[1].id,
                'start_time': self.time_slots[1].start_time,
                'end_time': self.time_slots[1].end_time,
                'available': 1,
                'maybe_available': 1,
                'unavailable': 0,
            },
            {
                'time_slot_id': self.time_slots[2].id,
                'start_time': self.time_slots[2].start_time,
                'end_time': self.time_slots[2].end_time,
                'available': 1,
                'maybe_available': 0,
                'unavailable': 0,
            }
        ]

        self.assertEqual(response_data_formatted, expected_data)




class TimeSlotVotatedViewTest(TestCase):

    @classmethod
    def setUpClass(self):
        super().setUpClass()
        # Creare dati di esempio nel database per il test
        self.user = UserFake.objects.create(id=1, name="John", surname="Doe", email="john.doe@example.com")
        self.meeting = Meeting.objects.create(id=1, name="Meeting Test")
        self.schedule_pool = SchedulePool.objects.create(
            id=1,
            voting_start_date="2023-01-01T00:00:00Z",
            voting_deadline="2023-01-02T00:00:00Z",
            meeting=self.meeting
        )
        self.time_slots = [
            TimeSlot.objects.create(id=1,start_time="2023-01-01T12:00:00Z", end_time="2023-01-01T14:00:00Z", schedule_pool=self.schedule_pool, user=self.user),
            TimeSlot.objects.create(id=2,start_time="2023-01-01T12:00:00Z", end_time="2023-01-01T14:00:00Z", schedule_pool=self.schedule_pool, user=self.user),
            TimeSlot.objects.create(id=3,start_time="2023-01-01T12:00:00Z", end_time="2023-01-01T14:00:00Z", schedule_pool=self.schedule_pool, user=self.user),
        ]
        self.vote=[
            Vote.objects.create(id=1,preference="Available", time_slot=self.time_slots[0], user=self.user),
            Vote.objects.create(id=2,preference="Unavailable", time_slot=self.time_slots[1], user=self.user),
            Vote.objects.create(id=3,preference="Maybe available", time_slot=self.time_slots[2], user=self.user),
        ]

    def test_timeslot_votated_view(self):
        # URL della vista
        url = reverse('timeslot-votated')

        # Dati di input
        data = {'user': self.user.id, 'meeting': self.meeting.id}

        # Client API
        client = APIClient()

        # Richiesta POST alla vista
        response = client.post(url, data, format='json')
        
        # Verifica che la risposta abbia uno status code 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verifica che i dati restituiti siano corretti
        # Verifica che la risposta contenga i dati attesi
        expected_data = [
            {
                'id': self.vote[0].id,
                'preference': 'Available',
                'time_slot': {
                    'id': self.time_slots[0].id,
                    'start_time': self.time_slots[0].start_time,
                    'end_time': self.time_slots[0].end_time,
                    'schedule_pool': self.schedule_pool.id,
                    'user': self.user.id,
                },
                'user': self.user.id,
            },
            {
                'id': self.vote[1].id,
                'preference': 'Unavailable',
                'time_slot': {
                    'id': self.time_slots[1].id,
                    'start_time': self.time_slots[1].start_time,
                    'end_time': self.time_slots[1].end_time,
                    'schedule_pool': self.schedule_pool.id,
                    'user': self.user.id,
                },
                'user': self.user.id,
            },
            {
                'id': self.vote[2].id,
                'preference': 'Maybe available',
                'time_slot': {
                    'id': self.time_slots[2].id,
                    'start_time': self.time_slots[2].start_time,
                    'end_time': self.time_slots[2].end_time,
                    'schedule_pool': self.schedule_pool.id,
                    'user': self.user.id,
                },
                'user': self.user.id,
            },
        ]

        response_data = json.loads(json.dumps(response.data))

        #print(response_data[0])
        #print(expected_data)

        
         # Converte la risposta in una lista di dizionari per confrontare in modo più flessibile
        #response_data = list(response.data)
        #expected_data.sort(key=lambda x: x['id'])
        #response_data.sort(key=lambda x: x['id'])
        self.assertEqual(response_data, expected_data)
