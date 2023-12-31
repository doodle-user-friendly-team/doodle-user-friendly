# Generated by Django 4.2.7 on 2023-12-03 17:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.CharField(db_column='name', max_length=100)),
                ('description', models.CharField(db_column='description', max_length=500, null=True)),
                ('location', models.CharField(db_column='location', max_length=100, null=True)),
                ('duration', models.IntegerField(db_column='duration')),
                ('period_start_date', models.DateField(db_column='period_start_date')),
                ('period_end_date', models.DateField(db_column='period_end_date')),
                ('organizer_link', models.CharField(db_column='organizer_link', max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SchedulePool',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('voting_start_date', models.DateTimeField(db_column='voting_start_date')),
                ('voting_deadline', models.DateTimeField(db_column='voting_deadline')),
                ('pool_link', models.CharField(db_column='pool_link', max_length=100, null=True)),
                ('meeting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='doodle.meeting')),
            ],
        ),
        migrations.CreateModel(
            name='UserFake',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.CharField(db_column='name', max_length=100)),
                ('surname', models.CharField(db_column='surname', max_length=100)),
                ('email', models.CharField(db_column='email', max_length=100, unique=True)),
                ('auth_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TimeSlot',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('start_time', models.DateTimeField(db_column='start_time', default=None)),
                ('end_time', models.DateTimeField(db_column='end_time', default=None)),
                ('schedule_pool', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='doodle.schedulepool')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='doodle.userfake')),
            ],
            options={
                'unique_together': {('start_time', 'end_time')},
            },
        ),
        migrations.AddField(
            model_name='meeting',
            name='user',
            field=models.ForeignKey(db_column='user', on_delete=django.db.models.deletion.CASCADE, to='doodle.userfake'),
        ),
        migrations.CreateModel(
            name='Vote',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('preference', models.CharField(db_column='preference', max_length=100)),
                ('time_slot', models.ForeignKey(db_column='time_slot', on_delete=django.db.models.deletion.CASCADE, to='doodle.timeslot')),
                ('user', models.ForeignKey(db_column='user', on_delete=django.db.models.deletion.CASCADE, to='doodle.userfake')),
            ],
            options={
                'unique_together': {('time_slot', 'user')},
            },
        ),
    ]
