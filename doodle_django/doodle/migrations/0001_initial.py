# Generated by Django 4.2.7 on 2023-11-17 16:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.CharField(db_column='name', default='', max_length=100)),
                ('description', models.CharField(db_column='description', default='', max_length=500)),
            ],
        ),
        migrations.CreateModel(
            name='SchedulePool',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('voting_start_date', models.DateTimeField()),
                ('voting_deadline', models.DateTimeField()),
                ('meeting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='doodle.meeting')),
            ],
        ),
        migrations.CreateModel(
            name='UserFake',
            fields=[
                ('id', models.AutoField(db_column='id', primary_key=True, serialize=False)),
                ('name', models.CharField(db_column='name', max_length=100)),
                ('surname', models.CharField(db_column='surname', max_length=100)),
                ('email', models.CharField(db_column='email', max_length=100)),
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
