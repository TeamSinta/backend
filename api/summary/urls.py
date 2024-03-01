from django.urls import path

from . import views

urlpatterns = [
    # ... other urls here ...
    path(
        "generate/<int:interview_round_id>/",
        views.GenerateSummaryView.as_view(),
        name="generate_summary",
    ),
    path(
        "<int:summary_id>/update-description/",
        views.UpdateSummaryDescriptionView.as_view(),
        name="update-summary-description",
    ),
    # ... other urls here ...
]
