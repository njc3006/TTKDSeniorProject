# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-04 01:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0019_auto_20161103_2014'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emergencycontact',
            name='full_name',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='emergencycontact',
            name='phone_number',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AlterField(
            model_name='emergencycontact',
            name='relation',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]