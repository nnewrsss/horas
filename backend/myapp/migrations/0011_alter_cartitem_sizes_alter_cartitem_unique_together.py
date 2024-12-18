# Generated by Django 5.0.6 on 2024-10-29 17:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myapp", "0010_cartitem_sizes"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cartitem",
            name="sizes",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="myapp.size"
            ),
        ),
        migrations.AlterUniqueTogether(
            name="cartitem",
            unique_together={("cart", "product", "sizes")},
        ),
    ]
