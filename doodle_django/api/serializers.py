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
        
