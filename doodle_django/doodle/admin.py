from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Meeting)
admin.site.register(SchedulePool)
admin.site.register(UserFake)
admin.site.register(TimeSlot)
admin.site.register(Vote)


