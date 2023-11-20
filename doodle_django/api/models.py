from django.db import models
from django.utils.timezone import *

from datetime import timedelta

class VideoType(models.Model):
    id = models.AutoField(
        primary_key=True,
        db_column="id"
    )
    name = models.CharField(
        db_column="name",
        max_length=100,
        blank=False,
        null=False,
    )

class TimeSlot(models.Model):
    id = models.BigAutoField(
        primary_key=True,
        db_column="id",
    )
    schedule_pool_id = models.ForeignKey(
        "SchedulePool",
        on_delete=models.CASCADE,
        blank=True,
        null=False,
    )
    start_date = models.DateTimeField(
        db_column="start_date",
        blank=False,
        null=False,
    )
    end_date = models.DateTimeField(
        db_column="end_date",
        blank=False,
        null=False,
    )
    

class Meeting(models.Model):
    id = models.BigAutoField(
        primary_key=True,
        db_column="id",
    )
    title = models.CharField(
        db_column="title",
        max_length=100,
        blank=False,
        null=False,
    )
    description = models.CharField(
        db_column="description",
        max_length=500,
        blank=True,
        null=True,
    )
    location = models.CharField(
        db_column="location",
        max_length=100,
        blank=True,
        null=True,
    )
    video_conferencing = models.BooleanField(
        db_column="video_conferencing",
    )
    video_type_id = models.ForeignKey(
        VideoType,
        on_delete=models.SET_NULL,
        db_column="video_type_id",
        blank=True,
        null=True,
    )
    duration = models.DurationField(
        db_column="duration",
        blank=False,
        null=False,
    )
    final_date = models.ForeignKey(
        TimeSlot, 
        on_delete=models.SET_NULL,
        db_column="final_date",
        blank=True,
        null=True,
    )
    deadline = models.DateTimeField(
        db_column="deadline",
        blank=False,
        null=False,
    )
    creation_date = models.DateTimeField(
        db_column="creation_date",
       auto_now_add=True
    )
    passcode = models.CharField(
        db_column="passcode",
        max_length=5,
        blank=False,
        null=False
    )

class SchedulePool(models.Model):
    id = models.AutoField(
        primary_key=True,
        db_column="id"
    )
    voting_start_date = models.DateTimeField()
    voting_deadline = models.DateTimeField()
    meeting = models.ForeignKey(
        to=Meeting,
        on_delete=models.CASCADE,
    )

class Vote(models.Model):
    id = models.AutoField(
        primary_key=True,
        db_column="id"
    )
    preference = models.CharField(
        db_column="preference",
        max_length=100
    )
    time_slot = models.ForeignKey(
        db_column="time_slot",
        to=TimeSlot,
        on_delete=models.CASCADE
    )
