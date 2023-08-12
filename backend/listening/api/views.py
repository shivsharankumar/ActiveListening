import json
from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import authenticate,login,logout
from django.middleware.csrf import get_token as get_csrf_token
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from .models import ListeningLevel
from datetime import datetime

@never_cache
def csrf(request):
    return JsonResponse({'csrfToken':get_csrf_token(request)})

@never_cache
@csrf_exempt
def login_view(request):
    print("request",request.body,request)
    request_body = json.loads(request.body)
    username = request_body.get('username')
    password = request_body.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"detail": "Success",
        "status": 200,
        'user': f"{user.first_name} {user.last_name}"},
        status=200)
    return JsonResponse({"detail": "Invalid credentials",
    "status": 400},
    status=400)

@never_cache
@csrf_exempt
def is_logged_in(request):
    print("request",request.user,request.user.first_name,request.user.is_authenticated)
    user = request.user
    first_name = ''
    last_name = ''


    if user.is_authenticated:
        first_name = user.first_name
        last_name = user.last_name


    return JsonResponse({"is_authenticated": user.is_authenticated,
    "status": 200,
    'user': f"{first_name} {last_name}"
    })



def logout_view(request):
    logout(request)
    return JsonResponse({"detail": "Success", "status": 200}, status=200)

def get_label_options(request):
    label_choices = ListeningLevel.level.field.choices
    return JsonResponse({"label_options": label_choices})



@csrf_exempt
def save_listening_level(request):
    if request.method == "POST":
        data = json.loads(request.body)
        level = data.get("level")
        date_str = data.get("date")
        print("date_str",date_str)

        if level is not None and date_str is not None:
            try:
                date = datetime.strptime(date_str, "%Y-%m-%d").date()
                print(date,"date")
            except ValueError:
                return JsonResponse({"message": "Invalid date format."}, status=400)

            user = request.user  # Assuming you're handling user authentication properly
            
            # Check if a record with the same date exists for the user
            if ListeningLevel.objects.filter(user=user, date=date).exists():
                response_data = {"message": "Data for this date already exists.","status":201}
                return JsonResponse(response_data, status=201)
            print(date,"date")
            ListeningLevel.objects.create(user=user, level=level, date=date)
            return JsonResponse({"message": "Data saved successfully.","status":200}, status=200)
        else:
            return JsonResponse({"message": "Invalid data provided.","status":400}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method.","status":400}, status=405)

@csrf_exempt
def date_level_list(request):
    listening_levels = ListeningLevel.objects.all()
    print("listening_level---->",listening_levels)
    dates_with_levels = {}

    for listening_level in listening_levels:
        print("listening_level",listening_level)
        date_str = listening_level.date.strftime('%Y-%m-%d')  # Convert date to string
        level = listening_level.get_level_display()

        if date_str not in dates_with_levels:
            dates_with_levels[date_str] = []

        dates_with_levels[date_str].append(level)

    return JsonResponse({'dates_with_levels': dates_with_levels})

@csrf_exempt
def delete_listening_levels(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            date_to_delete = data.get('date')

            if date_to_delete:
                # Delete records with the specified date
                deleted_count, _ = ListeningLevel.objects.filter(date=date_to_delete).delete()
                
                return JsonResponse({"message": f"Deleted {deleted_count} records with date {date_to_delete}"})
            else:
                return JsonResponse({"error": "Invalid data format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)
