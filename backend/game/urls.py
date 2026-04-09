from django.urls import path
from .views import GetRandomWordView, ValidateWordView

urlpatterns = [
    path('random-word/', GetRandomWordView.as_view(), name='random_word'),
    path('validate-word/', ValidateWordView.as_view(), name='validate_word'),
]
