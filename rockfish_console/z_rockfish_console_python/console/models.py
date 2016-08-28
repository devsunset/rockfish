from django.db import models

# Create your models here.
class Testmodel(models.Model):
    test1 = models.CharField(max_length=10)
    test2 = models.TextField()
    test3 = models.IntegerField(default=0)

    def __str__(self):
        return self.test1 