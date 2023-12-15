import pytest
from django.core.exceptions import ValidationError
from mixer.backend.django import mixer
from django.db.utils import IntegrityError

from doodle.models import UserFake


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
    user = mixer.blend(UserFake, name=None)
    with pytest.raises(IntegrityError) as e:
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
def test_user_fake_lowercase_email():
    # Test that email is stored in lowercase
    user_fake = mixer.blend(UserFake, email="Test@Example.com")
    assert user_fake.email == "test@example.com"