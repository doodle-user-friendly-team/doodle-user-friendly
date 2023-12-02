"""
URL configuration for doodle_django project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from doodle.views import *
from rest_framework.documentation import include_docs_urls
from rest_framework.schemas import get_schema_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("meetings/", MeetingView.as_view()),
    path("authenticatedMeetings/", AuthMeetingView.as_view()),
    path("meetings/<str:link>", MeetingDetailView.as_view(), name="meeting_detail"),
    path("schedulePools/<str:link>", SchedulePoolView.as_view(), name="schedulepool_detail"),
    path('timeslots/', TimeSlotView.as_view()),
    path('timeslots/<int:pk>', UpdateTimeSlotView.as_view(), name='updateTimeSlot' ),
    path('timeslots/authorized' , CheckUser.as_view()),
    path('votes/', VotesView.as_view(), name="votes_api"),
    path('timeslots/id/<str:time_slot_id>/', get_timeslot, name='timeslot_detail'),
    path('meetings/timeslots/<str:link>/', MeetingTimeSlotsView.as_view(), name='timeslot_list'),
    path('votes/timeslot/<str:time_slot_id>/', get_preferences, name='timeslot_vote_list'),
    path('api/update_preference/', ModifyMyPreferenceView.as_view(),name='update_preference'),
    path('users/<int:user_id>', UserByIdView.as_view(), name='get_user_by_id'),
    path('authenticate/', UserAuthenticationView.as_view(), name='user_authentication'),
    path('register/', UserRegistrationView.as_view(), name='register_user'),

    # add react path
    # but I think it's better to do it when we have finished the website
    # since we have to build the react app first

]
