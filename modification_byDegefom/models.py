from django.db import models
from django.utils import timezone

class Meeting(models.Model):
    title = models.CharField(max_length=100, blank=False)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    video_conferencing = models.BooleanField(default=False)
    duration = models.IntegerField(default=60)  # Assuming duration is in minutes
    date_time = models.DateTimeField(default=timezone.now)
    dead_line = models.DateTimeField(default=timezone.now)