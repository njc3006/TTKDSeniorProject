# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-10-28 19:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0015_auto_20161028_1508'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='personbelt',
            options={'ordering': ('-date_achieved', '-Belt')},
        ),
    ]