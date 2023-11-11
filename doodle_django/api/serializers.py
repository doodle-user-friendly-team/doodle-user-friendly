from rest_framework import serializers
from django.utils.timezone import *

from django.core.validators import *

from . models import *

class MeetingSerializer(serializers.ModelSerializer):

    def validate(self, data):
        if 'end_date' in data and 'start_date' in data:
            if data['end_date'] < data['start_date']:
                raise serializers.ValidationError("end_date must occur after start_date", code="EndDateBeforeStartDate")

            if data['start_date'] < now():
                raise serializers.ValidationError("start_date must not be in the past", code="StartDateInThePast")
        return data

    class Meta:
        model = Meeting
        fields = '__all__'