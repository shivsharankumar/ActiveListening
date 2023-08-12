from django.urls import path
from api import views

app_name = 'api'
urlpatterns = [
    path('csrf/',views.csrf),
    path('login/',views.login_view),
    path('logout/',views.logout_view),
    path('logged_in/',views.is_logged_in),
    path('save-listening-level/', views.save_listening_level, name='save-listening-level'),
    path('get-label-options/', views.get_label_options, name='get-label-options'),
    path('listening-levels/', views.date_level_list, name='date_level_list'),
    path('delete-listening-levels/', views.delete_listening_levels, name='delete-listening-levels'),
    
]