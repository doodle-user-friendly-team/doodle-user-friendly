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
from django.contrib.auth.views import LogoutView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/meetings/", MeetingView.as_view()),
    path("api/v1/meetings/timeslots/<str:link>", MeetingTimeSlotsView.as_view()),
    path("api/v1/meetings/<str:link>", MeetingDetailView.as_view(), name="meeting_detail"),
    path("api/v1/authenticatedMeetings/", AuthMeetingView.as_view()),
    path("api-auth/", include("rest_framework.urls")),
    path("api/v1/auth/", include("dj_rest_auth.urls")),

    path('api/v1/timeslots/', TimeSlotView.as_view({'get': 'get_all'})),
    path('api/v1/timeslots/<str:_data>', TimeSlotView.as_view({'get': 'get_data'})),

    path('api/v1/timeslots/id/<int:time_slot_id>', get_timeslot, name='timeslot_vote_list'),

    path('api/v1/votes/', VotesView.as_view(), name="votes_api"),
    path('api/v1/update_preference/', ModifyMyPreferenceView.as_view(),name='update_preference'),
    path('api/v1/votes/timeslot/<str:time_slot_id>', get_preferences, name='timeslot_vote_list'),

    path('api/v1/users/<int:user_id>', UserByIdView.as_view(), name='get_user_by_id'),

    path('api/v1/authenticate/', djangoUsers.as_view(), name='user_authentication'),
    path('api/v1/auth/registration/', include('dj_rest_auth.registration.urls')),

    path('accounts/', include('allauth.urls')),
    path('logout', LogoutView.as_view()),

    # add react path
    # but I think it's better to do it when we have finished the website
    # since we have to build the react app first
]
