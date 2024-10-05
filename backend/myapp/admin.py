# from django.contrib import admin
# from .models import Category, Product,Size, Cart, CartItem, Order, OrderItem, Payment, UserProfile, ProductImage, Review, Coupon

# admin.site.register(Category)
# admin.site.register(Product)
# admin.site.register(Cart)
# admin.site.register(CartItem)
# admin.site.register(Order)
# admin.site.register(OrderItem)
# admin.site.register(Payment)
# admin.site.register(UserProfile)
# admin.site.register(ProductImage)
# admin.site.register(Review)
# admin.site.register(Coupon)
# admin.site.register(Size)






# admin.py

from django.contrib import admin
from .models import (
    Category, Product, Size, Cart, CartItem,
    Order, OrderItem, Payment, UserProfile, ProductImage,
    Review, Coupon
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent']

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # เปลี่ยนจาก 'category' เป็น 'parent_category', 'sub_category', 'child_category'
    list_display = ['name', 'parent_category', 'sub_category', 'child_category', 'price', 'stock']
    filter_horizontal = ['sizes']  # ใช้ filter_horizontal สำหรับ ManyToManyField

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'image']

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at']

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['cart', 'product', 'quantity']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_price', 'created_at']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price']

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'amount', 'payment_status', 'payment_method']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone_number', 'address', 'role']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['product', 'user', 'rating', 'created_at']

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percentage', 'valid_from', 'valid_to', 'active']
