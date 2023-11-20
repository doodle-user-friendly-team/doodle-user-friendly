from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from .models import *
from .serializer import *


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






