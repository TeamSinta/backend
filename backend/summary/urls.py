from django.urls import path
from . import views

urlpatterns = [
    # ... other urls here ...
    path(
        "generate/<int:interview_round_id>/",
        views.GenerateSummaryView.as_view(),
        name="generate_summary",
    ),
    # ... other urls here ...
]
