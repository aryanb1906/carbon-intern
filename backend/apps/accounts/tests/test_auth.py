from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from apps.organizations.models import Organization
from apps.accounts.models import User


def make_org():
    return Organization.objects.create(name="Test Corp", slug="test-corp")

def make_user(org, role="analyst", password="testpass123"):
    u = User.objects.create_user(
        email=f"{role}@test.com", password=password,
        first_name="Test", last_name="User",
        role=role, organization=org
    )
    return u


class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.org  = make_org()
        self.user = make_user(self.org)

    def test_login_success(self):
        r = self.client.post(reverse("login"), {"email": "analyst@test.com", "password": "testpass123"}, format="json")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertIn("access",  r.data)
        self.assertIn("refresh", r.data)
        self.assertIn("user",    r.data)

    def test_login_wrong_password(self):
        r = self.client.post(reverse("login"), {"email": "analyst@test.com", "password": "wrong"}, format="json")
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_requires_auth(self):
        r = self.client.get(reverse("me"))
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_user(self):
        self.client.force_authenticate(self.user)
        r = self.client.get(reverse("me"))
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data["email"], self.user.email)
        self.assertEqual(r.data["role"],  self.user.role)

    def test_logout_blacklists_token(self):
        login = self.client.post(reverse("login"), {"email":"analyst@test.com","password":"testpass123"}, format="json")
        refresh = login.data["refresh"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        r = self.client.post(reverse("logout"), {"refresh": refresh}, format="json")
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_user_full_name(self):
        self.assertEqual(self.user.full_name, "Test User")
