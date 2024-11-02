from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,ProductCreateAPIView, CategoryViewSet,SizeListCreateAPIView, SizeDetailAPIView,get_parent_categories, get_subcategories, get_child_categories,ProductImageUploadView,ProductImageDeleteView,female_products,male_products,male_subcategories,maletop_subcategories,malebottom_subcategories,malebags_subcategories,female_subcategories,femalebottom_subcategories,femalebags_subcategories, get_subcategories
from .views import malepolo,malet_shirt,maleshirt,products_by_subcategory,products_by_childcategory,femaletop_subcategories,products_by_subcategory2,ConfirmPurchaseAPIView,OrderDetailAPIView,RegisterAPIView,AdminOrderListAPIView,update_order_status,UserSettingsAPIView,top_sale_products,total_sales_per_user,total_sales
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



    path('malesubcategories/',male_subcategories,name='male-subcategories'),
    path('maletopsubcategories/',maletop_subcategories,name='maletop-subcategories'),
     path('malebottomsubcategories/',malebottom_subcategories,name='malebottom-subcategories'),
     path('malebagssubcategories/',malebags_subcategories,name='malebags-subcategories'),

    
    path('femalesubcategories/',female_subcategories,name='female-subcategories'),
     path('femalebottomsubcategories/',femalebottom_subcategories,name='femalebottom-subcategories'),
     path('femalebagssubcategories/',femalebags_subcategories,name='femalebags-subcategories'),



      path('categories/<int:category_id>/subcategories/', get_subcategories, name='get-subcategories'),


    


    path('maleshirt',maleshirt,name='get-maleshirt'),
      path('malepolo',malepolo,name='get-malepolo'),
      path('maletshirt',malet_shirt,name='get-malet_shirt'),



    
    path('femaletopsubcategories/',femaletop_subcategories,name='femaletop-subcategories'),

    path('femalebottomsubcategories/',femalebottom_subcategories,name='femalebottom_subcategories'),
    path('femalebagsubcategories/',femalebags_subcategories,name='femalebags_subcategories'),
    
    # urls.py
    path('topsaleproducts/', top_sale_products, name='top-sale-products'),
    path('totalsales/',total_sales_per_user, name='total-sales-per-user'),
    path('admin/total-sales-amount/',total_sales, name='total-sales'),

     path('register/', RegisterAPIView.as_view(), name='register'),
     path('adminorders/', AdminOrderListAPIView.as_view(), name='admin-order-list'),
     path('adminorders/<int:order_id>/update-status/', update_order_status, name='update-order-status'), 
     path('confirm-purchase/', ConfirmPurchaseAPIView.as_view(), name='confirm-purchase'),
     path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='order-detail'),
     
     path('user-info/', UserSettingsAPIView.as_view(), name='user-info'),
      # Dynamic endpoint for subcategories
       path('<str:subcategory_type>/', products_by_subcategory2, name='products-by-subcategory'),
    path('categoryproducts/<str:subcategory_type>/', products_by_subcategory, name='products-by-subcategory'),
    path('products/childcategory/<int:child_category_id>/', products_by_childcategory, name='products-by-childcategory'),

    # ใช้ router สำหรับจัดการ categories
    path('', include(router.urls)),

      




]
