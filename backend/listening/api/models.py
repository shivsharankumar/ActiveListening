
from django.db import models
from django.contrib.auth.models import User

# The ListeningLevel class represents a user's listening level with a specific date and level value.
class ListeningLevel(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    level=models.IntegerField(choices=[(1,'Internal Listening'),(2,'Focused Listening'),(3,'Global Listening')])
    date = models.DateField()
    def __str__(self):
        return f'{self.user} - {self.date} - {self.level}'

