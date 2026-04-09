import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .words import WORDS

class GetRandomWordView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        word = random.choice(WORDS)
        return Response({'word': word})

class ValidateWordView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        word = request.data.get('word', '').upper()
        is_valid = word in WORDS
        return Response({'is_valid': is_valid})
