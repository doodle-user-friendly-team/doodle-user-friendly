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
    path("docs/", include_docs_urls(title="Doodle API")),
    path("schema/", get_schema_view(title="Doodle API")),
    path('timeslots/', TimeSlotView.as_view()),
    path('votes/timeslot/<str:time_slot_id>/', VoteView.get, name='vote_list'),
    path('votes/create/', VoteView.post, name='vote_create'),
]
