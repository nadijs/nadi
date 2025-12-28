"""
Django middleware for Nadi
"""

class NadiMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Add Nadi version header
        response['X-Nadi-Version'] = '0.2.0'

        # Handle CSRF for Nadi requests
        if request.headers.get('X-Nadi'):
            from django.middleware.csrf import get_token
            response['X-CSRF-Token'] = get_token(request)

        return response
