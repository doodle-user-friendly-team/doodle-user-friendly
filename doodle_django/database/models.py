from django.db import models

#python manage.py makemigrations doodle_database
#python manage.py migrate doodle_database
#pip3 install psycopg

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    email = models.CharField(max_length=200)

class RegUser(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    password = models.CharField(max_length=200)
class Meeting(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    duration = models.IntegerField()
    time_limit = models.IntegerField()
    end_time_range = models.IntegerField()
    start_time_range = models.IntegerField()
    date = models.DateField()
    
    #place = models.CharField(max_length=200)
    #description = models.CharField(max_length=200)

class TimeSlot(models.Model):
    timeslot_id = models.AutoField(primary_key=True)
    meeting_id = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    user_id = models.ForeignKey(RegUser, on_delete=models.CASCADE)
    start_time = models.IntegerField()
    end_time = models.IntegerField()
    
class Vote(models.Model):
    timeslot_id = models.ForeignKey(TimeSlot, on_delete=models.CASCADE)
    user_id = models.ForeignKey(RegUser, on_delete=models.CASCADE)
    vote = models.IntegerField()
