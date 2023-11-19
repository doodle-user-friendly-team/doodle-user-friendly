from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from doodle.models import TimeSlot, UserFake, SchedulePool, Meeting
from doodle.serializer import TimeSlotSerializer
import json


class UpdateTimeSlotViewTest(TestCase):
    def setUp(self):
        # Crea un oggetto Meeting
        self.meeting = Meeting.objects.create(id='1', description='Discuteremo cosa fare in questi giorni', name='DailyScrum')
        self.meeting.save()

        # Crea un oggetto SchedulePool
        self.schedul = SchedulePool.objects.create(id='1', voting_start_date='2023-11-18 21:52:40', voting_deadline='2023-11-20 00:00:00', meeting_id=self.meeting.id)
        self.schedul.save()

        # Crea un oggetto UserFake
        self.userfake = UserFake.objects.create(id='1', name='Beatrice', surname='Motta', email='mottabea@gmail.com')
        self.userfake.save()

        # Crea un oggetto TimeSlot per il test
        self.timeslot = TimeSlot.objects.create(id='1', start_time='2023-11-19T12:00:00Z', end_time='2023-11-19T13:00:00Z', user_id=self.userfake.id, schedule_pool_id=self.schedul.id)
        self.timeslot.save()

    def test_failure_put(self):
        # Crea dati per l'aggiornamento
        updated_data = {'start_time': '2023-11-20T12:00:00Z', 'end_time': '2023-11-20T13:00:00Z', 'user': '1', 'schedule_pool': '1'}

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
