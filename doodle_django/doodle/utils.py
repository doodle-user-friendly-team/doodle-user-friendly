import string
import random
from datetime import timedelta

from django.template.loader import render_to_string
from django.utils.html import strip_tags

from .models import *
from django.core.mail import send_mail, EmailMultiAlternatives


def genera_stringa_casuale(lunghezza):
    caratteri = string.ascii_letters + string.digits
    return ''.join(random.choice(caratteri) for _ in range(lunghezza))


def genera_codice_recap():
    link = ""
    while True:
        link = genera_stringa_casuale(10)
        if not Meeting.objects.filter(organizer_link=link).exists():
            break
    return link


def genera_codice_invito():
    link = ""
    while True:
        link = genera_stringa_casuale(10)
        if not SchedulePool.objects.filter(pool_link=link).exists():
            break
    return link


def send_meeting_creation_email(meeting):
    link_organizer = "http://localhost:3000/recap-meeting/" + meeting.organizer_link

    context = {
        "user_name": meeting.user.name,
        "name": meeting.name,
        "meeting_link": link_organizer,
    }

    subject = "Doodle - Meeting created."
    html_message = render_to_string("content/meeting_created.html", context=context)
    plain_message = strip_tags(html_message)
    message = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        from_email=None,
        to=[meeting.user.email],
    )

    message.attach_alternative(html_message, "text/html")
    message.send()


def send_timeslot_creation_email(schedule_pool, timeslot):

    users_emails = []

    date = timeslot.start_time.strftime("%d/%m/%Y")
    time = timeslot.start_time.strftime("%H:%M") + " - " + timeslot.end_time.strftime("%H:%M")

    for ts in schedule_pool.timeslot_set:
        if ts.user.email not in users_emails and ts.user.email != timeslot.user.email:
            users_emails.append(ts.user.email + " " + ts.user.name)
        for p in ts.vote_set:
            if p.user.email not in users_emails and p.user.email != timeslot.user.email:
                users_emails.append(p.user.email + " " + p.user.name)

    link_participant = "http://localhost:3000/vote/" + schedule_pool.pool_link

    for u in users_emails:

        splitted_data = u.split(" ")

        context = {
            "user_name": splitted_data[1],
            "name": schedule_pool.meeting.name,
            "date": date,
            "time": time,
            "vote_link": link_participant,
        }

        subject = "Doodle - TimeSlot created."
        html_message = render_to_string("content/timeslot_created.html", context=context)
        plain_message = strip_tags(html_message)
        message = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=None,
            to=[splitted_data[0]],
        )

        message.attach_alternative(html_message, "text/html")
        message.send()


def send_preference_creation_email(vote):
    link_participant = "http://localhost:3000/vote/" + vote.time_slot.schedule_pool.pool_link

    context = {
        "user_name": vote.timeslot.user.name,
        "meeting_name": vote.timeslot.schedule_pool.meeting.name,
        "preference": vote.preference,
        "vote_link": link_participant,
    }

    subject = "Doodle - Preference created."
    html_message = render_to_string("content/preference_created.html", context=context)
    plain_message = strip_tags(html_message)
    message = EmailMultiAlternatives(
        subject=subject,
        body=plain_message,
        from_email=None,
        to=[vote.timeslot.user.email],
    )

    message.attach_alternative(html_message, "text/html")
    message.send()


def send_meeting_invitation_email(emails, meeting_id):

    meeting = Meeting.objects.get(id=meeting_id)
    schedule_pool = SchedulePool.objects.get(meeting=meeting)
    link_participant = "http://localhost:3000/schedulePool/" + schedule_pool.pool_link

    for e in emails:
        print(e)
        context = {
            "meeting_name": meeting.name,
            "pool_link": link_participant,
        }

        subject = "Doodle - Meeting invitation."
        html_message = render_to_string("content/meeting_invitation.html", context=context)
        plain_message = strip_tags(html_message)
        message = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=None,
            to=[e],
        )

        message.attach_alternative(html_message, "text/html")
        message.send()


def send_meeting_date_decision_email(schedule_pool):

    users_emails = []

    date = schedule_pool.final_date.strftime("%d/%m/%Y")
    start_time = schedule_pool.final_date.strftime("%H:%M")
    end = schedule_pool.final_date + timedelta(minutes=schedule_pool.meeting.duration)
    end_time = end.strftime("%H:%M")

    for ts in schedule_pool.timeslot_set:
        if ts.user.email not in users_emails:
            users_emails.append(ts.user.email)
        for p in ts.vote_set:
            if p.user.email not in users_emails:
                users_emails.append(p.user.emails)

    for u in users_emails:

        context = {
            "meeting_name": schedule_pool.meeting.name,
            "final_date": date,
            "final_time": start_time,
        }

        subject = "Doodle - Final date decision."
        html_message = render_to_string("content/final_date_decision.html", context=context)
        plain_message = strip_tags(html_message)
        message = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=None,
            to=[u],
        )

        message.attach_alternative(html_message, "text/html")
        message.send()
