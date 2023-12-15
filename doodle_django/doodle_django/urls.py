from django.contrib import admin
from django.urls import path, include
from doodle.views import *
from django.contrib.auth.views import LogoutView

from rest_framework import routers

meeting = routers.DefaultRouter()
meeting.register(r'details/', MeetingView, basename='Meeting')
meeting.register(r'', MeetingView, basename='Meeting')

timeslots = routers.DefaultRouter()
timeslots.register(r'', TimeSlotView, basename='TimeSlot')
timeslots.register(r'meeting/', TimeSlotView, basename='TimeSlot')
timeslots.register(r'id/', TimeSlotView, basename='TimeSlot')

schedule_pool = routers.DefaultRouter()
schedule_pool.register(r'', SchedulePoolView, basename='SchedulePool')
schedule_pool.register(r'timeslots/', SchedulePoolView, basename='SchedulePool')
schedule_pool.register(r'user/', SchedulePoolView, basename='SchedulePool')

votes = routers.DefaultRouter()
votes.register(r'', VotesView, basename='Vote')
votes.register(r'timeslot/', VotesView, basename='Vote')
votes.register(r'update_preference/', VotesView, basename='Vote')

users = routers.DefaultRouter()
users.register(r'', UserView, basename='UserFake')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/votes/", include(votes.urls)),
    path("api/v1/users/", include(users.urls)),
    path("api/v1/meetings/", include(meeting.urls)),
    path("api/v1/timeslots/", include(timeslots.urls)),
    path("api/v1/schedulepool/", include(schedule_pool.urls)),

    # roba da controllare altrimenti va eliminata
    path("api/v1/authenticatedMeetings/", AuthMeetingView.as_view()),
    path('api/v1/authenticate/', djangoUsers.as_view(), name='user_authentication'),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    path("api-auth/", include("rest_framework.urls")),
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    path('accounts/', include('allauth.urls')),
    path('logout/', LogoutView.as_view()),
]
