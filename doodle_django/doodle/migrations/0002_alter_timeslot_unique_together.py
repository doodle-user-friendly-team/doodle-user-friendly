# Generated by Django 4.2.7 on 2023-11-17 16:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('doodle', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='timeslot',
            unique_together={('start_time', 'end_time')},
        ),
    ]
