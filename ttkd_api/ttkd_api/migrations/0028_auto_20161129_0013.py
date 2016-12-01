# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-29 05:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0027_merge_20161116_1519'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emergencycontact',
            name='full_name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='emergencycontact',
            name='phone_number',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='emergencycontact',
            name='relation',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]