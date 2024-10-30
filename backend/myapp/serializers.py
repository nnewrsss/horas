
#o1mini
# serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Category, Product, Size, Cart, CartItem,
    Order, OrderItem, Payment, UserProfile, ProductImage,
    Review, Coupon,CategoryPic,UserProfile
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

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

# Serializer สำหรับขนาดสินค้า (Size)
class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = "__all__"

# Serializer สำหรับรูปภาพสินค้า (ProductImage)
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']



class ProductSerializer(serializers.ModelSerializer):
    parent_category_name = serializers.CharField(source='parent_category.name', read_only=True)
    sub_category_name = serializers.CharField(source='sub_category.name', read_only=True)
    child_category_name = serializers.CharField(source='child_category.name', read_only=True)

    images = ProductImageSerializer(many=True, read_only=True)
    images_upload = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'materials', 'parent_category', 'parent_category_id', 
            'parent_category_name', 'sub_category', 'sub_category_id', 'sub_category_name', 
            'child_category', 'child_category_id', 'child_category_name', 
            'price', 'stock', 'created_at', 'images', 'images_upload'
        ]
        extra_kwargs = {
            'category': {'write_only': True},
        }

    def create(self, validated_data):
        images_data = validated_data.pop('images_upload', [])
        sizes = validated_data.pop('sizes', [])

        product = Product.objects.create(**validated_data)

        if sizes:
            product.sizes.set(sizes)

        for image in images_data:
            ProductImage.objects.create(product=product, image=image)

        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images_upload', [])
        sizes = validated_data.pop('sizes', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if sizes:
            instance.sizes.set(sizes)

        for image in images_data:
            ProductImage.objects.create(product=instance, image=image)

        return instance






# # Serializer สำหรับรายการสินค้าในตะกร้า (CartItem)
# class CartItemSerializer(serializers.ModelSerializer):
#     product = ProductSerializer(read_only=True)
#     product_id = serializers.PrimaryKeyRelatedField(
#         queryset=Product.objects.all(), source='product', write_only=True
#     )

#     class Meta:
#         model = CartItem
#         fields = ["id", "product", "product_id", "quantity"]

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    sizes = SizeSerializer(read_only=True)
    size_id = serializers.PrimaryKeyRelatedField(queryset=Size.objects.all(), source='sizes', write_only=True)

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "sizes", "size_id"]



# Serializer สำหรับตะกร้าสินค้า (Cart)
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "created_at"]

# Serializer สำหรับรายการสินค้าในคำสั่งซื้อ (OrderItem)
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    sizes = SizeSerializer(read_only=True)  # เพิ่มการแสดงผลของ sizes

    class Meta:
        model = OrderItem
        fields = ["id", "product", "quantity", "price", "sizes"]

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
        fields = ["user", "phone_number", "address", "role"]

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




# Serializer สำหรับรูปภาพหมวดหมู่ (CategoryPic)
class CategoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryPic
        fields = ['id', 'image']

# Serializer สำหรับหมวดหมู่ย่อย (SubCategory) รวมถึงรูปภาพ
class SubCategorySerializer(serializers.ModelSerializer):
    images = CategoryImageSerializer(many=True, read_only=True)
    images_upload = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Category
        fields = ['id', 'name', 'images', 'images_upload']

    def create(self, validated_data):
        images_data = validated_data.pop('images_upload', [])
        subcategory = Category.objects.create(**validated_data)

        for image in images_data:
            CategoryPic.objects.create(category=subcategory, image=image)

        return subcategory

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images_upload', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for image in images_data:
            CategoryPic.objects.create(category=instance, image=image)

        return instance

# Serializer สำหรับหมวดหมู่หลัก (Category) รวมหมวดหมู่ย่อยและรูปภาพ
class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    parent_name = serializers.CharField(source='parent.name', read_only=True)
    images = CategoryImageSerializer(many=True, read_only=True)
    images_upload = serializers.ListField(
        child=serializers.ImageField(max_length=100000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'parent_name', 'subcategories', 'images', 'images_upload']

    def create(self, validated_data):
        images_data = validated_data.pop('images_upload', [])
        category = Category.objects.create(**validated_data)

        for image in images_data:
            CategoryPic.objects.create(category=category, image=image)

        return category

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images_upload', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        for image in images_data:
            CategoryPic.objects.create(category=instance, image=image)

        return instance






class ProductImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['product', 'image']



class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    phone_number = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password', 'phone_number']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number')
        validated_data.pop('confirm_password')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            role='user',  # เซ็ต role เป็น 'user' โดยอัตโนมัติ
            address=None   # เซ็ต address เป็น None (อนุญาตได้แล้วหลังจากแก้ไขโมเดล)
        )

        return user