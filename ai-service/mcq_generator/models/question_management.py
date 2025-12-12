
from django.db import models
from .user_management import Admins
from .assessment_models import LiveMcqQuestions, LiveDescriptiveQuestions, LiveExams
# Removed imports: Batch (model deleted)

class MentorSubjects(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    mentor = models.ForeignKey(Admins, models.DO_NOTHING, blank=True, null=True)
    subject = models.ForeignKey('Subjects', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mentor_subjects'


class ModuleRules(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    status = models.CharField(max_length=8)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    module = models.ForeignKey('Modules', models.DO_NOTHING, blank=True, null=True)
    rule_id = models.CharField(max_length=36, blank=True, null=True, db_column='rule')

    class Meta:
        managed = False
        db_table = 'module_rules'


class Modules(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(max_length=255)
    route = models.CharField(max_length=255)
    status = models.CharField(max_length=8)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    level_no = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'modules'


class Permissions(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    rules = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    admin = models.ForeignKey(Admins, models.DO_NOTHING, blank=True, null=True)
    module = models.ForeignKey(Modules, models.DO_NOTHING, blank=True, null=True)
    rule_id = models.CharField(max_length=36, blank=True, null=True, db_column='rule')

    class Meta:
        managed = False
        db_table = 'permissions'


class QuestionBankTags(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    question = models.ForeignKey('QuestionBanks', models.DO_NOTHING, blank=True, null=True)
    tag = models.ForeignKey('Tags', models.DO_NOTHING, blank=True, null=True)
    sub_tag = models.ForeignKey('SubTags', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'question_bank_tags'


class QuestionBanks(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    question = models.TextField()
    question_type = models.CharField(max_length=5, blank=True, null=True)
    format = models.CharField(max_length=11, blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)
    additional_tags = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    options = models.JSONField(blank=True, null=True)
    correct_option = models.CharField(max_length=255, blank=True, null=True)
    correct_percentage = models.FloatField(blank=True, null=True)
    statements = models.JSONField(blank=True, null=True)
    source_mcq = models.ForeignKey(LiveMcqQuestions, models.DO_NOTHING, blank=True, null=True)
    source_descriptive = models.ForeignKey(LiveDescriptiveQuestions, models.DO_NOTHING, blank=True, null=True)
    difficult_level = models.CharField(max_length=6, blank=True, null=True)
    status = models.CharField(max_length=11, blank=True, null=True)
    is_upsc_question = models.IntegerField(blank=True, null=True)
    previously_data = models.JSONField(blank=True, null=True)
    previously_used_in = models.CharField(max_length=255, blank=True, null=True)
    v_ques_type = models.IntegerField(blank=True, null=True)
    is_bct = models.CharField(max_length=255, blank=True, null=True)
    is_ect = models.CharField(max_length=255, blank=True, null=True)
    is_cum = models.CharField(max_length=255, blank=True, null=True)
    pyramid_level = models.CharField(max_length=255, blank=True, null=True)
    subject = models.ForeignKey('Subjects', models.DO_NOTHING)
    topic = models.ForeignKey('Topics', models.DO_NOTHING, blank=True, null=True)
    live_exam = models.ForeignKey(LiveExams, models.DO_NOTHING, blank=True, null=True)
    batch_id = models.CharField(max_length=36, blank=True, null=True)  # Changed from ForeignKey to CharField (Batch model deleted)
    cd = models.ForeignKey(Admins, models.DO_NOTHING, blank=True, null=True)
    creator = models.ForeignKey(Admins, models.DO_NOTHING, db_column='creator', related_name='questionbanks_creator_set', blank=True, null=True, db_comment='Holds Admin ID if RND approved or created by CD, otherwise NULL')
    keywords = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    tl = models.ForeignKey(Admins, models.DO_NOTHING, related_name='questionbanks_tl_set', blank=True, null=True)
    comprehension = models.ForeignKey('QuestionComprehensions', models.DO_NOTHING, blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'question_banks'


class QuestionGenerationRequests(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    tl_id = models.CharField(max_length=36, db_collation='utf8mb4_bin')
    cd_id = models.CharField(max_length=36, db_collation='utf8mb4_bin', blank=True, null=True)
    cd_live_exam_id = models.CharField(max_length=36, db_collation='utf8mb4_bin', blank=True, null=True)
    web_request = models.JSONField(blank=True, null=True)
    backend_request = models.JSONField(blank=True, null=True)
    generated_question_count = models.IntegerField()
    status = models.CharField(max_length=10)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    tl_live_exam = models.ForeignKey('TlLiveExams', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'question_generation_requests'