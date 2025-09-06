from django.http import JsonResponse

def test_auth(request):
    return JsonResponse({"message": "Auth API working"})
