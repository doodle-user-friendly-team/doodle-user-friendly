from django.db import models

class Meeting(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    video_conferencing = models.BooleanField()
    duration = models.PositiveIntegerField()
    date_and_time=models.DateTimeField()
    deadline = models.DateTimeField()

    def __str__(self):
        return self.title
 