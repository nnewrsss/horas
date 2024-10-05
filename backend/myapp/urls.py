from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,ProductCreateAPIView, CategoryViewSet,SizeListCreateAPIView, SizeDetailAPIView,get_parent_categories, get_subcategories, get_child_categories,ProductImageUploadView,ProductImageDeleteView,female_products,male_products
from . import views


router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)

app_name = 'myapp'

urlpatterns = [
    # URL สำหรับการจัดการสินค้า
    path('products/', ProductCreateAPIView.as_view(), name='product_create'),  # รองรับการสร้างสินค้า,  # ใช้ router สำหรับจัดการ products
    path('productsviews/', views.get_products, name='get_products'),
    path("products/<int:pk>/", views.ProductDetailAPIView.as_view(), name="product-detail"),

    # URL สำหรับตะกร้าสินค้า
    path("cart/", views.CartAPIView.as_view(), name="cart"),
    path("cart/add/", views.AddToCartAPIView.as_view(), name="add-to-cart"),
    path("cart/remove/", views.RemoveFromCartAPIView.as_view(), name="remove-from-cart"),

    # URL สำหรับคำสั่งซื้อ
    path("orders/", views.OrderListCreateAPIView.as_view(), name="order-list"),
    path("orders/<int:pk>/", views.OrderDetailAPIView.as_view(), name="order-detail"),

    # URL สำหรับการสร้างผู้ใช้ใหม่
    path("create-user/", views.CreateUserAPIView.as_view(), name="create-user"),

    # URL สำหรับข้อมูลโปรไฟล์ผู้ใช้
    path('userprofile/<str:username>/', views.UserProfileDetailView.as_view(), name='userprofile-detail'),

    

     path('productimages/<int:image_id>/', views.ProductImageUpdateView.as_view(), name='product-image-update'),
    path('sizes/', SizeListCreateAPIView.as_view(), name='size-list-create'),
    path('sizes/<int:pk>/', SizeDetailAPIView.as_view(), name='size-detail'),




path('products/male/', male_products, name='male-products'),
path('products/female/', female_products, name='female-products'),
path('upload-product-image/', ProductImageUploadView.as_view(), name='upload_product_image'),
path('api/productimages/<int:pk>/', ProductImageDeleteView.as_view(), name='delete-product-image'),  # เพิ่ม URL สำหรับลบรูปภาพ
     path('parentcategories/', get_parent_categories, name='parent-categories'),
    path('subcategories/', get_subcategories, name='sub-categories'),
    path('childcategories/', get_child_categories, name='child-categories'),
    # ใช้ router สำหรับจัดการ categories
    path('', include(router.urls)),

      




]
