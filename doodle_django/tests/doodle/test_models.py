from datetime import date, timedelta, datetime

import pytest
from django.core.exceptions import ValidationError
from mixer.backend.django import mixer
from django.db.utils import IntegrityError

from doodle.models import UserFake, Meeting, SchedulePool, TimeSlot, Vote


@pytest.mark.django_db
def test_user_fake_valid_instance():
    # Test that creating a UserFake instance with valid data passes validation
    user_fake = mixer.blend(UserFake, name="John", surname="Doe", email="john.doe@example.com")
    user_fake.full_clean()  # This should not raise a ValidationError


@pytest.mark.django_db
def test_user_fake_invalid_email():
    # Test that creating a UserFake instance with an invalid email raises a ValidationError
    user = mixer.blend(UserFake, email="invalid_email")
    with pytest.raises(ValidationError) as e:
        user.full_clean()


@pytest.mark.django_db
def test_user_fake_null_name():
    # Test that creating a UserFake instance with a blank name raises a ValidationError
    with pytest.raises(IntegrityError) as e:
        user = mixer.blend(UserFake, name=None)


@pytest.mark.django_db
def test_user_fake_null_surname():
    # Test that creating a UserFake instance with a blank surname raises a ValidationError
    with pytest.raises(IntegrityError) as e:
        user = mixer.blend(UserFake, surname=None)


@pytest.mark.django_db
def test_user_fake_null_email():
    # Test that creating a UserFake instance with a blank email raises a ValidationError
    with pytest.raises(IntegrityError) as e:
        user = mixer.blend(UserFake, email=None)


@pytest.mark.django_db
def test_user_fake_unique_email():
    # Test that creating a UserFake instance with a non-unique email raises a ValidationError
    user1 = mixer.blend(UserFake, email="")
    with pytest.raises(IntegrityError) as e:
        user2 = mixer.blend(UserFake, email=user1.email)


@pytest.mark.django_db
def test_user_fake_email_length():
    # Test that creating a UserFake instance with an email exceeding the max length raises a ValidationError
    user = mixer.blend(UserFake, email="a" * 101)
    with pytest.raises(ValidationError) as e:
        user.full_clean()


@pytest.mark.django_db
def test_user_fake_email_valid():
    user = mixer.blend(UserFake, email="text@example.com")
    user.full_clean()


@pytest.mark.django_db
def test_user_fake_email_valid():
    user = mixer.blend(UserFake, name="Mario")
    user.full_clean()


@pytest.mark.django_db
def test_user_fake_email_valid():
    user = mixer.blend(UserFake, surname="Rossi")
    user.full_clean()


@pytest.mark.django_db
def test_user_fake_email_valid():
    user = mixer.blend(UserFake, email="text@example.com")
    user.full_clean()


@pytest.mark.django_db
def test_user_fake_valid():
    user = mixer.blend(UserFake, name="Mario", surname="Rossi", email="text@example.com")
    user.full_clean()


@pytest.mark.django_db
def test_user_fake_name_length():
    # Test that creating a UserFake instance with a name exceeding the max length raises a ValidationError
    user = mixer.blend(UserFake, name="a" * 21)
    with pytest.raises(ValidationError) as e:
        user.full_clean()


@pytest.mark.django_db
def test_user_fake_surname_length():
    # Test that creating a UserFake instance with a surname exceeding the max length raises a ValidationError
    user = mixer.blend(UserFake, surname="ThisIsAVeryLongSurnameThatExceedsMaxLength")
    with pytest.raises(ValidationError) as e:
        user.full_clean()


@pytest.mark.django_db
def test_meeting_valid_instance():
    # Test that creating a Meeting instance with valid data passes validation
    user_fake = mixer.blend(UserFake)
    meeting = mixer.blend(Meeting, user=user_fake)
    meeting.full_clean()  # This should not raise a ValidationError


@pytest.mark.django_db
def test_meeting_valid():
    user_fake = mixer.blend(UserFake)
    meeting = mixer.blend(Meeting, name="Meeting", description="Description", location="Location", duration=1, period_start_date=date.today(), period_end_date=date.today() + timedelta(days=7), user=user_fake)
    meeting.full_clean()


@pytest.mark.django_db
def test_meeting_null_name():
    # Test that creating a Meeting instance with a blank name raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(Meeting, name=None)


@pytest.mark.django_db
def test_meeting_long_name():
    # Test that creating a Meeting instance with a description exceeding the max length raises a ValidationError
    meeting = mixer.blend(Meeting, name="A" * 101)
    with pytest.raises(ValidationError) as e:
        meeting.full_clean()


@pytest.mark.django_db
def test_meeting_long_location():
    # Test that creating a Meeting instance with a description exceeding the max length raises a ValidationError
    meeting = mixer.blend(Meeting, location="A" * 101)
    with pytest.raises(ValidationError) as e:
        meeting.full_clean()



@pytest.mark.django_db
def test_meeting_long_description():
    # Test that creating a Meeting instance with a description exceeding the max length raises a ValidationError
    meeting = mixer.blend(Meeting, description="A" * 501)
    with pytest.raises(ValidationError) as e:
        meeting.full_clean()


@pytest.mark.django_db
def test_meeting_null_user():
    # Test that creating a Meeting instance with a blank user raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(Meeting, user=None)


@pytest.mark.django_db
def test_meeting_invalid_duration():
    # Test that creating a Meeting instance with a negative duration raises a ValidationError
    meeting = mixer.blend(Meeting, duration=-1)
    with pytest.raises(ValidationError) as e:
        meeting.full_clean()


@pytest.mark.django_db
def test_meeting_null_duration():
    # Test that creating a Meeting instance with a blank duration raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(Meeting, duration=None)


@pytest.mark.django_db
def test_meeting_null_period_start_date():
    # Test that creating a Meeting instance with a blank period_start_date raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(Meeting, period_start_date=None)


@pytest.mark.django_db
def test_meeting_invalid_period_start_date():
    # Test that creating a Meeting instance with a blank period_start_date raises a ValidationError
    with pytest.raises(ValidationError) as e:
        mixer.blend(Meeting, period_start_date="invalid_date")


@pytest.mark.django_db
def test_meeting_null_period_end_date():
    # Test that creating a Meeting instance with a blank period_end_date raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(Meeting, period_end_date=None)


@pytest.mark.django_db
def test_meeting_invalid_period_end_date():
    # Test that creating a Meeting instance with a blank period_end_date raises a ValidationError
    with pytest.raises(ValidationError) as e:
        mixer.blend(Meeting, period_end_date="invalid_date")


@pytest.mark.django_db
def test_schedule_pool_valid():
    # Create a valid SchedulePool instance
    meeting = mixer.blend(Meeting)
    voting_start_date = datetime.now()
    voting_deadline = voting_start_date + timedelta(days=7)

    schedule_pool = mixer.blend(SchedulePool, voting_start_date=voting_start_date, voting_deadline=voting_deadline, meeting=meeting)
    schedule_pool.full_clean()  # This should not raise a ValidationError


@pytest.mark.django_db
def test_schedule_pool_null_voting_start_date():
    # Test that creating a SchedulePool instance with a blank voting_start_date raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(SchedulePool, voting_start_date=None)


@pytest.mark.django_db
def test_schedule_pool_null_voting_deadline():
    # Test that creating a SchedulePool instance with a blank voting_deadline raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(SchedulePool, voting_deadline=None)


@pytest.mark.django_db
def test_schedule_pool_null_meeting():
    # Test that creating a SchedulePool instance with a blank meeting raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(SchedulePool, meeting=None)


@pytest.mark.django_db
def test_schedule_pool_invalid_voting_start_date():
    # Test that creating a SchedulePool instance with a blank voting_start_date raises a ValidationError
    with pytest.raises(ValidationError) as e:
        mixer.blend(SchedulePool, voting_start_date="invalid_date")


@pytest.mark.django_db
def test_schedule_pool_invalid_voting_deadline():
    # Test that creating a SchedulePool instance with a blank voting_deadline raises a ValidationError
    with pytest.raises(ValidationError) as e:
        mixer.blend(SchedulePool, voting_deadline="invalid_date")


@pytest.mark.django_db
def test_time_slot_valid():
    # Test that creating a valid TimeSlot instance passes validation
    schedule_pool = mixer.blend(SchedulePool)
    user_fake = mixer.blend(UserFake)

    start_time = datetime.now()
    end_time = start_time + timedelta(hours=1)

    time_slot = mixer.blend(TimeSlot, start_time=start_time, end_time=end_time,
                            schedule_pool=schedule_pool, user=user_fake)
    time_slot.full_clean()  # This should not raise a ValidationError


@pytest.mark.django_db
def test_time_slot_null_schedule_pool():
    # Test that creating a TimeSlot instance with a null schedule_pool raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(TimeSlot, schedule_pool=None)


@pytest.mark.django_db
def test_time_slot_null_user():
    # Test that creating a TimeSlot instance with a null user raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(TimeSlot, user=None)


@pytest.mark.django_db
def test_time_slot_null_start_time():
    # Test that creating a TimeSlot instance with a null start_time raises a ValidationError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(TimeSlot, start_time=None)


@pytest.mark.django_db
def test_time_slot_invalid_start_time():
    # Test that creating a TimeSlot instance with an invalid start_time raises a ValidationError
    with pytest.raises(ValidationError) as e:
        mixer.blend(TimeSlot, start_time="example")


@pytest.mark.django_db
def test_time_slot_null_end_time():
    # Test that creating a TimeSlot instance with a null end_time raises a ValidationError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(TimeSlot, end_time=None)


@pytest.mark.django_db
def test_time_slot_invalid_end_time():
    # Test that creating a TimeSlot instance with an invalid end_time raises a ValidationError
    with pytest.raises(ValidationError) as e:
        mixer.blend(TimeSlot, end_time="example")


@pytest.mark.django_db
def test_time_slot_duplicate_time_range():
    # Test that creating a TimeSlot instance with a duplicate time range raises a ValidationError
    schedule_pool = mixer.blend(SchedulePool)
    user_fake = mixer.blend(UserFake)

    start_time = datetime.now()
    end_time = start_time + timedelta(hours=1)

    # Create a TimeSlot with the same time range
    mixer.blend(TimeSlot, start_time=start_time, end_time=end_time, schedule_pool=schedule_pool, user=user_fake)

    with pytest.raises(IntegrityError) as e:
        mixer.blend(TimeSlot, start_time=start_time, end_time=end_time, schedule_pool=schedule_pool, user=user_fake)


@pytest.mark.django_db
def test_vote_valid():
    # Test that creating a valid Vote instance passes validation
    user_fake = mixer.blend(UserFake)
    schedule_pool = mixer.blend(SchedulePool)
    time_slot = mixer.blend(TimeSlot, schedule_pool=schedule_pool, user=user_fake)

    vote = mixer.blend(Vote, preference="First Choice", time_slot=time_slot, user=user_fake)
    vote.full_clean()  # This should not raise a ValidationError


@pytest.mark.django_db
def test_vote_null_preference():
    # Test that creating a Vote instance with a null preference raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(Vote, preference=None)


@pytest.mark.django_db
def test_vote_null_time_slot():
    # Test that creating a Vote instance with a null time_slot raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(Vote, time_slot=None)


@pytest.mark.django_db
def test_vote_null_user():
    # Test that creating a Vote instance with a null user raises a IntegrityError
    with pytest.raises(IntegrityError) as e:
        mixer.blend(Vote, user=None)


@pytest.mark.django_db
def test_vote_invalid_preference():
    # Test that creating a Vote instance with an invalid preference raises a ValidationError
    vote = mixer.blend(Vote, preference="a" * 101)

    with pytest.raises(ValidationError) as e:
        vote.full_clean()


@pytest.mark.django_db
def test_vote_duplicate_user_and_timeslot():
    # Test that creating a Vote instance with an invalid preference raises a ValidationError
    user_fake = mixer.blend(UserFake)
    schedule_pool = mixer.blend(SchedulePool)
    time_slot = mixer.blend(TimeSlot, schedule_pool=schedule_pool, user=user_fake)
    vote = mixer.blend(Vote, preference="First Choice", time_slot=time_slot, user=user_fake)

    with pytest.raises(IntegrityError) as e:
        mixer.blend(Vote, preference="Second Choice", time_slot=time_slot, user=user_fake)
