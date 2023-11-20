from rest_framework import serializers
from .models import *

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_time', 'schedule_pool', 'user']

class SchedulePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchedulePool
        fields = ['id', 'voting_start_date', 'voting_deadline', 'meeting']

class UserFakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFake
        fields = ['id', 'name', 'surname', 'email']
