# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-02-14 02:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0032_remove_personbelt_current_belt'),
    ]

    operations = [
        migrations.AddField(
            model_name='registration',
            name='partial',
            field=models.BooleanField(default=False),
        ),
    ]
