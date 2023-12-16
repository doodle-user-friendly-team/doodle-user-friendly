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


    path('api/v1/top_timeslots/<str:link>', TopTimeSlotsView.as_view(), name='top_timeslots'),

    path('api/v1/timeslots/id/<int:time_slot_id>', get_timeslot, name='timeslot_vote_list'),
    path('api/v1/schedule_pool/<str:link>', SchedulePoolView.as_view(), name='schedule_pool'),
    path('api/v1/schedule_pool/timeslots/<int:schedule_pool_id>', get_timeslot_from_schedule_pool, name='timeslot_from_sschedule_pool'),

    path('api/v1/update_preference/', ModifyMyPreferenceView.as_view(),name='update_preference'),
    path('api/v1/votes/timeslot/<str:time_slot_id>', get_preferences, name='timeslot_vote_list'),

    path('api/v1/users/<int:user_id>', UserByIdView.as_view(), name='get_user_by_id'),
    path('api/v1/users/schedulepool/<int:user_id>', get_schedule_pool_from_user_id, name='get_schedule_pool_from_user_id'),

    path('accounts/', include('allauth.urls')),
    path('logout', LogoutView.as_view()),

    # add react path
    # but I think it's better to do it when we have finished the website
    # since we have to build the react app first

    path('send_link_by_email/<int:meeting_id>/', send_link_by_email, name='send_link_by_email'),
]
