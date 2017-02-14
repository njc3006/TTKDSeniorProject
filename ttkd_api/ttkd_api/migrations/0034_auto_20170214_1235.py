# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-02-14 17:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0033_registration_partial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='first_name',
            field=models.CharField(default='TTKD', max_length=30),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='person',
            name='last_name',
            field=models.CharField(default='TTKD', max_length=30),
            preserve_default=False,
        ),
    ]