# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-04 00:52
from __future__ import unicode_literals

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0038_instructorattendancerecord'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='waiver',
            name='signature_timestamp',
        ),
        migrations.AddField(
            model_name='waiver',
            name='signature_date',
            field=models.DateField(default=datetime.date.today, verbose_name='Date'),
        ),
    ]