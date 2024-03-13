from __future__ import absolute_import, unicode_literals

import os

from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

app = Celery("app", backend=os.getenv("REDIS_URL"), broker=os.getenv("REDIS_URL"))
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


def debug_task(self):
    print(f"Request: {self.request!r}")
