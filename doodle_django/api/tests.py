from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.utils.timezone import now, timedelta
from collections import OrderedDict
from .models import Meeting
from rest_framework.test import APIClient


class MeetingTests(APITestCase):
   
    def test_create_meeting_successfully(self):
        """
        Creating a Meeting Successfully
        """
        create_meeting_url = reverse('api:api_meetings_create')
        data = {
            "title": "TestMeeting",
            "description": "Test Description",
            "location": "Test Location",
            "video_conferencing": False,
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
        response = self.client.post(create_meeting_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Debug information
        print(f"Response data: {response.data}")
        
        self.created_meeting_id = response.data.get('id')  # Set the created meeting ID

        # Debug information
        print(f"created_meeting_id: {self.created_meeting_id}")

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



    def test_update_meeting_successfully(self):
        # Call the create test to ensure a meeting is created and created_meeting_id is set
        self.test_create_meeting_successfully()

        # Ensure that created_meeting_id is set
        self.assertIsNotNone(getattr(self, 'created_meeting_id', None), "created_meeting_id not set")

        # Define the update data
        updated_data = {
            "title": "UpdatedMeeting",
            "description": "Updated Description",
            "location": "Updated Location",
            "video_conferencing": True,
            "duration": timedelta(hours=2),
            "deadline": now() + timedelta(days=7),
            "passcode": "12345",# Add the 'passcode' field
            "timeslots": [
                {
                    "start_date": now() + timedelta(days=3),
                    "end_date": now() + timedelta(days=4),
                },
                {
                    "start_date": now() + timedelta(days=4),
                    "end_date": now() + timedelta(days=5),
                },
            ],
        }

        # Make the update request
        url = reverse('api:api_meetings_edit', args=[self.created_meeting_id])
        response = self.client.put(url, updated_data, format='json')

        # Print response data and status code for debugging
        print(f"Response data: {response.data}")
        print(f"Response status code: {response.status_code}")
        if response.status_code != status.HTTP_200_OK:
           print(f"Response errors: {response.data.get('errors')}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_meeting_unsuccessfully_not_found(self):
        self.test_create_meeting_successfully()
    # Ensure that created_meeting_id is set (you may also check if it's None or not set)
        self.assertIsNotNone(getattr(self, 'created_meeting_id', None), "created_meeting_id not set")
        url = reverse('api:api_meetings_edit',args=[self.created_meeting_id])  # Assuming the meeting with ID 999 does not exist
        updated_data = {
            "title": "UpdatedMeeting",
            "description": "Updated Description",
            "location": "Updated Location",
            "video_conferencing": "True",
            "duration": timedelta(hours=2),
            "deadline": now() + timedelta(days=7),
            "passcode": "UpdatedPasscode",  # Add the 'passcode' field
            "timeslots": [
                {
                    "start_date": now() + timedelta(days=3),
                    "end_date": now() + timedelta(days=4),
                },
                {
                    "start_date": now() + timedelta(days=4),
                    "end_date": now() + timedelta(days=5),
                },
            ],
        }

        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    def test_delete_meeting_successfully(self):
        self.test_create_meeting_successfully()
       # Ensure that created_meeting_id is set (you may also check if it's None or not set)
        self.assertIsNotNone(getattr(self, 'created_meeting_id', None), "created_meeting_id not set")
        url = reverse('api:api_meetings_delete',args=[self.created_meeting_id])
        response = self.client.delete(url)


        # Example: Expecting 204 NO CONTENT
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


    def test_delete_meeting_unsuccessfully_not_found(self):
        # Ensure that created_meeting_id is set (you may also check if it's None or not set)
        self.test_create_meeting_successfully()
        self.assertIsNotNone(getattr(self, 'created_meeting_id', None), "created_meeting_id not set")
        url = reverse('api:api_meetings_delete',args=[13])  # Assuming the meeting with ID 999 does not exist
        response = self.client.delete(url)


        # Example: Expecting 404 NOT FOUND
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Ensure that no meeting was deleted
        self.assertEqual(Meeting.objects.count(), 1)  # Assuming you have one test meeting created in the setUp method


    def test_update_meeting_successfully(self):
        self.test_create_meeting_successfully()
    # Ensure that created_meeting_id is set (you may also check if it's None or not set)
        self.assertIsNotNone(getattr(self, 'created_meeting_id', None), "created_meeting_id not set")
        updated_data = {
            "final_date": 1,
        }
        url = reverse('api:api_meeting_book', args=[self.created_meeting_id])
        response = self.client.put(url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_meeting_unsuccessfully(self):
        self.test_create_meeting_successfully()
        self.assertIsNotNone(getattr(self, 'created_meeting_id', None), "created_meeting_id not set")
        
        invalid_data = {
            "final_date": "ricca",  
        }
        
        url = reverse('api:api_meeting_book', args=[self.created_meeting_id])
        response = self.client.put(url, invalid_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
