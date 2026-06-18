import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Product

print("Wiping database for the highly optimized 25-item high-res catalog...")
Product.objects.all().delete()

# Exactly 5 familiar, distinct items per department with verified direct image links
premium_items = [
    # --- ELECTRONICS (5 Items) ---
    {
        'name': 'Samsung 65-inch 4K Smart QLED TV', 'brand': 'Samsung', 'category': 'Electronics', 'price': 899.99, 'countInStock': 5, 
        'image': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500',
        'description': 'Experience breathtaking color clarity with an intelligent 4K processor and built-in streaming apps.'
    },
    {
        'name': 'Apple Watch Series 9 GPS', 'brand': 'Apple', 'category': 'Electronics', 'price': 399.00, 'countInStock': 12, 
        'image': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500',
        'description': 'Advanced health tracking, a brighter display, and faster performance to keep you connected.'
    },
    {
        'name': 'Canon EOS R5 Mirrorless Camera', 'brand': 'Canon', 'category': 'Electronics', 'price': 2499.00, 'countInStock': 3, 
        'image': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
        'description': 'Professional grade mirrorless camera featuring 45 Megapixel stills and internal 8K video recording.'
    },
    {
        'name': 'Sony WH-1000XM5 Wireless Headphones', 'brand': 'Sony', 'category': 'Electronics', 'price': 348.00, 'countInStock': 15, 
        'image': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
        'description': 'Industry-leading noise cancellation and magnificent audio fidelity with crystal-clear hands-free calling.'
    },
    {
        'name': 'Apple MacBook Pro 14-inch M3', 'brand': 'Apple', 'category': 'Electronics', 'price': 1599.00, 'countInStock': 8, 
        'image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        'description': 'Supercharged by the M3 chip, delivering extreme speed and staggering battery life for power users.'
    },

    # --- ACCESSORIES (5 Items) ---
    {
        'name': 'Rolex Oyster Perpetual Luxury Watch', 'brand': 'Rolex', 'category': 'Accessories', 'price': 6500.00, 'countInStock': 2, 
        'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        'description': 'Timeless mechanical luxury watch crafted from premium corrosion-resistant stainless steel.'
    },
    {
        'name': 'Ray-Ban Classic Wayfarer Sunglasses', 'brand': 'Ray-Ban', 'category': 'Accessories', 'price': 163.00, 'countInStock': 30, 
        'image': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
        'description': 'The iconic silhouette with crystal clear polarized protection lenses and full UV safety.'
    },
    {
        'name': '18k Gold Minimalist Chain Necklace', 'brand': 'JewelCraft', 'category': 'Accessories', 'price': 249.00, 'countInStock': 15, 
        'image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
        'description': 'Elegant, finely polished solid gold layering chain necklace for sophisticated daily wear.'
    },
    {
        'name': 'Fossil Men Leather Minimalist Wallet', 'brand': 'Fossil', 'category': 'Accessories', 'price': 48.00, 'countInStock': 50, 
        'image': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
        'description': 'Genuine bifold slim leather wallet featuring clear card layout slots and a transparent ID window.'
    },
    {
        'name': 'Nike Air Heritage Urban Backpack', 'brand': 'Nike', 'category': 'Accessories', 'price': 45.00, 'countInStock': 35, 
        'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        'description': 'Spacious dual-zipper compartment with an integrated padded notebook/laptop sleeve.'
    },

    # --- APPAREL (5 Items) ---
    {
        'name': 'Nike Air Max 270 Sneakers', 'brand': 'Nike', 'category': 'Apparel', 'price': 160.00, 'countInStock': 14, 
        'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        'description': 'Nikes first lifestyle Air Max unit shoe delivering premium visible bounce with every step.'
    },
    {
        'name': 'Adidas Essentials Fleece Hoodie', 'brand': 'Adidas', 'category': 'Apparel', 'price': 65.00, 'countInStock': 25, 
        'image': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        'description': 'Ultra-soft cotton blend overhead casual sweater hoodie with classic athletic comfort.'
    },
    {
        'name': 'Levi Strauss Premium Denim Jacket', 'brand': 'Levis', 'category': 'Apparel', 'price': 98.00, 'countInStock': 12, 
        'image': 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
        'description': 'An American style staple since 1967. Sturdy unlined raw denim wash button-up coat.'
    },
    {
        'name': 'Puma Slim Fit Training Trackpants', 'brand': 'Puma', 'category': 'Apparel', 'price': 45.00, 'countInStock': 30, 
        'image': 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=500',
        'description': 'Moisture-managing active polyester sports sweatpants with side pockets and zippered ankles.'
    },
    {
        'name': 'Calvin Klein White Crewneck Tee', 'brand': 'Calvin Klein', 'category': 'Apparel', 'price': 35.00, 'countInStock': 100, 
        'image': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
        'description': 'Classic knit cotton foundational premium plain white casual tee shirt.'
    },

    # --- HOME & KITCHEN (5 Items) ---
    {
        'name': 'Nespresso Vertuo Capsule Coffee Maker', 'brand': 'Nespresso', 'category': 'Home & Kitchen', 'price': 179.00, 'countInStock': 11, 
        'image': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500',
        'description': 'Automatic pod-based countertop machine outputting single barista-grade espresso coffee cups.'
    },
    {
        'name': 'Ninja Professional 1000W Kitchen Blender', 'brand': 'Ninja', 'category': 'Home & Kitchen', 'price': 99.99, 'countInStock': 15, 
        'image': 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=500',
        'description': 'High-velocity crushing blades perfect for forging ice, vegetables, and frozen fruit smoothies.'
    },
    {
        'name': 'Ceramic Matte Black Dinnerware 16pc Set', 'brand': 'StudioHome', 'category': 'Home & Kitchen', 'price': 85.00, 'countInStock': 20, 
        'image': 'https://picsum.photos/id/102/600/500',        'description': 'Contemporary heavy stoneware round plates and bowls set finished with elegant satin dark glazes.'
    },
    {
        'name': 'Teflon Non-Stick Cookware Frying Pan 12in', 'brand': 'T-fal', 'category': 'Home & Kitchen', 'price': 34.50, 'countInStock': 25, 
        'image': 'https://picsum.photos/id/312/600/500',        'description': 'Heavy-gauge aluminum skillet pan with thermo-spot indicators for effortless daily meal cooking.'
    },
    {
        'name': 'Scented Organic Lavender Soy Wax Jar Candle', 'brand': 'Ember', 'category': 'Home & Kitchen', 'price': 22.00, 'countInStock': 45, 
        'image': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500',
        'description': 'Calming lavender and warm vanilla oil blend candle poured inside a clean frosted glass jar.'
    },

    # --- FITNESS (5 Items) ---
    {
        'name': 'Bowflex SelectTech Adjustable Dumbbells', 'brand': 'Bowflex', 'category': 'Fitness', 'price': 329.00, 'countInStock': 5, 
        'image': 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500',
        'description': 'Smart selector dial weight lifting dumbbell system replacing entire rows of scattered metals.'
    },
    {
        'name': 'Lululemon 5mm Cushion Yoga Exercise Mat', 'brand': 'Lululemon', 'category': 'Fitness', 'price': 78.00, 'countInStock': 30, 
        'image': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
        'description': 'Natural rubber workout yoga mat offering total structural joint safety and ground traction.'
    },
    {
        'name': 'Speedo Weighted Cardio Speed Jump Rope', 'brand': 'Speedo', 'category': 'Fitness', 'price': 19.99, 'countInStock': 100, 
        'image': 'https://picsum.photos/id/1067/600/500',
        'description': 'Smooth high-speed ball-bearing skipping rope cords designed for quick cardio training.'
    },
    {
        'name': 'Everlast Pro Style Boxing Training Gloves', 'brand': 'Everlast', 'category': 'Fitness', 'price': 65.00, 'countInStock': 15, 
        'image': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500',
        'description': 'Premium synthetic padding boxing gloves contouring to fists for absolute wrist defense.'
    },
    {
        'name': 'Fitbit Charge 6 Smart Activity Tracker', 'brand': 'Fitbit', 'category': 'Fitness', 'price': 159.95, 'countInStock': 14, 
        'image': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500',
        'description': 'Slim bands tracking real-time pulse metrics, distance step counts, and sleep cycles.'
    }
]

for item in premium_items:
    assigned_rating = round(random.uniform(4.4, 5.0), 1)
    assigned_reviews = random.randint(15, 120)
    
    Product.objects.create(
        name=item['name'],
        image=item['image'],
        description=item['description'],
        brand=item['brand'],
        category=item['category'],
        price=item['price'],
        countInStock=item['countInStock'],
        rating=assigned_rating,
        numReviews=assigned_reviews
    )

print(f"Successfully populated database with exactly {len(premium_items)} premium products!")