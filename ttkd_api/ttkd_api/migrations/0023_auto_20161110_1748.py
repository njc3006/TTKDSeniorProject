# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-10 22:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ttkd_api', '0022_auto_20161108_1655'),
    ]

    operations = [
        migrations.AddField(
            model_name='belt',
            name='primary_color',
            field=models.CharField(default='FFFFFF', max_length=6),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='belt',
            name='secondary_color',
            field=models.CharField(default='FFFFFF', max_length=6),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='stripe',
            name='name',
            field=models.CharField(default='Yellow', max_length=25),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='stripe',
            name='color',
            field=models.CharField(default='Yellow', max_length=6),
            preserve_default=False,
        ),
    ]
