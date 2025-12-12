from django.apps import AppConfig
from .config import Config
import google.generativeai as genai
from google.generativeai import GenerativeModel
from celery.signals import worker_ready

class Models():
   genai.configure(api_key=Config.GEMINI_API_KEY)
   model = genai.GenerativeModel(Config.GEMINI_MODEL)
   primary_model = genai.GenerativeModel(model_name=Config.GEMINI_MODEL)

    # Fallback model
   fallback_model = genai.GenerativeModel(model_name=Config.GEMINI_FALLBACK_MODEL_NAME)


class McqGeneratorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mcq_generator'

    def ready(self):
        @worker_ready.connect
        def at_worker_ready(sender, **kwargs):
            from mcq_generator.tasks import health_check
            health_check.delay()

    
              
