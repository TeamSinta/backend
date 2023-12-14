"""
URL configuration for app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("authentication.urls")),
    path("api/user/", include("user.urls")),
    path("api/company/", include("company.urls")),
    path("api/interview-rounds/", include("interview.urls")),
    path("api/question/", include("question.urls")),
    path("api/transcription/", include("transcription.urls")),
    path("api/files/", include("files.urls")),
    path("api/question_response/", include("question_response.urls")),
    path("api/templates/", include("interview_templates.urls")),
    path("api/videosdk/", include("videosdk.urls")),
    # path('sse_endpoint/', YourViewClassName.as_view(), name='sse_endpoint'),
    path("api/summary/", include("summary.urls")),  # Add this line for the "summary" app
]
