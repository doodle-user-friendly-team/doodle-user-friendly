from rest_framework import serializers
from .models import *


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_date', 'schedule_pool', 'user']


class SchedulePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchedulePool
        fields = ['id', 'voting_start_date', 'voting_deadline', 'meeting']


class UserFakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFake
        fields = ['id', 'name', 'surname', 'email']


class GetVoteSerializer(serializers.ModelSerializer):

    user = UserFakeSerializer()

    class Meta:
        model = Vote
        fields = ['id', 'preference', 'time_slot', 'user']


class CreateVoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = ['preference', 'time_slot', 'user']


class TimeSlotRecapSerializer(serializers.ModelSerializer):

    votes = GetVoteSerializer(many=True)

    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_date', 'schedule_pool', 'user', 'votes']

