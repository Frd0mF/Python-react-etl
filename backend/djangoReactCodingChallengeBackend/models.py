from django.db import models

class transformation(models.Model):
    id = models.AutoField(primary_key=True)
    saveKey = models.CharField(max_length=200)
    operations = models.JSONField()
    dataArray = models.JSONField()