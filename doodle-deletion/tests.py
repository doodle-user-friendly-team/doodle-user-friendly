from django.test import TestCase
from django.urls import reverse
from .models import Meeting
from .forms import MeetingForm

class MeetingTests(TestCase):
    def setUp(self):
        self.meeting = Meeting.objects.create(
            title='Test Meeting',
            description='This is a test meeting',
            video_conferencing=True,
            duration=60,
            date_and_time='2023-11-15T10:00:00Z',
            deadline='2023-12-9T11:00:00Z',
        )

    # def test_modify_meeting_view(self):
    #     url = reverse('modify_meeting', args=[self.meeting.id])
    #     response = self.client.get(url)
    #     self.assertEqual(response.status_code, 200)

    # def test_modify_meeting_form_valid_submission(self):
    #     form_data = {
    #         'title': 'Modified Test Meeting',
    #         'description': 'Modified description',
    #         'location': 'Modified location',
    #         'video_conferencing': True,
    #         'duration': 90,
    #         'date_and_time': '2023-12-19T15:00:00Z',
    #         'deadline': '2023-12-9T11:00:00Z',
    #     }
    #     form = MeetingForm(data=form_data, instance=self.meeting)
    #     self.assertTrue(form.is_valid())

    def test_delete_meeting_view(self):
        url = reverse('delete_meeting', args=[self.meeting.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

