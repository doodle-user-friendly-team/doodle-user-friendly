import string
import random
from .models import *


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