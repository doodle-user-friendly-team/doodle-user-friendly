from rest_framework import serializers
from .models import *


class UserFakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFake
        fields = ['id', 'name', 'surname', 'email']

        
class TimeSlotSerializer(serializers.ModelSerializer):

    user = UserFakeSerializer()

    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_time', 'schedule_pool', 'user']


class SchedulePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchedulePool
        fields = ['id', 'voting_start_date', 'voting_deadline', 'meeting']
        

class DetailedVoteSerializer(serializers.ModelSerializer):

    user = UserFakeSerializer()

    class Meta:
        model = Vote
        fields = ['id', 'preference', 'time_slot', 'user']


class VoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = ['id', 'preference', 'time_slot', 'user']


class CreateVoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vote
        fields = ['preference', 'time_slot', 'user']


class TimeSlotRecapSerializer(serializers.ModelSerializer):

    votes = VoteSerializer(many=True)

    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_date', 'schedule_pool', 'user', 'votes']

