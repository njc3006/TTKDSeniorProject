# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-22 03:55
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0008_merge_20161016_1859'),
    ]

    operations = [
        migrations.AlterField(
            model_name='registration',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='classes', to='ttkd_api.Person'),
        ),
    ]
