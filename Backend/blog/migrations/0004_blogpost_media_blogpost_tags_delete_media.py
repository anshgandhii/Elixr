# Generated by Django 5.1 on 2024-11-17 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0003_remove_blogpost_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpost',
            name='media',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='blogpost',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='blog_posts', to='blog.tag'),
        ),
        migrations.DeleteModel(
            name='Media',
        ),
    ]
