from django.urls import path

from . views import *

app_name="api"

urlpatterns = [
    path("meetings/", api_meetings, name="api_meetings",),
    path("meetings/new/", api_meetings_create, name="api_meetings_create"),
    path("meetings/<str:meeting_id>/", api_meetings_edit, name="api_meetings_edit"),
    path("meetings/<str:meeting_id>/delete/", api_meetings_delete, name="api_meetings_delete"),
]
