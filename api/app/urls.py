from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema")),
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
    path("api/", include("export_handler.urls")),
    path("api/new_transcription/", include("new_transcription.urls")),
]
