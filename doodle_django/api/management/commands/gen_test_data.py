#Generate Dummy Data
from factory.django import DjangoModelFactory
from faker import Faker
from faker.providers import lorem, date_time

from django.utils.timezone import now, timedelta
from django.urls import reverse
from django.core.management.base import BaseCommand
from django.db import transaction

from api import models

url = reverse("api:api_meetings_create")

fake = Faker()
fake.add_provider(lorem)
fake.add_provider(date_time)

class MeetingFactory(DjangoModelFactory):

    title = fake.sentence(10)
    description = fake.sentence(40)
    location = fake.sentence(2)
    video_conferencing = True
    video_type_id = None
    duration = fake.time_delta(now() + timedelta(hours=5))
    final_date = fake.date_time_this_month(before_now=False, after_now=True, tzinfo=now().tzinfo)
    deadline = fake.date_time_this_month(before_now=False, after_now=True, tzinfo=now().tzinfo)
    creation_date = now()
    passcode = "TESTS"

    class Meta:
        model = models.Meeting

class Command(BaseCommand):
    help = "Generates test data"

    def add_arguments(self, parser):
        parser.add_argument(
                '-c',
                '--count',
                action='store',
                dest='count',
                type=int,
                default=1,
                help='Number of generated items')

    @transaction.atomic
    def handle(self, *args, **options):
        count = options['count']
        for _ in range(count):
            factory = MeetingFactory()