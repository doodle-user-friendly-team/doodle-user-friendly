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
            "title": "TestMeeting",
            "description": "Test Description",
            "location": "Test Location",
            "video_conferencing": "False",
            "duration": timedelta(hours=1),     
            "deadline": now() + timedelta(days=5),
            "timeslots": [
                {
                    "start_date": now() + timedelta(days=1),
                    "end_date": now() + timedelta(days=2)
                },
                {
                    "start_date": now() + timedelta(days=2),
                    "end_date": now() + timedelta(days=3)
                }
            ]
        }

        # manual test
        '''
        {   
            "title": "TestMeeting",
            "description": "Test Description",
            "location": "Test Location",
            "video_conferencing": "False",
            "duration": "01:00:00",         
            "start_date": "2023-11-19",
            "deadline": "2023-12-26",
            "timeslots": [
                {
                    "start_date": "2023-11-20",
                    "end_date": "2023-11-21"
                },
                {
                    "start_date": "2023-11-20",
                    "end_date": "2023-11-22"
                }
            ]
        }
        '''


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
            "description": "Test Description",
            "location": "Test Location",
            "video_conferencing": "False",
            "duration": timedelta(hours=1),     
            "deadline": now() + timedelta(days=5),
            "timeslots": [
                {
                    "start_date": now() + timedelta(days=1),
                    "end_date": now() + timedelta(days=2)
                },
                {
                    "start_date": now() + timedelta(days=2),
                    "end_date": now() + timedelta(days=3)
                }
            ]
        }

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.assertEqual(Meeting.objects.count(), 0)

    

    def test_create_meeting_unsuccessfully_past_deadline(self):
        """
        Creating a Meeting Unsuccessfully with a Past Deadline
        """
        url = reverse('api:api_meetings_create')

        data = {   
            "title": "TestMeeting",
            "description": "Test Description",
            "location": "Test Location",
            "video_conferencing": "False",
            "duration": timedelta(hours=1),     
            "deadline": now() - timedelta(days=1),
            "timeslots": [
                {
                    "start_date": now() + timedelta(days=1),
                    "end_date": now() + timedelta(days=2)
                },
                {
                    "start_date": now() + timedelta(days=2),
                    "end_date": now() + timedelta(days=3)
                }
            ]
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
            "title": "TestMeeting",
            "description": "Test Description",
            "location": "Test Location",
            "video_conferencing": "False",
            "duration": timedelta(hours=1),     
            "deadline": now() + timedelta(days=5),
            "timeslots": [
                {
                    "start_date": now() + timedelta(days=1),
                    "end_date": now() + timedelta(days=2)
                },
                {
                    "start_date": now() + timedelta(days=2),
                    "end_date": now() + timedelta(days=3)
                }
            ]
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
            "title": "TestMeeting",
            "description": "Test Description",
            "location": "Test Location",
            "video_conferencing": "False",
            "duration": timedelta(hours=1),     
            "deadline": now() + timedelta(days=5),
            "timeslots": [
                {
                    "start_date": now() + timedelta(days=1),
                    "end_date": now() + timedelta(days=2)
                },
                {
                    "start_date": now() + timedelta(days=2),
                    "end_date": now() + timedelta(days=3)
                }
            ]
        }

        self.client.post(url, data1, format='json')

        data2 = {   
            "title": "OtherMeeting",
            "description": "Test Description",
            "location": "Test Location",
            "video_conferencing": "False",
            "duration": timedelta(hours=1),     
            "deadline": now() + timedelta(days=5),
            "timeslots": [
                {
                    "start_date": now() + timedelta(days=1),
                    "end_date": now() + timedelta(days=2)
                },
                {
                    "start_date": now() + timedelta(days=2),
                    "end_date": now() + timedelta(days=3)
                }
            ]
        }


        self.client.post(url, data2, format='json')

        url = reverse('api:api_meetings')
        
        response = self.client.get(url, data={"title": "test"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 1)

        self.assertEqual(response.data[0]["title"], data1["title"])



        