import os
import django
import sys

# Set up Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from users.serializers import RegisterSerializer
from rest_framework.exceptions import ValidationError

def test_registration():
    print("Starting registration test...")
    
    # Test data
    data = {
        'username': 'testuser_' + os.urandom(4).hex(),
        'email': 'test_' + os.urandom(4).hex() + '@example.com',
        'password': 'StrongPassword123!'
    }
    
    print(f"Testing with dummy data: {data}")
    
    serializer = RegisterSerializer(data=data)
    try:
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        print(f"✅ Registration successful for user: {user.username}")
    except ValidationError as e:
        print(f"❌ Validation Error: {e.detail}")
    except Exception as e:
        print(f"🔥 UNEXPECTED ERROR (500 potential): {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_registration()
