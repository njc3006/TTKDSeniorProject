# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-10 03:57
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0040_auto_20170309_2210'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='instructorattendancerecord',
            unique_together=set([('person', 'program', 'date')]),
        ),
    ]
