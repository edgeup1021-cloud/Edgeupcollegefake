from django.db import models
from .user_management import Admins
from .assessment_models import LiveExams

class Sections(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(unique=True, max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=8, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sections'


class SourceWebsiteRelations(models.Model):
    relation_id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    route_id = models.CharField(max_length=36, blank=True, null=True, db_column='route')
    source = models.ForeignKey('SourceWebsites', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'source_website_relations'


class SourceWebsites(models.Model):
    source_id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    website_name = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    status = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'source_websites'


class States(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(unique=True, max_length=255)
    country = models.CharField(max_length=255)
    is_active = models.IntegerField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'states'


class SubTags(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(max_length=255)
    tag = models.ForeignKey('Tags', models.DO_NOTHING)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sub_tags'


class SubTopics(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=8)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    topic = models.ForeignKey('Topics', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sub_topics'


class Subjects(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=8, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    section_id = models.CharField(max_length=36, blank=True, null=True, db_column='section')

    class Meta:
        managed = False
        db_table = 'subjects'


class SyllabusChapters(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True, db_comment='Short description of the content material')
    duration = models.DecimalField(max_digits=10, decimal_places=2, db_comment='Duration of the content material in minutes')
    file_path = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.CharField(max_length=255, blank=True, null=True)
    file_size = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_comment='File size of the content in KB')
    file_mime_type = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=8)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    syllabus_content = models.ForeignKey('SyllabusContents', models.DO_NOTHING, blank=True, null=True)
    syllabus_content_material = models.ForeignKey('SyllabusContentMaterials', models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'syllabus_chapters'


class SyllabusContentMaterials(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True, db_comment='Short description of the content material')
    duration = models.DecimalField(max_digits=10, decimal_places=0, db_comment='Duration of the content material in minutes')
    time = models.DecimalField(max_digits=10, decimal_places=0, blank=True, null=True)
    file_path = models.CharField(max_length=255, blank=True, null=True)
    thumbnail = models.CharField(max_length=255, blank=True, null=True)
    file_size = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_comment='File size of the content in KB')
    file_mime_type = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=8)
    difficulty_level = models.CharField(max_length=6)
    is_paid = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    syllabus_content = models.ForeignKey('SyllabusContents', models.DO_NOTHING, blank=True, null=True)
    content_type_id = models.CharField(max_length=36, blank=True, null=True, db_column='content_type')
    views = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'syllabus_content_materials'


class SyllabusContentSummaries(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    exam_id = models.CharField(max_length=36, blank=True, null=True)  # Changed from ForeignKey to CharField (Exams model deleted)
    topic = models.ForeignKey('Topics', models.DO_NOTHING, blank=True, null=True)
    subject = models.ForeignKey(Subjects, models.DO_NOTHING, blank=True, null=True)
    summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'syllabus_content_summaries'


class SyllabusContents(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True, db_comment='Short description of the content')
    duration = models.FloatField(db_comment='Duration of the content in minutes')
    difficulty_level = models.CharField(max_length=6)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    exam_id = models.CharField(max_length=36, blank=True, null=True)  # Changed from ForeignKey to CharField (Exams model deleted)
    subject = models.ForeignKey(Subjects, models.DO_NOTHING, blank=True, null=True)
    topic = models.ForeignKey('Topics', models.DO_NOTHING, blank=True, null=True)
    vendor = models.ForeignKey(Admins, models.DO_NOTHING, blank=True, null=True)
    sub_topic = models.ForeignKey(SubTopics, models.DO_NOTHING, blank=True, null=True)
    views = models.IntegerField()
    visits = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'syllabus_contents'



class Tags(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=7, blank=True, null=True)
    status = models.CharField(max_length=8)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tags'


class TlLiveExams(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    number_of_questions = models.IntegerField()
    status = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    live_exam = models.ForeignKey(LiveExams, models.DO_NOTHING, blank=True, null=True)
    subject = models.ForeignKey(Subjects, models.DO_NOTHING, blank=True, null=True)
    exam_id = models.CharField(max_length=36, blank=True, null=True)  # Changed from ForeignKey to CharField (Exams model deleted)
    tl = models.ForeignKey(Admins, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tl_live_exams'


class TlSubjects(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    tl = models.ForeignKey(Admins, models.DO_NOTHING, blank=True, null=True)
    subject = models.ForeignKey(Subjects, models.DO_NOTHING, blank=True, null=True)
    vendor = models.ForeignKey(Admins, models.DO_NOTHING, related_name='tlsubjects_vendor_set')

    class Meta:
        managed = False
        db_table = 'tl_subjects'


class Topics(models.Model):
    id = models.CharField(primary_key=True, max_length=36, db_collation='utf8mb4_bin')
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=8)
    difficulty_level = models.CharField(max_length=6)
    parent = models.ForeignKey('self', models.DO_NOTHING, blank=True, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    subject = models.ForeignKey(Subjects, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'topics'
