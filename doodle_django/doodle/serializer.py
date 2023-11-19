from rest_framework import serializers
from .models import *


class UserFakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFake
        fields = ['id' , 'name' , 'surname', 'email']
        extra_kwargs = {
            'name': {'required': False},
            'surname': {'required': False},
            'email': {'required': False},
        }
        
class TimeSlotSerializer(serializers.ModelSerializer):
    user = UserFakeSerializer()
    class Meta:
        model = TimeSlot
        fields = ['id', 'start_time', 'schedule_pool', 'end_time', 'user']
        
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user_instance = instance.user
            user_serializer = UserFakeSerializer(user_instance, data=user_data, partial=True)
            if user_serializer.is_valid():
                user_serializer.save()

        return super().update(instance, validated_data)
        

class SchedulePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchedulePool
        fields = ['id', 'voting_start_date', 'voting_deadline', 'meeting']
