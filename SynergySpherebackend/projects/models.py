from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    progress = models.IntegerField(default=0)
    total_tasks = models.IntegerField(default=0)
    completed_tasks = models.IntegerField(default=0)

    def __str__(self):
        return self.name
