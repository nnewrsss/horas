# from django.urls import path
# from . import views

# urlpatterns = [
#     path("notes/", views.NoteListCreate.as_view(), name="note-list"),
#     path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
# ]


from django.urls import path
from . import views

app_name = 'myapp'
urlpatterns = [
    # URL สำหรับการจัดการสินค้า
    path("products/", views.ProductListCreateAPIView.as_view(), name="product-list"),
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
]
