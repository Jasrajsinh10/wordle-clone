from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True, blank=False, null=False)
    email = models.EmailField(unique=True)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)

    @property
    def total_games(self):
        return self.wins + self.losses

    @property
    def win_percentage(self):
        total = self.total_games
        if total == 0:
            return 0
        return round((self.wins / total) * 100, 2)

    def __str__(self):
        return self.username
