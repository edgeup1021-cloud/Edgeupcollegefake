from django.db import models
from .user_management import Admins

class LiveDescriptiveQuestions(models.Model):
    """
    Model for descriptive questions in the college system.
    All exam-specific fields have been removed.
    """
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')

    # Question Content
    question = models.CharField(max_length=3000)
    image = models.CharField(max_length=500, blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)

    # Metadata
    correct_percentage = models.FloatField()
    difficult_level = models.CharField(max_length=6, blank=True, null=True)
    status = models.CharField(max_length=8, blank=True, null=True)
    question_generate_type = models.CharField(max_length=6, blank=True, null=True)
    question_status = models.CharField(max_length=8, blank=True, null=True)
    question_type = models.CharField(max_length=5, blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    additional_tags = models.TextField(blank=True, null=True)
    keywords = models.JSONField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    # College Hierarchy Fields
    university = models.CharField(max_length=255, blank=True, null=True, db_comment='University name')
    course = models.CharField(max_length=100, blank=True, null=True, db_comment='Course code (bcom, ba_english, etc.)')
    department = models.CharField(max_length=255, blank=True, null=True, db_comment='Department name')
    semester = models.IntegerField(blank=True, null=True, db_comment='Semester number (1-6)')
    paper_type = models.CharField(max_length=50, blank=True, null=True, db_comment='Core or Elective')
    source_pdf = models.CharField(max_length=500, blank=True, null=True, db_comment='Source PDF filename')
    page_range = models.CharField(max_length=50, blank=True, null=True, db_comment='Page range (e.g., 45-67)')

    # Relationships (stored as CharField IDs, not ForeignKeys)
    comprehension_id = models.CharField(max_length=36, blank=True, null=True, db_column='comprehension_id')
    question_generation_request_id = models.CharField(max_length=36, blank=True, null=True, db_column='question_generation_request_id')

    # Subject/Topic/Subtopic Names (for querying and filtering)
    subject_name = models.CharField(max_length=255, blank=True, null=True, db_comment='Subject name (e.g., Accounting, Literature)')
    topic_name = models.CharField(max_length=255, blank=True, null=True, db_comment='Topic name (e.g., Financial Statements)')
    subtopic_name = models.CharField(max_length=255, blank=True, null=True, db_comment='Subtopic name for focused content')

    class Meta:
        managed = False
        db_table = 'live_descriptive_questions'


class LiveExamBatches(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    live_exam = models.ForeignKey('LiveExams', models.DO_NOTHING, blank=True, null=True)
    batch_id = models.CharField(max_length=36, db_collation='utf8mb4_bin', blank=True, null=True)
    exam_id = models.CharField(max_length=36, blank=True, null=True)  # Changed from ForeignKey to CharField (Exams model deleted)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'live_exam_batches'


class LiveExamSection(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    no_of_questions = models.IntegerField(blank=True, null=True)
    difficulty = models.CharField(max_length=6)
    weightage = models.IntegerField()
    exam_type = models.CharField(max_length=9, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    section = models.ForeignKey('Sections', models.DO_NOTHING, blank=True, null=True)
    exam_type_0 = models.ForeignKey('LiveExams', models.DO_NOTHING, db_column='exam_type_id', blank=True, null=True)  # Field renamed because of name conflict.

    class Meta:
        managed = False
        db_table = 'live_exam_section'


class LiveExams(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    exam_date = models.DateTimeField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.IntegerField(db_comment='Duration in minutes')
    total_marks = models.IntegerField()
    passing_marks = models.IntegerField()
    marks_per_question = models.IntegerField()
    total_questions = models.IntegerField()
    total_sets = models.IntegerField()
    status = models.CharField(max_length=29, blank=True, null=True)
    evaluation_status = models.CharField(max_length=10, blank=True, null=True)
    analysis_retry_count = models.IntegerField()
    exam_type = models.CharField(max_length=11, blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    test_press_id = models.CharField(max_length=255, blank=True, null=True)
    test_press_url = models.CharField(max_length=255, blank=True, null=True)
    last_applied_date = models.DateTimeField(blank=True, null=True, db_comment='Student last date when the exam was applied')
    entry_allowed_at = models.IntegerField(blank=True, null=True, db_comment='Indicates when access begins before the exam')
    is_negative_marks = models.IntegerField(blank=True, null=True)
    negative_marks = models.FloatField(blank=True, null=True)
    round_off_marks = models.IntegerField(blank=True, null=True)
    show_score = models.IntegerField(blank=True, null=True)
    show_analytics = models.IntegerField(blank=True, null=True)
    show_answers = models.IntegerField(blank=True, null=True)
    show_solutions_to_user = models.IntegerField(blank=True, null=True)
    show_pass_or_fail = models.IntegerField(blank=True, null=True)
    allow_retaking = models.IntegerField(blank=True, null=True)
    maximum_allowed_retakes = models.IntegerField(blank=True, null=True, db_comment='Leave blank for unlimited retakes')
    allow_retaking_only_for_failed_attempt = models.IntegerField(blank=True, null=True)
    enforce_retakes_before_deadline = models.IntegerField(blank=True, null=True, db_comment='User can retake the exam only after the grace duration. This will help the user to review the answers before the next retake')
    enforce_time_limit = models.IntegerField(blank=True, null=True)
    enable_quiz_mode = models.IntegerField(blank=True, null=True, db_comment='Click this to have the exam pause during user inactivity')
    disable_attempt_recording = models.IntegerField(blank=True, null=True, db_comment='Allow to disable exam recording after exit or incomplete')
    auto_generate_review_p_d_f = models.IntegerField(blank=True, null=True, db_comment='Enable this to automatically generate a review PDF at the end of each exam attempt. If not enabled, the PDF will be generated only when requested')
    allow_review_p_d_f_download = models.IntegerField(blank=True, null=True, db_comment='Your students can download the PDFs of their answer sheets')
    allow_question_p_d_f_download = models.IntegerField(blank=True, null=True, db_comment='Your students can download the PDFs of question paper')
    notification_emails = models.TextField(blank=True, null=True, db_comment="Comma separated email addresses. Whenever a user completes this exam, these addresses will be notified about that attempt's details")
    access_control = models.CharField(max_length=7, blank=True, null=True)
    allowed_networks = models.CharField(max_length=255, blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    custom_end_message = models.TextField(blank=True, null=True)
    exam_template = models.CharField(max_length=255, blank=True, null=True)
    allow_preemptive_question_viewing = models.IntegerField(blank=True, null=True, db_comment='Allow the user to read the section before the completion of applied timer')
    enable_sequential_question_number_in_results = models.IntegerField(blank=True, null=True, db_comment='Check this to ensure that the question numbers between sections continue sequentially')
    question_count = models.CharField(max_length=9, blank=True, null=True, db_comment='Number of questions will be calculated automatically from the Question Set')
    badge_url = models.CharField(max_length=255, blank=True, null=True, db_comment='After end of exam user will get real-time badge url if you provide one')
    enable_o_m_r_mode = models.IntegerField(blank=True, null=True, db_comment="If enabled, user won't be able to change their response. It simulates the OMR sheet exam taking experience")
    tags = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    creator = models.ForeignKey(Admins, models.DO_NOTHING, blank=True, null=True)
    exam_id = models.CharField(max_length=36, blank=True, null=True)  # Changed from ForeignKey to CharField (Exams model deleted)
    vendor = models.ForeignKey(Admins, models.DO_NOTHING, related_name='liveexams_vendor_set')

    class Meta:
        managed = False
        db_table = 'live_exams'



class LiveMcqQuestions(models.Model):
    """
    Model for MCQ questions in the college system.
    All exam-specific fields have been removed.
    """
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')

    # Question Content
    question = models.CharField(max_length=3000)
    image = models.CharField(max_length=500, blank=True, null=True)
    statements = models.JSONField(blank=True, null=True)
    options = models.JSONField()
    correct_option = models.CharField(max_length=255)
    explanation = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)

    # Metadata
    difficult_level = models.CharField(max_length=6, blank=True, null=True)
    status = models.CharField(max_length=8, blank=True, null=True)
    question_generate_type = models.CharField(max_length=6, blank=True, null=True)
    question_status = models.CharField(max_length=8, blank=True, null=True)
    question_type = models.CharField(max_length=5, blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    additional_tags = models.TextField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    # College Hierarchy Fields
    university = models.CharField(max_length=255, blank=True, null=True, db_comment='University name')
    course = models.CharField(max_length=100, blank=True, null=True, db_comment='Course code (bcom, ba_english, etc.)')
    department = models.CharField(max_length=255, blank=True, null=True, db_comment='Department name')
    semester = models.IntegerField(blank=True, null=True, db_comment='Semester number (1-6)')
    paper_type = models.CharField(max_length=50, blank=True, null=True, db_comment='Core or Elective')
    source_pdf = models.CharField(max_length=500, blank=True, null=True, db_comment='Source PDF filename')
    page_range = models.CharField(max_length=50, blank=True, null=True, db_comment='Page range (e.g., 45-67)')

    # Relationships (stored as CharField IDs, not ForeignKeys)
    comprehension_id = models.CharField(max_length=36, blank=True, null=True, db_column='comprehension_id')
    exam_sections_id = models.CharField(max_length=36, blank=True, null=True, db_column='exam_sections_id')
    last_rejected_by = models.CharField(max_length=36, blank=True, null=True, db_column='last_rejected_by')
    question_generation_request_id = models.CharField(max_length=36, blank=True, null=True, db_column='question_generation_request_id')

    # Subject/Topic/Subtopic Names (for querying and filtering)
    subject_name = models.CharField(max_length=255, blank=True, null=True, db_comment='Subject name (e.g., Accounting, Literature)')
    topic_name = models.CharField(max_length=255, blank=True, null=True, db_comment='Topic name (e.g., Financial Statements)')
    subtopic_name = models.CharField(max_length=255, blank=True, null=True, db_comment='Subtopic name for focused content')

    class Meta:
        managed = False
        db_table = 'live_mcq_questions'


class QuestionComprehensions(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    live_exam = models.ForeignKey(LiveExams, models.DO_NOTHING, blank=True, null=True)
    exam_id = models.CharField(max_length=36, blank=True, null=True)  # Changed from ForeignKey to CharField (Exams model deleted)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    passage = models.TextField()

    class Meta:
        managed = False
        db_table = 'question_comprehensions'