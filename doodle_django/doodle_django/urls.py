from django.contrib import admin
from django.urls import path, include
from doodle.views import *
from django.contrib.auth.views import LogoutView

from rest_framework import routers

votes = routers.DefaultRouter()
users = routers.DefaultRouter()
meeting = routers.DefaultRouter()
timeslots = routers.DefaultRouter()
schedule_pool = routers.DefaultRouter()

votes.register(r'', VotesView, basename='Vote')
users.register(r'', UserView, basename='UserFake')
meeting.register(r'', MeetingView, basename='Meeting')
timeslots.register(r'', TimeSlotView, basename='TimeSlot')
schedule_pool.register(r'', SchedulePoolView, basename='SchedulePool')


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/votes/", include(votes.urls)),
    path("api/v1/users/", include(users.urls)),
    path("api/v1/meetings/", include(meeting.urls)),
    path("api/v1/timeslots/", include(timeslots.urls)),
    path("api/v1/schedulepool/", include(schedule_pool.urls)),

    # roba da controllare altrimenti va eliminata
    path('logout/', LogoutView.as_view()),
    path('accounts/', include('allauth.urls')),
    path("api-auth/", include("rest_framework.urls")),
    path("api/v1/auth/", include("dj_rest_auth.urls")),
    path("api/v1/authenticatedMeetings/", AuthMeetingView.as_view()),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/v1/authenticate/', djangoUsers.as_view(), name='user_authentication'),
]
