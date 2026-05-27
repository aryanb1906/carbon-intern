"""Injects request.organization from JWT claims or header."""
from apps.organizations.models import Organization


class OrganizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.organization = None
        if request.user and hasattr(request.user, "organization"):
            request.organization = request.user.organization
        return self.get_response(request)
