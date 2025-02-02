# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2021-02-06 15:09
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.postgres.fields
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='JsonFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('empty', 'empty'), ('pending', 'pending'), ('done', 'done')], default='empty', max_length=10)),
                ('json_format', models.CharField(choices=[('sat_vis_factor', 'sat_vis_factor'), ('sat_vis_interaction', 'sat_vis_interaction'), ('sat_vis_matrix', 'sat_vis_matrix'), ('sat_vis_tree', 'sat_vis_tree'), ('sat_vis_cluster', 'sat_vis_cluster'), ('sat_vis_resolution', 'sat_vis_resolution'), ('sat_vis_directed','sat_vis_directed'), ('sat_vis_2clause', 'sat_vis_2clause'), ('sat_vis_dpll', 'sat_vis_dpll'), ('raw', 'raw'), ('variables', 'variables'), ('maxsat_vis_factor', 'maxsat_vis_factor'), ('maxsat_vis_interaction', 'maxsat_vis_interaction'), ('maxsat_vis_matrix', 'maxsat_vis_matrix'), ('maxsat_vis_tree', 'maxsat_vis_tree'), ('maxsat_vis_cluster', 'maxsat_vis_cluster'), ('maxsat_vis_resolution', 'maxsat_vis_resolution')], max_length=255)),
                ('selected_vars', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None)),
                ('content', django.contrib.postgres.fields.jsonb.JSONField(default={})),
                ('progress', models.TextField(default='0')),
                ('task_id', models.CharField(default='', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TextFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('content', models.FileField(upload_to='_files//%Y%m%d/')),
                ('minimized', models.BooleanField(default=False)),
                ('kind', models.CharField(max_length=10)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='text_files', to='profiles.Profile')),
            ],
        ),
        migrations.AddField(
            model_name='jsonfile',
            name='text_file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='json', to='profiles.TextFile'),
        ),
    ]
