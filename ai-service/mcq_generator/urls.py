from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path("health-check", views.healthcheck, name="health-check"),

    # OLD endpoint (backward compatibility)
    path("generate-questions", views.generate, name="generate-questions"),

    # NEW college endpoint (recommended)
    path("college/generate", views.generate_college_questions, name="generate-college-questions"),

    # Dropdown data endpoints
    path("college/universities", views.get_universities, name="get-universities"),
    path("college/courses", views.get_courses, name="get-courses"),
    path("college/departments", views.get_departments, name="get-departments"),
    path("college/semesters", views.get_semesters, name="get-semesters"),
    path("college/subjects", views.get_subjects, name="get-subjects"),
    path("college/topics", views.get_topics, name="get-topics"),
    path("college/subtopics", views.get_subtopics, name="get-subtopics"),
]
