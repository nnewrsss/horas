# from django.contrib.auth.models import User
# from rest_framework import serializers
# from .models import Note


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["id", "username", "password"]
#         extra_kwargs = {"password": {"write_only": True}}

#     def create(self, validated_data):
#         print(validated_data)
#         user = User.objects.create_user(**validated_data)
#         return user


# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content", "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}


from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Category, Product, ProductVariation, Cart, CartItem,
    Order, OrderItem, Payment, UserProfile, ProductImage,
    Review, Coupon
)

# Serializer สำหรับผู้ใช้
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Serializer สำหรับหมวดหมู่สินค้า
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

# Serializer สำหรับสินค้า (Product)
class ProductSerializer(serializers.ModelSerializer):
    images = serializers.StringRelatedField(many=True, read_only=True)
    variations = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "description", "category", "images", "variations", "created_at"]

# Serializer สำหรับรูปแบบสินค้า (ProductVariation)
class ProductVariationSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = ProductVariation
        fields = ["id", "product", "size", "color", "price", "stock"]

# Serializer สำหรับรายการสินค้าในตะกร้า (CartItem)
class CartItemSerializer(serializers.ModelSerializer):
    product_variation = ProductVariationSerializer(read_only=True)
    product_variation_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariation.objects.all(), source='product_variation', write_only=True
    )

    class Meta:
        model = CartItem
        fields = ["id", "product_variation", "product_variation_id", "quantity"]

# Serializer สำหรับตะกร้าสินค้า (Cart)
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "created_at"]

# Serializer สำหรับรายการสินค้าในคำสั่งซื้อ (OrderItem)
class OrderItemSerializer(serializers.ModelSerializer):
    product_variation = ProductVariationSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product_variation", "quantity", "price"]

# Serializer สำหรับคำสั่งซื้อ (Order)
class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "user", "order_items", "total_price", "status", "shipping_address", "phone_number", "created_at", "updated_at"]

# Serializer สำหรับการชำระเงิน (Payment)
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"

# Serializer สำหรับโปรไฟล์ผู้ใช้ (UserProfile)
class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ["user", "phone_number", "address"]

# Serializer สำหรับรูปภาพสินค้า (ProductImage)
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = "__all__"

# Serializer สำหรับรีวิวสินค้า (Review)
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "product", "user", "rating", "comment", "created_at"]

# Serializer สำหรับคูปอง (Coupon)
class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"
