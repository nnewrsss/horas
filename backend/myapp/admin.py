from django.contrib import admin
from .models import Category, Product, ProductVariation, Cart, CartItem, Order, OrderItem, Payment, UserProfile, ProductImage, Review, Coupon

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductVariation)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(UserProfile)
admin.site.register(ProductImage)
admin.site.register(Review)
admin.site.register(Coupon)
