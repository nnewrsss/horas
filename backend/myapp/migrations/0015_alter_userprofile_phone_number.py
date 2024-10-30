# Generated by Django 5.1.1 on 2024-10-30 20:10

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("myapp", "0014_alter_userprofile_address"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="phone_number",
            field=models.CharField(
                max_length=15,
                validators=[
                    django.core.validators.RegexValidator(
                        message="เบอร์มือถือจะต้องเป็นตัวเลข 10 หลัก และเริ่มต้นด้วย 0 (เช่น 0912345678)",
                        regex="^0[0-9]{9}$",
                    )
                ],
            ),
        ),
    ]