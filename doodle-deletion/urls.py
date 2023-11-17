from django.urls import path
from . import views

urlpatterns = [
    # ... other URL patterns ...
    # path('modify-meeting/<int:meeting_id>/', views.modify_meeting, name='modify_meeting'),
    path('delete-meeting/<int:meeting_id>/', views.delete_meeting, name='delete_meeting'),
    path('meeting_detail/<int:meeting_id>/', views.meeting_detail, name='meeting_detail'),
    # ... other URL patterns ...
]

