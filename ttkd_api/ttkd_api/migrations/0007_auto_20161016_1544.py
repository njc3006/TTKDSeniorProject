# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-16 19:44
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0006_auto_20161012_1838'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='attendancerecord',
            name='time',
        ),
        migrations.AddField(
            model_name='attendancerecord',
            name='date',
            field=models.DateField(default=datetime.date(2016, 10, 16)),
            preserve_default=False,
        ),
    ]
