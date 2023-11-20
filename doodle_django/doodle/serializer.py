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




class RecapVoteSerializer(serializers.ModelSerializer):
    time_slot = TimeSlotSerializer()
    class Meta:
        model = Vote
        fields = ['id', 'user', 'time_slot', 'preference']
# Campi finali: id_user, id_timeslot, start_time, end_date, id_vote, preference

class TopThreeSerializer(serializers.Serializer):
    time_slot_id = serializers.IntegerField()
    start_time = serializers.StringRelatedField()
    end_time = serializers.StringRelatedField()
    count_available = serializers.IntegerField()
    count_maybe_available = serializers.IntegerField()
    count_unavailable = serializers.IntegerField()

    def to_representation(self, instance):
        return {
            'time_slot_id': instance['time_slot_id'],
            'start_time': instance['start_time'],
            'end_time': instance['end_time'],
            'available': instance['available'],
            'maybe_available': instance['maybe_available'],
            'unavailable': instance['unavailable']
        }

        
