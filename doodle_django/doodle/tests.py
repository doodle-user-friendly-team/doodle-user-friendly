from django.test import TestCase
from datetime import datetime, timedelta
from .views import *

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
        
        self.user = UserFake.objects.create(name='Test', surname='User')
        self.meeting = Meeting.objects.create(name='Test Meeting', description='test')
        self.schedule_pool = SchedulePool.objects.create(voting_start_date=datetime.now(), voting_deadline=datetime.now() + timedelta(days=1), meeting=self.meeting)
    
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
        
        self.assertEquals(self.ts.post(FakeRequest(goodRequest)).status_code, status.HTTP_200_OK)
        

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
        
        self.assertEquals(self.ts.get(FakeRequest(goodTime)).status_code, status.HTTP_200_OK)