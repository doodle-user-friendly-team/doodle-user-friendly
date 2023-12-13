from rest_framework import serializers
from .models import *

from django.contrib.auth import get_user_model

class UserFakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFake
        fields = ['id', 'name', 'surname', 'email']
        extra_kwargs = {
            'name': {'required': False},
            'surname': {'required': False},
            'email': {'required': False},
        }


class TimeSlotSerializer(serializers.ModelSerializer):
    #user = UserFakeSerializer()

    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'schedule_pool', 'end_time', 'user']

class TimeSlotUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserFake
        fields = ['name', 'surname']

class MeetingTimeSlotSerializer(serializers.ModelSerializer):
    user = TimeSlotUserSerializer()
    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'schedule_pool', 'end_time', 'user']



class DetailedVoteSerializer(serializers.ModelSerializer):
    user = UserFakeSerializer()

    class Meta:
        model = Vote
        fields = ['id', 'preference', 'time_slot', 'user']


class DetailedTimeSlotSerializer(serializers.ModelSerializer):
    user = UserFakeSerializer()
    preferences = DetailedVoteSerializer(many=True, source='vote_set')

    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'schedule_pool', 'end_time', 'user', 'preferences']



class SchedulePoolSerializer(serializers.ModelSerializer):
    time_slots = MeetingTimeSlotSerializer(many=True, read_only=True, source='timeslot_set')

    class Meta:
        model = SchedulePool
        fields = ['id', 'voting_start_date', 'voting_deadline', 'pool_link', 'meeting', 'time_slots']



class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'preference', 'time_slot', 'user']





class MeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['id', 'name', 'description', 'location', 'duration', 'period_start_date', 'period_end_date',
                  'organizer_link', 'user']


class CompleteSchedulePoolSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True, source='timeslot_set')
    meeting = MeetingSerializer()

    class Meta:
        model = SchedulePool
        fields = ['id', 'voting_start_date', 'voting_deadline', 'pool_link', 'meeting', 'time_slots']


class CompleteMeetingSerializer(serializers.ModelSerializer):
    user = UserFakeSerializer()
    schedule_pool = SchedulePoolSerializer(many=True, read_only=True, source='schedulepool_set')

    class Meta:
        model = Meeting
        fields = ['id', 'name', 'description', 'location', 'duration', 'period_start_date', 'period_end_date',
                  'organizer_link', 'user', 'schedule_pool']


class CreateMeetingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meeting
        fields = ['organizer_name', 'organizer_surname', 'organizer_email', 'id', 'name', 'description',
                  'location', 'duration', 'period_start_date', 'period_end_date', 'organizer_link']


class CreateVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['preference', 'time_slot', 'user']


class TimeSlotRecapSerializer(serializers.ModelSerializer):
    votes = VoteSerializer(many=True)

    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'end_date', 'schedule_pool', 'user', 'votes']


class djangoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'password']