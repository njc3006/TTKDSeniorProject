# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-07 22:40
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0002_auto_20161005_0058'),
    ]

    operations = [
        migrations.AlterField(
            model_name='email',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='emails', to='ttkd_api.Person'),
        ),
    ]
