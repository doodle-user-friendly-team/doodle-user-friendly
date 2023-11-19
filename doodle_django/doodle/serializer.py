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




class RecapVoteSerializer(serializers.ModelSerializer):
    time_slot = TimeSlotSerializer()
    class Meta:
        model = Vote
        fields = ['id', 'user', 'time_slot', 'preference']
# Campi finali: id_user, id_timeslot, start_time, end_date, id_vote, preference

        
