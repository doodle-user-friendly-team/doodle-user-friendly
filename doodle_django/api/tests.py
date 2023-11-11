from django.test import TestCase
from django.utils.timezone import *
from django.urls import reverse

from rest_framework.test import APITestCase
from rest_framework import status

import json

from . models import *


class MeetingTests(APITestCase):
    
    def test_create_meeting_successfully(self):
        """
        Creating a Meeting Successfully
        """
        url = reverse('api:api_meetings_create')

        data = {
            'title': 'TestMeeting',
            'description': 'Test Description',
            'location': 'Test Location',
            'video_conferencing': True,
            'duration': timedelta(hours=1),         
            'start_date': now() + timedelta(days=1),
            'end_date': now() + timedelta(days=5),
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(Meeting.objects.count(), 1)

        self.assertEqual(Meeting.objects.get().title, 'TestMeeting')


    def test_create_meeting_unsuccessfully_incomplete_information(self):
        """
        Creating a Meeting Unsuccessfully with Incomplete Information
        """
        url = reverse('api:api_meetings_create')

        data = {
            #missing title
            'description': 'Test Description',
            'location': 'Test Location',
            'video_conferencing': True,
            'duration': timedelta(hours=1),         
            'start_date': now() + timedelta(days=1),
            'end_date': now() + timedelta(days=5),
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(Meeting.objects.count(), 0)

    

    def test_create_meeting_unsuccessfully_past_start_date(self):
        """
        Creating a Meeting Unsuccessfully with a Past Starting Time
        """
        url = reverse('api:api_meetings_create')

        data = {
            'title': 'TestMeeting',
            'description': 'Test Description',
            'location': 'Test Location',
            'video_conferencing': True,
            'duration': timedelta(hours=1),         
            'start_date': now() - timedelta(days=1),
            'end_date': now() + timedelta(days=5),
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(Meeting.objects.count(), 0)

    def test_create_meeting_unsuccessfully_end_date_before_start_date(self):
        """
        Creating a Meeting Unsuccessfully with a End Date which comes before Start Date
        """
        url = reverse('api:api_meetings_create')

        data = {
            'title': 'TestMeeting',
            'description': 'Test Description',
            'location': 'Test Location',
            'video_conferencing': True,
            'duration': timedelta(hours=1),         
            'start_date': now() + timedelta(days=4),
            'end_date': now() + timedelta(days=2),
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(Meeting.objects.count(), 0)



    def test_get_list_meetings(self):
        """
        Get all meetings
        """
        #create 4 meetings
        url = reverse('api:api_meetings_create')
        
        data = {
            'title': 'TestMeeting',
            'description': 'Test Description',
            'location': 'Test Location',
            'video_conferencing': True,
            'duration': timedelta(hours=1),         
            'start_date': now() + timedelta(days=1),
            'end_date': now() + timedelta(days=5),
        }

        for _ in range(4):
            self.client.post(url, data, format='json')
        

        url = reverse('api:api_meetings')

        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(Meeting.objects.count(), 4)


    def test_search_single_meeting(self):
        """
        Get a single Meeting
        """
        url = reverse('api:api_meetings_create')
        
        data1 = {
            'title': 'TestMeeting',
            'description': 'Test Description',
            'location': 'Test Location',
            'video_conferencing': True,
            'duration': timedelta(hours=1),         
            'start_date': now() + timedelta(days=1),
            'end_date': now() + timedelta(days=5),
        }

        self.client.post(url, data1, format='json')

        data2 = {
            'title': 'OtherMeeting',
            'description': 'Test Description',
            'location': 'Test Location',
            'video_conferencing': False,
            'duration': timedelta(hours=1),         
            'start_date': now() + timedelta(days=2),
            'end_date': now() + timedelta(days=4),
        }

        self.client.post(url, data2, format='json')

        url = reverse('api:api_meetings')
        
        response = self.client.get(url, data={"title": "test"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 1)

        self.assertEqual(response.data[0]["title"], data1["title"])



        