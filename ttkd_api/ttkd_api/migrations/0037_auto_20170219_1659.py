# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-02-19 21:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0036_merge_20170217_1906'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instructor',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instructs', to='ttkd_api.Person'),
        ),
    ]
