
#o1mini
# views.py

from rest_framework import generics, status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import (
    Category, Product, Size, Cart, CartItem,
    Order, OrderItem, Payment, UserProfile, ProductImage,
    Review, Coupon
)
from .serializers import (
    CategorySerializer, ProductSerializer, SizeSerializer,
    CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer,
    PaymentSerializer, UserProfileSerializer, ProductImageSerializer,
    ReviewSerializer, CouponSerializer, UserSerializer,ProductImageUploadSerializer
    ,RegistrationSerializer,UserSettingsSerializer
)
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes,action
import json
from django.shortcuts import get_object_or_404
import uuid
from django.db import transaction  # นำเข้าที่สำคัญ
from rest_framework.generics import ListAPIView
from django.utils.timezone import now, timedelta
from django.db.models import Sum

# หมวดหมู่สินค้า
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class CategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

# ขนาดสินค้า
class SizeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [AllowAny]

class SizeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Size.objects.all()
    serializer_class = SizeSerializer
    permission_classes = [AllowAny]

# สินค้า
class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class ProductDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

# ตะกร้าสินค้า
class CartAPIView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        cart, created = Cart.objects.get_or_create(user=user)
        return cart




# เพิ่มสินค้าลงตะกร้า
# class AddToCartAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         product_id = request.data.get('product_id')
#         quantity = int(request.data.get('quantity', 1))
#         user = request.user

#         try:
#             product = Product.objects.get(id=product_id)
#         except Product.DoesNotExist:
#             return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

#         if product.stock < quantity:
#             return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

#         cart, created = Cart.objects.get_or_create(user=user)
#         cart_item, created = CartItem.objects.get_or_create(
#             cart=cart,
#             product=product,
#             defaults={'quantity': quantity}
#         )
#         if not created:
#             cart_item.quantity += quantity
#             cart_item.save()

#         return Response({'message': 'Product added to cart'}, status=status.HTTP_200_OK)


class AddToCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        size_id = request.data.get('size_id')  
        user = request.user

        if not size_id:
            return Response({'error': 'กรุณาเลือกขนาดสินค้า'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            size = Size.objects.get(id=size_id)
        except Size.DoesNotExist:
            return Response({'error': 'ไม่พบขนาดที่เลือก'}, status=status.HTTP_404_NOT_FOUND)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'ไม่พบสินค้า'}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response({'error': 'สินค้าคงเหลือไม่เพียงพอ'}, status=status.HTTP_400_BAD_REQUEST)

        cart, created = Cart.objects.get_or_create(user=user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            sizes=size,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response({'message': 'เพิ่มสินค้าลงตะกร้าสำเร็จ'}, status=status.HTTP_200_OK)





# ลบสินค้าจากตะกร้า
class RemoveFromCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_item_id = request.data.get('cart_item_id')
        user = request.user

        try:
            cart_item = CartItem.objects.get(id=cart_item_id, cart__user=user)
            cart_item.delete()
            return Response({'message': 'Item removed from cart'}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({'error': 'Cart item not found'}, status=status.HTTP_404_NOT_FOUND)

# คำสั่งซื้อ
class OrderListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response({'error': 'Your cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        if not cart.items.exists():
            return Response({'error': 'Your cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # สร้างคำสั่งซื้อ
        order = Order.objects.create(
            user=user,
            status='Pending',
            shipping_address=request.data.get('shipping_address'),
            phone_number=request.data.get('phone_number')
        )

        total_price = 0
        for cart_item in cart.items.all():
            if cart_item.product.stock < cart_item.quantity:
                return Response({'error': f'Not enough stock for {cart_item.product.name}'}, status=status.HTTP_400_BAD_REQUEST)

            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price
            )

            # ปรับปรุงสต็อกสินค้า
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()

            total_price += cart_item.product.price * cart_item.quantity

        # อัปเดตราคารวมของคำสั่งซื้อ
        order.total_price = total_price
        order.save()

        # ล้างตะกร้าสินค้า
        cart.items.all().delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# รายละเอียดคำสั่งซื้อ
class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

# การชำระเงิน
class PaymentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save()

# รีวิวสินค้า
class ReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product__id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        product = Product.objects.get(id=product_id)
        serializer.save(user=self.request.user, product=product)

# คูปอง
class CouponListAPIView(generics.ListAPIView):
    queryset = Coupon.objects.filter(active=True)
    serializer_class = CouponSerializer
    permission_classes = [AllowAny]

# สร้างผู้ใช้ใหม่
class CreateUserAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserProfileDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, username):
        try:
            profile = UserProfile.objects.get(user__username=username)
            return Response({
                'username': profile.user.username,
                'role': profile.role,
            })
        except UserProfile.DoesNotExist:
            return Response({"error": "UserProfile not found"}, status=404)

# views.py

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


   

# ViewSet 
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


# views.py

class ProductCreateAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        # Parse variations from JSON string
        variations_data = json.loads(request.data.get('sizes', '[]'))  # เปลี่ยนจาก 'variations' เป็น 'sizes'
        request.data._mutable = True
        request.data['sizes'] = variations_data

        product_serializer = ProductSerializer(data=request.data)

        if product_serializer.is_valid():
            product_serializer.save()
            return Response({'message': 'Product created successfully'}, status=status.HTTP_201_CREATED)

        # แสดงข้อผิดพลาดจาก serializer
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])  # กำหนดให้ทุกคนเข้าถึงได้
def get_parent_categories(request):
    parent_categories = Category.objects.filter(parent=None)
    serializer = CategorySerializer(parent_categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])  # กำหนดให้ทุกคนเข้าถึงได้
def get_subcategories(request):
    parent_id = request.GET.get('parent')
    subcategories = Category.objects.filter(parent_id=parent_id)  # หมวดหมู่ที่มีพ่อ
    serializer = CategorySerializer(subcategories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])  # กำหนดให้ทุกคนเข้าถึงได้
def get_child_categories(request):
    subcategory_id = request.GET.get('subcategory')
    child_categories = Category.objects.filter(parent_id=subcategory_id)  # หมวดหมู่ที่มีแม่
    serializer = CategorySerializer(child_categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_product(request):
    # แสดงข้อมูลที่ถูกส่งมาจาก React
    print(request.data)  # พิมพ์ข้อมูลทั้งหมดที่ถูกส่งมาใน backend logs

    name = request.data.get('name')
    description = request.data.get('description')
    parent_category_id = request.data.get('parent_category')
    sub_category_id = request.data.get('sub_category')
    child_category_id = request.data.get('child_category')
    materials = request.data.get('materials')
    price = request.data.get('price')
    stock = request.data.get('stock')

    # ตรวจสอบว่ามีการส่งข้อมูลถูกต้องหรือไม่
    print(f"Name: {name}, Description: {description}, Parent: {parent_category_id}, Sub: {sub_category_id}, Child: {child_category_id}, Materials: {materials}, Price: {price}, Stock: {stock}")

    # ดึงหมวดหมู่จากฐานข้อมูล
    parent_category = get_object_or_404(Category, id=parent_category_id)
    sub_category = get_object_or_404(Category, id=sub_category_id)
    child_category = get_object_or_404(Category, id=child_category_id)

    # สร้างสินค้า
    product = Product.objects.create(
        name=name,
        description=description,
        parent_category=parent_category,
        sub_category=sub_category,
        child_category=child_category,
        materials=materials,
        price=price,
        stock=stock
    )

    return Response({'message': 'Product created successfully', 'product': product.id})


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()  # Fetch all products
    serializer = ProductSerializer(products, many=True)  # Ensure 'many=True' for array serialization
    return Response(serializer.data)


@api_view(['DELETE'])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def category_list(request):
    categories = Category.objects.all()  # Fetch all categories
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)





# View สำหรับการอัปเดตรูปภาพสินค้า
class ProductImageUpdateView(APIView):
    def put(self, request, image_id):
        try:
            product_image = ProductImage.objects.get(id=image_id)
        except ProductImage.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ProductImageSerializer(product_image, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View สำหรับการอัปโหลดรูปภาพสินค้า
class ProductImageUploadView(APIView):
    def post(self, request, format=None):
        serializer = ProductImageUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


# View สำหรับลบรูปภาพสินค้า
class ProductImageDeleteView(generics.DestroyAPIView):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [IsAdminUser]  # ปรับตามความต้องการของคุณ





@api_view(['GET'])
@permission_classes([AllowAny])
def female_products(request):
    # กรองสินค้าที่มี parent_category_id เป็น 3
    female_products = Product.objects.filter(parent_category_id=3)
    serializer = ProductSerializer(female_products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def male_products(request):
    # กรองสินค้าที่มี parent_category_id เป็น 3
    male_products = Product.objects.filter(parent_category_id=2)
    serializer = ProductSerializer(male_products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# # ViewSet 
# class CategoryViewSet(viewsets.ModelViewSet):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer
#     permission_classes = [AllowAny]






@api_view(['GET'])
@permission_classes([AllowAny])  # กำหนดให้ทุกคนเข้าถึงได้
def male_subcategories(request):
    
    mensubcategories = Category.objects.filter(id=2)  # หมวดหมู่ที่มีพ่อ
    serializer = CategorySerializer(mensubcategories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def maletop_subcategories(request):
    try:
        category = Category.objects.get(id=15)
        subcategories = category.subcategories.all()
        serializer = CategorySerializer(subcategories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def malebottom_subcategories(request):
    try:
        category = Category.objects.get(id=16)
        subcategories = category.subcategories.all()
        serializer = CategorySerializer(subcategories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def malebags_subcategories(request):
    try:
        category = Category.objects.get(id=47)
        subcategories = category.subcategories.all()
        serializer = CategorySerializer(subcategories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)







@api_view(['GET'])
@permission_classes([AllowAny])
def female_subcategories(request):

    femaletopsubcategories = Category.objects.filter(id=3)
    serializer = CategorySerializer(femaletopsubcategories,many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)




@api_view(['GET'])
@permission_classes([AllowAny])
def femaletop_subcategories(request):
    try:
        category = Category.objects.get(id=17)
        subcategories = category.subcategories.all()
        serializer = CategorySerializer(subcategories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([AllowAny])
def femalebottom_subcategories(request):
    try:
        category = Category.objects.get(id=18)
        subcategories = category.subcategories.all()
        serializer = CategorySerializer(subcategories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
@permission_classes([AllowAny])
def femalebags_subcategories(request):
    try:
        category = Category.objects.get(id=48)
        subcategories = category.subcategories.all()
        serializer = CategorySerializer(subcategories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found.'}, status=status.HTTP_404_NOT_FOUND)













## สินค้า

@api_view(['GET'])
@permission_classes([AllowAny])
def maleshirt(request):
    try:
        # ดึงสินค้าที่มี child_category_id = 19
        products = Product.objects.filter(child_category_id=19)
        print(f"Number of products fetched: {products.count()}")  # Debug: จำนวนสินค้า
        print(f"Products: {products}")  # Debug: แสดงข้อมูลสินค้าที่ถูกดึงมา

        if not products.exists():
            return Response({'error': 'No products found for this child category.'}, status=status.HTTP_404_NOT_FOUND)

        # ใช้ ProductSerializer เพื่อ serialize ข้อมูลสินค้า
        serializer = ProductSerializer(products, many=True)
        print(f"Serialized data: {serializer.data}")  # Debug: ข้อมูลที่ serialize

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {str(e)}")  # Debug: ข้อผิดพลาด
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
@permission_classes([AllowAny])
def malepolo(request):
    try:
        # ดึงสินค้าที่มี child_category_id = 19
        products = Product.objects.filter(child_category_id=20)
        print(f"Number of products fetched: {products.count()}")  # Debug: จำนวนสินค้า
        print(f"Products: {products}")  # Debug: แสดงข้อมูลสินค้าที่ถูกดึงมา

        if not products.exists():
            return Response({'error': 'No products found for this child category.'}, status=status.HTTP_404_NOT_FOUND)

        # ใช้ ProductSerializer เพื่อ serialize ข้อมูลสินค้า
        serializer = ProductSerializer(products, many=True)
        print(f"Serialized data: {serializer.data}")  # Debug: ข้อมูลที่ serialize

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {str(e)}")  # Debug: ข้อผิดพลาด
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['GET'])
@permission_classes([AllowAny])
def malet_shirt(request):
    try:
        # ดึงสินค้าที่มี child_category_id = 19
        products = Product.objects.filter(child_category_id=21)
        print(f"Number of products fetched: {products.count()}")  # Debug: จำนวนสินค้า
        print(f"Products: {products}")  # Debug: แสดงข้อมูลสินค้าที่ถูกดึงมา

        if not products.exists():
            return Response({'error': 'No products found for this child category.'}, status=status.HTTP_404_NOT_FOUND)

        # ใช้ ProductSerializer เพื่อ serialize ข้อมูลสินค้า
        serializer = ProductSerializer(products, many=True)
        print(f"Serialized data: {serializer.data}")  # Debug: ข้อมูลที่ serialize

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {str(e)}")  # Debug: ข้อผิดพลาด
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def products_by_subcategory2(request, subcategory_type):
    try:
        # Assuming 'name' field is unique for each subcategory
        category = Category.objects.get(name=subcategory_type)
        products = Product.objects.filter(child_category=category)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Category.DoesNotExist:
        return Response({'error': 'Subcategory not found.'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
@permission_classes([AllowAny])
def products_by_subcategory(request, subcategory_type):
    try:
        # ค้นหา Category ที่ชื่อ subcategory_type
        category = Category.objects.get(name=subcategory_type)

        # ดึงสินค้าทั้งหมดที่มี subcategory เป็นหมวดหมู่นั้น
        products = Product.objects.filter(sub_category=category)

        # แปลงข้อมูลสินค้าเป็น JSON ด้วย Serializer
        serializer = ProductSerializer(products, many=True)

        # ส่งข้อมูลกลับพร้อมสถานะ HTTP 200 OK
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Category.DoesNotExist:
        # กรณีไม่พบหมวดหมู่ย่อย ส่งกลับ 404
        return Response(
            {'error': f'Subcategory "{subcategory_type}" not found.'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def products_by_childcategory(request, child_category_id):
    try:
        # ดึงข้อมูลสินค้าจาก child_category_id ที่ระบุ
        products = Product.objects.filter(child_category_id=child_category_id)
        
        # ตรวจสอบว่ามีสินค้าที่ตรงกันหรือไม่
        if not products.exists():
            return Response({'error': 'No products found for this child category.'}, status=status.HTTP_404_NOT_FOUND)
        
        # ใช้ ProductSerializer เพื่อ serialize ข้อมูลสินค้า
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Error: {str(e)}")  # Debug: ข้อผิดพลาด
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ConfirmPurchaseAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        user = request.user

        # ดึงโปรไฟล์ผู้ใช้
        try:
            user_profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({'error': 'ไม่พบโปรไฟล์ผู้ใช้'}, status=status.HTTP_404_NOT_FOUND)

        # ตรวจสอบว่าผู้ใช้อัปโหลดสลิปหรือไม่
        slip = request.FILES.get('slip')
        if not slip:
            return Response({'error': 'กรุณาอัปโหลดสลิปการชำระเงิน'}, status=status.HTTP_400_BAD_REQUEST)

        # กำหนดวิธีการชำระเงิน
        payment_method = request.data.get('payment_method', 'Bank Transfer')

        # รับข้อมูลสินค้าที่จะซื้อ
        items_data = request.data.get('items')
        if items_data:
            try:
                items = json.loads(items_data)
            except json.JSONDecodeError:
                return Response({'error': 'ข้อมูลสินค้าที่ส่งมาไม่ถูกต้อง'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # ดึงข้อมูลจากตะกร้า
            try:
                cart = Cart.objects.get(user=user)
            except Cart.DoesNotExist:
                return Response({'error': 'ไม่พบตะกร้าสินค้า'}, status=status.HTTP_404_NOT_FOUND)

            if not cart.items.exists():
                return Response({'error': 'ตะกร้าของคุณว่างเปล่า'}, status=status.HTTP_400_BAD_REQUEST)

            items = []
            for cart_item in cart.items.select_related('product').all():
                items.append({
                    'product_id': cart_item.product.id,
                    'quantity': cart_item.quantity,
                    'size_id': cart_item.sizes.id if cart_item.sizes else None
                })

        with transaction.atomic():
            # สร้างคำสั่งซื้อ
            order = Order.objects.create(
                user=user,
                status='Pending',
                shipping_address=user_profile.address,
                phone_number=user_profile.phone_number,
                total_price=0
            )

            total_price = 0
            # สร้างรายการคำสั่งซื้อ
            for item in items:
                product_id = item.get('product_id')
                quantity = item.get('quantity', 1)
                size_id = item.get('size_id')

                try:
                    product = Product.objects.get(id=product_id)
                except Product.DoesNotExist:
                    transaction.set_rollback(True)
                    return Response({'error': f'ไม่พบสินค้า ID {product_id}'}, status=status.HTTP_404_NOT_FOUND)

                if product.stock < quantity:
                    transaction.set_rollback(True)
                    return Response({'error': f'สินค้าคงเหลือไม่เพียงพอสำหรับ {product.name}'}, status=status.HTTP_400_BAD_REQUEST)

                # สร้าง OrderItem และเก็บข้อมูลขนาดถ้าจำเป็น
                order_item = OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=product.price,
                    sizes_id=size_id  # เพิ่มฟิลด์ sizes_id ถ้ามีในโมเดล
                )

                # อัปเดตสต็อกสินค้า
                product.stock -= quantity
                product.save()

                total_price += product.price * quantity

            # อัปเดตราคารวมของคำสั่งซื้อ
            order.total_price = total_price
            order.save()

            # สร้างข้อมูลการชำระเงิน
            transaction_id = str(uuid.uuid4())
            Payment.objects.create(
                order=order,
                amount=total_price,
                payment_method=payment_method,
                payment_status='Pending',
                transaction_id=transaction_id,
                payment_slip=slip
            )

            # ล้างตะกร้าหลังการสั่งซื้อถ้าซื้อจากตะกร้า
            if not items_data:
                cart.items.all().delete()

        return Response({
            'message': 'การยืนยันการซื้อสำเร็จ',
            'order_id': order.id,
            'total_price': order.total_price
        }, status=status.HTTP_201_CREATED)

class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]


# Admin view to list all orders
class AdminOrderListAPIView(ListAPIView):
    queryset = Order.objects.all() # จัดเรียงออเดอร์ใหม่ล่าสุดก่อน
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        new_status = request.data.get('status')

        if new_status not in ['Pending', 'Confirmed', 'Paid', 'Shipped', 'Delivered', 'Canceled']:
            return Response({'error': 'สถานะไม่ถูกต้อง'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save()

        return Response({'message': 'อัปเดตสถานะสำเร็จ'}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'error': 'ไม่พบออเดอร์'}, status=status.HTTP_404_NOT_FOUND)
    
# API View for User Settings
class UserSettingsAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSettingsSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        return self.request.user

@api_view(['GET'])
@permission_classes([IsAdminUser])  # สำหรับสิทธิ์เฉพาะแอดมิน
def top_sale_products(request):
    top_sales = (
        OrderItem.objects.values('product__name')  # ดึงข้อมูลสินค้าตามชื่อ
        .annotate(total_quantity=Sum('quantity'))  # รวมจำนวนที่ถูกซื้อ
        .order_by('-total_quantity')  # จัดเรียงตามจำนวนจากมากไปน้อย
    )
    return Response(top_sales, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])  # จำกัดสิทธิ์ให้เฉพาะแอดมิน
def total_sales_per_user(request):
    user_sales = []
    for user in User.objects.all():
        orders = Order.objects.filter(user=user)
        if orders.exists():
            order_details = [
                {"order_id": order.id, "order_total": order.total_price}
                for order in orders
            ]
            total_spent = orders.aggregate(Sum('total_price'))['total_price__sum']
            user_sales.append({
                "username": user.username,
                "total_spent": total_spent,
                "orders": order_details
            })

    total_sales = Order.objects.aggregate(total_sales=Sum('total_price'))['total_sales']
    
    return Response({
        'user_sales': user_sales,
        'total_sales': total_sales,
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def total_sales(request):
    total_sales = Order.objects.aggregate(total=Sum('total_price'))['total']
    return Response({'total_sales': total_sales})