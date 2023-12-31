from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from doodle.models import TimeSlot, UserFake, SchedulePool, Meeting
from doodle.serializer import TimeSlotSerializer
import json
from datetime import datetime, timedelta
from .views import *

from .models import *
from .serializer import *


class FakeRequest:
    def __init__(self, data):
        self.__data = data

    @property
    def data(self):
        return self.__data

    def get(self, key, default):
        if key in self.__data:
            return self.__data[key]
        return default

    @property
    def GET(self):
        return self



class TimeSlotViewTest(TestCase):

    def setUp(self):
        self.ts = TimeSlotView()

        self.user = UserFake.objects.create(id="1", name="mario", surname="rossi", email="text@example.com")
        self.meeting = Meeting.objects.create(id="1", name="Prova",description="Questa è una prova")
        self.schedule_pool = SchedulePool.objects.create(id="1", voting_start_date="2023-11-20 00:00:00",
                                                         voting_deadline="2020-11-30 00:00:00", meeting=self.meeting)

    def test_create_time_slot(self):
        # Sample data to create a new TimeSlot

        malformed_data = {
            "start_time": "",
            "end_time": "2023-01-01T13:00:00Z",
            "schedule_pool": self.schedule_pool.id,
            "user": self.user.id
        }

        equalsTime = {
            "start_time": "2023-01-01T13:00:00Z",
            "end_time": "2023-01-01T13:00:00Z",
            "schedule_pool": self.schedule_pool.id,
            "user": self.user.id
        }

        startBiggerThanEnd = {
            "start_time": "2023-01-01T14:00:00Z",
            "end_time": "2023-01-01T13:00:00Z",
            "schedule_pool": self.schedule_pool.id,
            "user": self.user.id
        }

        timeLessThanNow = {
            "start_time": "2023-01-01T14:00:00Z",
            "end_time": "2023-01-01T16:00:00Z",
            "schedule_pool": self.schedule_pool.id,
            "user": self.user.id
        }

        goodRequest = {
            "start_time": "2024-01-01T11:00:00Z",
            "end_time": "2024-01-01T13:00:00Z",
            "schedule_pool": self.schedule_pool.id,
            "user": self.user.id
        }

        self.assertRaises(TimeError, self.ts.post, FakeRequest(equalsTime))
        self.assertRaises(TimeError, self.ts.post, FakeRequest(startBiggerThanEnd))
        self.assertRaises(FormatError, self.ts.post, FakeRequest(malformed_data))
        self.assertRaises(TimeLessThanNowError, self.ts.post, FakeRequest(timeLessThanNow))

        self.assertEqual(self.ts.post(FakeRequest(goodRequest)).status_code, status.HTTP_200_OK)

    def test_get_time_slots(self):
        malformedTime = {
            "day": "00",
            "month": "02",
            "year": "2023"
        }

        goodTime = {
            "day": "01",
            "month": "02",
            "year": "2023"
        }

        self.assertRaises(FormatError, self.ts.get, FakeRequest(malformedTime))

        self.assertEqual(self.ts.get(FakeRequest(goodTime)).status_code, status.HTTP_200_OK)

# Create your tests here.
class VoteViewTest(TestCase):
    def setUp(self):
        # Crea alcuni dati di esempio nel database per il test
        self.user1 = UserFake.objects.create(id="1", name="mario", surname="rossi", email="text@example.com")
        self.user2 = UserFake.objects.create(id="2", name="paolo", surname="bianchi", email="text2@example.com")
        self.user1.save()
        self.user2.save()
        self.meeting = Meeting.objects.create(id="1", name="Prova",description="QUesta è una prova")
        self.meeting.save()
        self.schedule_pool = SchedulePool.objects.create(id="1", voting_start_date="2023-11-20 00:00:00",
                                                         voting_deadline="2020-11-30 00:00:00", meeting=self.meeting)
        self.schedule_pool.save()
        self.time_slot = TimeSlot.objects.create(id="1", start_time="2023-11-21 00:00:00",
                                                 end_time="2023-11-21 01:00:00",
                                                 schedule_pool=self.schedule_pool, user=self.user1)
        self.time_slot.save()
        self.preference = Vote.objects.create(id="1", preference="Available", time_slot=self.time_slot, user=self.user1)

        self.valid_vote_data = {'preference': "Available", 'time_slot': "1", "user": "2"}

    def test_get_all_votes(self):
        url = reverse('votes_api')
        response = self.client.get(url)
        # Verifica che la risposta abbia uno status code 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        votes = Vote.objects.all()
        expected_data = VoteSerializer(votes, many=True).data
        self.assertEqual(response.data, expected_data)

    def test_post_preference(self):
        url = reverse('votes_api')
        response = self.client.post(url, self.valid_vote_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Vote.objects.count(), 2)

class UpdateTimeSlotViewTest(TestCase):
    def setUp(self):
        # Crea un oggetto Meeting
        self.meeting = Meeting.objects.create(id='1', description='Discuteremo cosa fare in questi giorni', name='DailyScrum')

        # Crea un oggetto SchedulePool
        self.schedul = SchedulePool.objects.create(id='1', voting_start_date='2023-11-18 21:52:40', voting_deadline='2023-11-20 00:00:00', meeting_id=self.meeting.id)
        
        # Crea un oggetto UserFake
        self.userfake = UserFake.objects.create(id='1', name='Beatrice', surname='Motta', email='mottabea@gmail.com')
       
        # Crea un oggetto TimeSlot per il test
        self.timeslot = TimeSlot.objects.create(id='1', start_time='2023-11-19T12:00:00Z', end_time='2023-11-19T13:00:00Z', user_id=self.userfake.id, schedule_pool_id=self.schedul.id)
        

    def test_failure_put(self):
        # Crea dati per l'aggiornamento
        updated_data = {'start_time': '2023-11-20T12:00:00Z', 'end_time': '2023-11-20T13:00:00Z', 'user': '2', 'schedule_pool': '1'}

        # Esegui la richiesta di aggiornamento
        url = reverse('updateTimeSlot', args=[self.timeslot.pk])
        response = self.client.put(url, data=json.dumps(updated_data), content_type='application/json')

        # Stampa l'output della risposta
        print("Response Status Code:", response.status_code)
        print("Response Content:", response.content)
        print("Response Headers:", response.headers)

        # La tua asserzione
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

        # Ricarica il timeslot dal database per verificare che sia stato effettivamente aggiornato
        updated_timeslot = TimeSlot.objects.get(pk=self.timeslot.pk)

    def test_get_timeslot(self):
        url = reverse('updateTimeSlot', args=[1])
        response = self.client.get(url)
        # Verifica che la risposta abbia uno status code 200 (OK)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verifica che i dati restituiti siano corretti
        expected_data = TimeSlotSerializer(self.timeslot).data
        self.assertEqual(response.data, expected_data)



    def test_get_nonexistent_timeslot(self):
        non_existent_url = reverse('updateTimeSlot', args=[999])  # Assumi che 999 non sia un ID valido
        response = self.client.get(non_existent_url)

        # Verifica che la risposta abbia uno status code 404 (Not Found)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
