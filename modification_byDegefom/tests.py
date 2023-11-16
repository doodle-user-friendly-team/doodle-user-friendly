from django.test import TestCase
from django.urls import reverse
from .models import Meeting
from .forms import MeetingForm

class MeetingViewsTest(TestCase):
    def setUp(self):
        self.meeting = Meeting.objects.create(
            title='Test Meeting',
            description='Test Description',
            location='Test Location',
            video_conferencing=True,
            duration=90,
            date_time='2023-01-01 12:00:00',
            dead_line='2023-01-01 11:00:00'
        )

    def test_meeting_list_view(self):
        response = self.client.get(reverse('meeting_list'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'meeting_list.html')
        self.assertContains(response, self.meeting.title)

    def test_modify_meeting_view(self):
        url = reverse('modify_meeting', args=[self.meeting.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'modify_meeting.html')
        self.assertIsInstance(response.context['form'], MeetingForm)

    def test_modify_meeting_post(self):
        url = reverse('modify_meeting', args=[self.meeting.pk])
        data = {
            'title': 'Updated Title',
            'description': 'Updated Description',
            'location': 'Updated Location',
            'video_conferencing': False,
            'duration': 120,
            'date_time': '2023-02-02 14:00:00',
            'dead_line': '2023-02-02 13:00:00',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 302)  # Redirect status code
        updated_meeting = Meeting.objects.get(pk=self.meeting.pk)
        self.assertEqual(updated_meeting.title, 'Updated Title')

    def test_delete_meeting_view(self):
        url = reverse('delete_meeting', args=[self.meeting.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'confirm_delete_meeting.html')
        self.assertEqual(response.context['meeting'], self.meeting)

    def test_confirm_delete_meeting_post(self):
        url = reverse('confirm_delete_meeting', args=[self.meeting.pk])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 302)  # Redirect status code
        with self.assertRaises(Meeting.DoesNotExist):
            Meeting.objects.get(pk=self.meeting.pk)
