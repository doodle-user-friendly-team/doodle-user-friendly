from django.contrib.auth import get_user_model
from django.db import models


class UserFake(models.Model):
    id = models.AutoField(
        primary_key=True,
        db_column="id"
    )
    name = models.CharField(
        db_column="name",
        max_length=100,
    )
    surname = models.CharField(
        db_column="surname",
        max_length=100,
    )
    email = models.CharField(
        db_column="email",
        max_length=100,
        unique = True
    )
    auth_user = models.ForeignKey(
        to=get_user_model(),
        on_delete=models.CASCADE,
        null=True
    )
    

class Meeting(models.Model):
    id = models.AutoField(
        primary_key=True,
        db_column="id"
    )
    name = models.CharField(
        db_column="name",
        max_length=100,
        null=False
    )
    description = models.CharField(
        db_column="description",
        max_length=500,
        null=True
    )
    location = models.CharField(
        db_column="location",
        max_length=100,
        null=True
    )
    duration = models.IntegerField(
        db_column="duration",
        blank=False,
        null=False
    )
    period_start_date = models.DateField(
        db_column="period_start_date",
        blank=False,
        null=False
    )
    period_end_date = models.DateField(
        db_column="period_end_date",
        blank=False,
        null=False
    )
    user = models.ForeignKey(
        db_column="user",
        to=UserFake,
        on_delete=models.CASCADE
    )
    organizer_link = models.CharField(
        db_column="organizer_link",
        max_length=100,
        null=True
    )


class SchedulePool(models.Model):
    id = models.AutoField(
        primary_key=True,
        db_column="id"
    )
    voting_start_date = models.DateTimeField(
        db_column="voting_start_date"
    )
    voting_deadline = models.DateTimeField(
        db_column="voting_deadline"
    )
    pool_link = models.CharField(
        db_column="pool_link",
        max_length=100,
        null=True
    )
    meeting = models.ForeignKey(
        to=Meeting,
        on_delete=models.CASCADE,
    )


class TimeSlot(models.Model):
    id = models.AutoField(
        primary_key=True,
        db_column="id"
    )
    start_time = models.DateTimeField(
        db_column="start_time",
        default=None
    )
    end_time = models.DateTimeField(
        db_column="end_time",
        default=None
    )
    schedule_pool = models.ForeignKey(
        to=SchedulePool,
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        to=UserFake,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ("start_time", "end_time")


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
    user = models.ForeignKey(
        db_column="user",
        to=UserFake,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ('time_slot', 'user')
        
        
