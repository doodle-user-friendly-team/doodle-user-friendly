from django.urls import path
from .views import confirm_delete_meeting, delete_meeting, meeting_list, modify_meeting

urlpatterns = [
    path('list/', meeting_list, name='meeting_list'),
    path('modify/<int:meeting_id>/', modify_meeting, name='modify_meeting'),
    path('delete_meeting/<int:meeting_id>/', delete_meeting, name='delete_meeting'),
    path('confirm_delete_meeting/<int:meeting_id>/', confirm_delete_meeting, name='confirm_delete_meeting'),
     
    
    # Other URL patterns...
]
