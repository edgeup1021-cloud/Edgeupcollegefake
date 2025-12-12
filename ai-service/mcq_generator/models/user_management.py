from django.db import models


class AdminBranches(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    admin = models.ForeignKey('Admins', models.DO_NOTHING)
    branch_id = models.CharField(max_length=36)  # Changed from ForeignKey to CharField (Branches model deleted)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    vendor = models.ForeignKey('Admins', models.DO_NOTHING, related_name='adminbranches_vendor_set')

    class Meta:
        managed = False
        db_table = 'admin_branches'


class AdminSubjects(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    subject = models.ForeignKey('Subjects', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    admin = models.ForeignKey('Admins', models.DO_NOTHING, blank=True, null=True)
    vendor = models.ForeignKey('Admins', models.DO_NOTHING, related_name='adminsubjects_vendor_set', blank=True, null=True)
    batch = models.ForeignKey('Admins', models.DO_NOTHING, related_name='adminsubjects_batch_set', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_subjects'


class Admins(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=8)
    role = models.CharField(max_length=17)
    token = models.CharField(max_length=255, blank=True, null=True)
    blocked_time = models.DateTimeField(blank=True, null=True)
    message = models.CharField(max_length=255, blank=True, null=True)
    blocked_by = models.CharField(max_length=255, blank=True, null=True)
    reason = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=255, blank=True, null=True)
    otp = models.CharField(max_length=255, blank=True, null=True)
    otp_count = models.IntegerField(blank=True, null=True)
    is_update_password = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admins'



class AiErrorLogs(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    request = models.JSONField(blank=True, null=True)
    response = models.JSONField(blank=True, null=True)
    type = models.CharField(max_length=21, blank=True, null=True)
    request_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ai_error_logs'


class AnswersheetImages(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    answersheet = models.ForeignKey('Answersheets', models.DO_NOTHING)
    s3url = models.CharField(max_length=1024)
    status = models.CharField(max_length=8)
    display_order = models.IntegerField()
    original_filename = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'answersheet_images'


class Answersheets(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    answersheet_url = models.CharField(max_length=255)
    uploaded_by = models.ForeignKey(Admins, models.DO_NOTHING, db_column='uploaded_by', blank=True, null=True)
    uploaded_by_user_id = models.CharField(max_length=36, blank=True, null=True, db_column='uploaded_by_user')
    user_live_exam_id = models.CharField(max_length=36, db_column='user_live_exam')
    process_status = models.CharField(max_length=10, blank=True, null=True)
    ai_analytics = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'answersheets'


class PascoQuestionBank(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    question_number = models.CharField(max_length=10, blank=True, null=True)
    pillar = models.ForeignKey('PascoSections', models.DO_NOTHING)
    sub_pillar = models.ForeignKey('PascoSections', models.DO_NOTHING, related_name='pascoquestionbank_sub_pillar_set')
    question = models.TextField()
    options = models.JSONField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pasco_question_bank'


class PascoSections(models.Model):
    id = models.CharField(primary_key=True, max_length=36)
    pillar_name = models.CharField(max_length=100)
    sub_pillar_name = models.CharField(max_length=100, blank=True, null=True)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    section_type = models.CharField(max_length=10)
    display_order = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pasco_sections'
