# Generated by Django 4.2.7 on 2023-11-13 20:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('doodle', '0002_userfake_surname2'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userfake',
            name='surname2',
        ),
    ]