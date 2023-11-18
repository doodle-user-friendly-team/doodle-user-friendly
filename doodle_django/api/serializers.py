from rest_framework import serializers
from django.utils.timezone import *

from django.core.validators import *

from . models import *

class MeetingSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if 'deadline' in data and 'creation_date' in data:
            if data['deadline'] < data['creation_date']:
                raise serializers.ValidationError("Deadline must occur after Creation date", code="DeadlineBeforeCreationDate")

        return data

    class Meta:
        model = Meeting
        fields = '__all__'
        


class TimeSlotSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if 'end_date' in data and 'start_date' in data:
            if data['end_date'] < data['start_date']:
                raise serializers.ValidationError("End must occur after Start Date", code="EndDateBeforeStartDate")

        return data

    class Meta:
        model = TimeSlot
        fields = '__all__'
        
class SchedulePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchedulePool
        fields = '__all__'


class SchedulePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'
