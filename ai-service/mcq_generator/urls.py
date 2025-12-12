from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path("health-check", views.healthcheck, name="health-check"),

    # OLD endpoint (backward compatibility)
    path("generate-questions", views.generate, name="generate-questions"),

    # NEW college endpoint (recommended)
    path("college/generate", views.generate_college_questions, name="generate-college-questions"),
]
