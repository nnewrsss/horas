##o1mini
# models.py

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from decimal import Decimal

# ขนาดสินค้า
class Size(models.Model):
    SIZE_CHOICES = [
        ('S', 'Small'),
        ('M', 'Medium'),
        ('L', 'Large'),
        ('XL', 'Extra Large'),
    ]

    name = models.CharField(max_length=2, choices=SIZE_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()

# หมวดหมู่สินค้า
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategories')

    def __str__(self):
        return self.name

# สินค้า
class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    materials = models.CharField(max_length=255, blank=True, null=True)
    
    # เพิ่มหมวดหมู่หลัก
    parent_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='parent_products', null=True, blank=True)
    
    # เพิ่มหมวดหมู่ย่อย
    sub_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='sub_products', null=True, blank=True)
    
    # เพิ่มหมวดหมู่ย่อยของย่อย (เช่น malepolo -> maletop -> male)
    child_category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='child_products', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    stock = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    sizes = models.ManyToManyField(Size, blank=True)

    def __str__(self):
        return self.name


# รูปภาพสินค้า
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')

    def __str__(self):
        return f"Image for {self.product.name}"

# ตะกร้าสินค้า
class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

# รายการสินค้าที่อยู่ในตะกร้า
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # เปลี่ยนจาก ProductVariation เป็น Product
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"

# คำสั่งซื้อ
class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Paid', 'Paid'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Canceled', 'Canceled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    shipping_address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    updated_at = models.DateTimeField(auto_now=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # เพิ่มฟิลด์ total_price

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

    def calculate_total_price(self):
        self.total_price = sum(item.price * item.quantity for item in self.order_items.all())
        self.save()

# รายการสินค้าที่สั่งซื้อ
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # เปลี่ยนจาก ProductVariation เป็น Product
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"

# การชำระเงิน
class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Completed', 'Completed'),
        ('Failed', 'Failed'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('Credit Card', 'Credit Card'),
        ('PayPal', 'PayPal'),
        ('Bank Transfer', 'Bank Transfer'),
        # เพิ่มเพิ่มเติมตามต้องการ
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='Pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Payment for Order {self.order.id}"

# โปรไฟล์ผู้ใช้
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=15)
    address = models.CharField(max_length=255)
    role = models.CharField(max_length=5, choices=ROLE_CHOICES, default='user')  # Role field

    def __str__(self):
        return self.user.username

# รีวิวสินค้า
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review for {self.product.name} by {self.user.username}"

# คูปอง
class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.code
