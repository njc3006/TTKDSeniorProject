# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-10 19:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0023_remove_person_picture_path'),
    ]

    operations = [
        migrations.AddField(
            model_name='person',
            name='picture_path',
            field=models.CharField(default=4, max_length=255),
            preserve_default=False,
        ),
    ]