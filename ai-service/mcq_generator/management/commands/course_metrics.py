"""Django management command to view course metrics."""

from django.core.management.base import BaseCommand
from mcq_generator.monitoring.course_metrics import course_metrics
from mcq_generator.services.course_config_manager import course_config_manager
import json


class Command(BaseCommand):
    help = 'Display question generation metrics by course'

    def add_arguments(self, parser):
        parser.add_argument('--course', type=str, help='Show metrics for specific course')
        parser.add_argument('--errors', action='store_true', help='Show detailed error report')
        parser.add_argument('--export', type=str, help='Export metrics to JSON file')

    def handle(self, *args, **options):
        if options['export']:
            course_metrics.export_metrics(options['export'])
            self.stdout.write(self.style.SUCCESS(f"Metrics exported to {options['export']}"))
            return

        if options['course']:
            if options['errors']:
                report = course_metrics.get_error_report(options['course'])
                self.stdout.write(json.dumps(report, indent=2))
            else:
                summary = course_metrics.get_course_summary(options['course'])
                self.stdout.write(json.dumps(summary, indent=2))
        else:
            # Show all courses
            all_courses = course_config_manager.get_available_courses()
            if not all_courses:
                self.stdout.write(self.style.WARNING("No courses configured"))
                return

            self.stdout.write(self.style.SUCCESS("\nCourse Generation Metrics:"))
            self.stdout.write("=" * 50)

            for course in all_courses:
                summary = course_metrics.get_course_summary(course)
                self.stdout.write(f"\n{course.upper()}:")
                self.stdout.write(f"  Success Rate: {summary['success_rate']:.1f}%")
                self.stdout.write(f"  Total Requests: {summary['total_requests']}")
                self.stdout.write(f"  Errors: {summary['errors']}")
                self.stdout.write(f"  Avg Generation Time: {summary['average_generation_time']:.2f}s")
