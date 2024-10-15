<<<<<<< HEAD
#o1mini
# views.py

=======

#o1mini
# views.py

>>>>>>> main
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
)
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser
from .permissions import IsAdminUser
<<<<<<< HEAD
from rest_framework.decorators import api_view, permission_classes
import json
=======
from rest_framework.decorators import api_view, permission_classes,action
import json
from django.shortcuts import get_object_or_404
>>>>>>> main

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
class AddToCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        user = request.user

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response({'error': 'Not enough stock'}, status=status.HTTP_400_BAD_REQUEST)

        cart, created = Cart.objects.get_or_create(user=user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response({'message': 'Product added to cart'}, status=status.HTTP_200_OK)

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

<<<<<<< HEAD
# ViewSet สำหรับหมวดหมู่
=======

   

# ViewSet 
>>>>>>> main
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

<<<<<<< HEAD
=======

>>>>>>> main
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
<<<<<<< HEAD
    permission_classes = [IsAdminUser]  # ปรับตามความต้องการของคุณ
=======
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
def products_by_subcategory(request, subcategory_type):
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
>>>>>>> main
