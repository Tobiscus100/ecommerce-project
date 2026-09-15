from django.contrib import admin
from .models import Category, Product, Order, OrderItem

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

class ProductAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'category', 'price', 'brand', 'countInStock']
    list_filter = ['category', 'brand']
    search_fields = ['name', 'brand']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

class OrderAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user', 'totalPrice', 'isPaid', 'paidAt', 'createdAt']
    list_filter = ['isPaid', 'createdAt']
    inlines = [OrderItemInline]

admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)