# ActiveListening
Listening deeply is an important skill in today’s world. I developed an easy tool
that allows the participants to record their listening level once in a day. It could be at the end of
the day, before or after a team-meeting or a one-one check in or any other instance.

Features
The application should have the following features:
● Recording of listening level: The application provides an easy-to-use interface for
users to record their listening level. The user now be able to select their level of listening
from a predefined list of levels
● Record keeping: The application store the listening level data for each user and
allow them to view their historical data over time. The application also allow users
to delete their data if they choose to.
● UI/UX design: The application have a clean and intuitive user interface that is easy
to navigate and understand. The design is responsive, and the application is accessible from different devices.
● Backend: The application should have a backend that stores user data and provides an API
for the frontend.
User authentication and authorization: The application should allow users to log in and
manage their accounts. Only authenticated users should be able to record their listening
level.
we have following dashboard :-
1.Login:- https://github.com/shivsharankumar/ActiveListening/blob/main/screenshot/login.png
2.Home:- https://github.com/shivsharankumar/ActiveListening/blob/main/screenshot/Home.png
3.Analysis:- https://github.com/shivsharankumar/ActiveListening/blob/main/screenshot/Analysis.png

here In Home You Can add your listening levels data with respect to the data if you select the data for the same data you will find the below ss:- https://github.com/shivsharankumar/ActiveListening/blob/main/screenshot/DataValidation.png

in Analysis Part You can see that you an analyse data based on your input History SS with dashboard:- https://github.com/shivsharankumar/ActiveListening/blob/main/screenshot/AnalysisWithDashboard.png
And Here you will select the Graph Type As well SS Below:- https://github.com/shivsharankumar/ActiveListening/blob/main/screenshot/AnalysisWithBar.png

step to run Backend:-
1. cd backend
2. install virtualenv and create and activate it .
3. pip3 install -r requirements.txt
4. listening/python manage.py runserver
5. migrate it with python manage.py makemigrations and python manage.py migrate

   
steps to run frontend:-
1. cd frontend
2. npm i
3. run application using npm run dev or npm run dev:local

now you are ready to use the application.

