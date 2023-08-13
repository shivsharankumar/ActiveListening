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
"""
    The function returns a JSON response containing a CSRF token.
    
    :param request: The `request` parameter is an object that represents the HTTP request made by the
    client. It contains information such as the request method (GET, POST, etc.), headers, cookies, and
    query parameters. In this code snippet, the `request` parameter is used to generate a CSRF token
    :return: A JSON response containing a dictionary with a key "csrfToken" and its corresponding value,
    which is the CSRF token obtained from the "get_csrf_token" function.
"""
@never_cache
def csrf(request):
    return JsonResponse({'csrfToken':get_csrf_token(request)})

    """
    The below function is a login view in Python that takes a username and password from a request,
    authenticates the user, and returns a JSON response indicating success or failure.
    
    :param request: The `request` parameter is an object that represents the HTTP request made by the
    client. It contains information such as the request method, headers, body, and user session
    :return: The code is returning a JSON response. If the user is successfully authenticated, it
    returns a JSON response with a "detail" key set to "Success", a "status" key set to 200, and a
    "user" key set to the full name of the authenticated user. If the user is not authenticated, it
    returns a JSON response with a "detail" key set to "Invalid credentials
    """
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
"""
    The function `is_logged_in` checks if a user is logged in and returns their authentication status
    and full name in a JSON response.
    
    :param request: The `request` parameter is an object that represents the HTTP request made by the
    client. It contains information such as the request method, headers, body, and user authentication
    details
    :return: a JSON response with the following keys and values:
    - "is_authenticated": a boolean value indicating whether the user is authenticated or not
    - "status": the HTTP status code (200 in this case)
    - "user": a string containing the first name and last name of the user, separated by a space. If the
    user is not authenticated, this string will be empty.
"""
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


"""
    The above function logs out the user and returns a JSON response indicating success.
    
    :param request: The `request` parameter is an object that represents the HTTP request made by the
    client. It contains information about the request, such as the method (GET, POST, etc.), headers,
    user session, and any data sent with the request. In this case, the `request` object is used
    :return: a JSON response with the message "Success" and the status code 200.
"""
def logout_view(request):
    logout(request)
    return JsonResponse({"detail": "Success", "status": 200}, status=200)

def get_label_options(request):
    """
    The function "get_label_options" returns the choices available for a field called "level" in the
    "ListeningLevel" model as a JSON response.
    
    :param request: The `request` parameter is an object that represents the HTTP request made by the
    client. It contains information such as the HTTP method, headers, and any data sent in the request.
    In this case, it is used to retrieve the available choices for a field called `level` in the
    `Listening
    :return: a JSON response containing the label options.
    """
    label_choices = ListeningLevel.level.field.choices
    return JsonResponse({"label_options": label_choices})


"""
The function `save_listening_level` saves a user's listening level for a given date, and returns a
JSON response indicating the success or failure of the operation.

:param request: The `request` parameter is an object that represents the HTTP request made to the
server. It contains information about the request, such as the method used (GET, POST, etc.),
headers, and body
:return: a JSON response with a message and status code. The specific response depends on the
conditions and data provided in the request.
"""
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

"""
    The function `date_level_list` retrieves a list of listening levels and organizes them by date,
    returning a JSON response with the dates and their corresponding levels.
    
    :param request: The `request` parameter is an object that represents the HTTP request made by the
    client. It contains information such as the request method, headers, and body. In this code snippet,
    the `request` parameter is not used, so it can be removed if it is not needed
    :return: a JSON response containing a dictionary with the key 'dates_with_levels' and the value
    being a dictionary of dates as keys and a list of listening levels as values.
"""
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

"""
    The `delete_listening_levels` function deletes records from the ListeningLevel model based on a
    specified date.
    
    :param request: The `request` parameter is an object that represents the HTTP request made to the
    server. It contains information about the request, such as the request method (e.g., GET, POST),
    headers, body, and other relevant data. In this code snippet, the `request` parameter is used to
    :return: a JSON response. If the request method is POST and the data is valid, it returns a JSON
    response with a success message indicating the number of records deleted. If the request method is
    not POST, it returns a JSON response with an error message indicating an invalid request method. If
    there is an exception during the execution of the function, it returns a JSON response with an error
    message
"""
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
