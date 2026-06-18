import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Product

print("Wiping old records for a highly recognizable catalog rewrite...")
Product.objects.all().delete()

# 50 completely familiar items with bulletproof, high-matching Unsplash links
premium_items = [
    # --- ELECTRONICS (10 Items: TVs, Smartwatches, Cameras, Laptops) ---
    {
        'name': 'Samsung 65-inch 4K Smart QLED TV', 'brand': 'Samsung', 'category': 'Electronics', 'price': 899.99, 'countInStock': 5,
        'image': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&q=80',
        'description': 'Experience breathtaking color clarity with an intelligent 4K processor and built-in streaming apps.'
    },
    {
        'name': 'Apple Watch Series 9 GPS', 'brand': 'Apple', 'category': 'Electronics', 'price': 399.00, 'countInStock': 12,
        'image': 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80',
        'description': 'Advanced health tracking, a brighter display, and faster performance to keep you connected.'
    },
    {
        'name': 'Canon EOS R5 Mirrorless Camera', 'brand': 'Canon', 'category': 'Electronics', 'price': 2499.00, 'countInStock': 3,
        'image': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
        'description': 'Professional grade mirrorless camera featuring 45 Megapixel stills and internal 8K video recording.'
    },
    {
        'name': 'Sony WH-1000XM5 Wireless Headphones', 'brand': 'Sony', 'category': 'Electronics', 'price': 348.00, 'countInStock': 15,
        'image': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80',
        'description': 'Industry-leading noise cancellation and magnificent audio fidelity with crystal-clear hands-free calling.'
    },
    {
        'name': 'Apple MacBook Pro 14-inch M3', 'brand': 'Apple', 'category': 'Electronics', 'price': 1599.00, 'countInStock': 8,
        'image': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        'description': 'Supercharged by the M3 chip, delivering extreme speed and staggering battery life for power users.'
    },
    {
        'name': 'HP 24-inch Full HD Desktop Monitor', 'brand': 'HP', 'category': 'Electronics', 'price': 149.99, 'countInStock': 20,
        'image': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
        'description': 'Sleek, borderless display monitor perfect for clear text viewing and multitasking comfort.'
    },
    {
        'name': 'Apple iPad Air 11-inch Wi-Fi', 'brand': 'Apple', 'category': 'Electronics', 'price': 599.00, 'countInStock': 10,
        'image': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        'description': 'Incredibly thin design featuring the breakthrough M2 chip and a gorgeous Liquid Retina display.'
    },
    {
        'name': 'Sony PlayStation 5 Console Slim', 'brand': 'Sony', 'category': 'Electronics', 'price': 499.99, 'countInStock': 6,
        'image': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80',
        'description': 'Experience lightning-fast loading speeds, deeper immersion with haptic feedback, and an incredible library of games.'
    },
    {
        'name': 'Logitech G502 Gaming Wireless Mouse', 'brand': 'Logitech', 'category': 'Electronics', 'price': 119.50, 'countInStock': 25,
        'image': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
        'description': 'High-performance optical sensor mouse with custom programmable buttons and zero latency.'
    },
    {
        'name': 'Anker 10,000mAh Portable Power Bank', 'brand': 'Anker', 'category': 'Electronics', 'price': 29.99, 'countInStock': 40,
        'image': 'https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600&q=80',
        'description': 'Ultra-slim external battery pack providing high-speed universal charging for smartphones.'
    },

    # --- ACCESSORIES (10 Items: Watches, Necklaces, Glasses, Backpacks) ---
    {
        'name': 'Rolex Oyster Perpetual Luxury Watch', 'brand': 'Rolex', 'category': 'Accessories', 'price': 6500.00, 'countInStock': 2,
        'image': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
        'description': 'Timeless classic premium Swiss mechanical luxury watch crafted from corrosion-resistant steel.'
    },
    {
        'name': 'Ray-Ban Classic Wayfarer Sunglasses', 'brand': 'Ray-Ban', 'category': 'Accessories', 'price': 163.00, 'countInStock': 30,
        'image': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
        'description': 'The iconic silhouette with crystal clear polarized green lenses and total UV safety.'
    },
    {
        'name': '18k Gold Minimalist Chain Necklace', 'brand': 'JewelCraft', 'category': 'Accessories', 'price': 249.00, 'countInStock': 15,
        'image': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
        'description': 'Elegant, finely polished solid gold layering chain statement necklace for daily wear.'
    },
    {
        'name': 'Fossil Men Leather Minimalist Wallet', 'brand': 'Fossil', 'category': 'Accessories', 'price': 48.00, 'countInStock': 50,
        'image': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80',
        'description': 'Genuine bifold slim leather wallet featuring clear card layout slots and a flip ID window.'
    },
    {
        'name': 'Nike Air Heritage Urban Backpack', 'brand': 'Nike', 'category': 'Accessories', 'price': 45.00, 'countInStock': 35,
        'image': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
        'description': 'Spacious dual-zipper main school or travel compartment with an integrated padded laptop sleeve.'
    },
    {
        'name': 'Gucci Premium Leather Waist Belt', 'brand': 'Gucci', 'category': 'Accessories', 'price': 420.00, 'countInStock': 5,
        'image': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80',
        'description': 'Luxury smooth black Italian calfskin leather designer belt with an iconic metal interlocking buckle.'
    },
    {
        'name': 'Casio Vintage Digital Sport Watch', 'brand': 'Casio', 'category': 'Accessories', 'price': 25.00, 'countInStock': 100,
        'image': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80',
        'description': 'Classic metallic retro digital stopwatch watch featuring a daily alarm and micro light.'
    },
    {
        'name': 'Silver Diamond Stud Earrings Set', 'brand': 'JewelCraft', 'category': 'Accessories', 'price': 129.00, 'countInStock': 20,
        'image': 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=600&q=80',
        'description': 'Brilliant round-cut cubic zirconia gems mounted on pure sterling silver base studs.'
    },
    {
        'name': 'Herschel Supply Co. Classic Travel Duffle', 'brand': 'Herschel', 'category': 'Accessories', 'price': 89.99, 'countInStock': 18,
        'image': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
        'description': 'The perfect weekend travel canvas duffle bag with a custom shoe compartment lining.'
    },
    {
        'name': 'Stainless Steel Minimalist Key Ring', 'brand': 'Orbit', 'category': 'Accessories', 'price': 15.00, 'countInStock': 75,
        'image': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&q=80',
        'description': 'Heavy-duty aircraft grade securing wire loop clip for pocket key management.'
    },

    # --- APPAREL (10 Items: Tees, Hoodies, Sneakers, Jackets) ---
    {
        'name': 'Nike Air Max 270 Sneakers', 'brand': 'Nike', 'category': 'Apparel', 'price': 160.00, 'countInStock': 14,
        'image': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        'description': 'Nikes first lifestyle Air max unit shoe delivering visible bounce with every single step.'
    },
    {
        'name': 'Adidas Essentials Fleece Hoodie', 'brand': 'Adidas', 'category': 'Apparel', 'price': 65.00, 'countInStock': 25,
        'image': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
        'description': 'Ultra-soft cotton blend overhead casual sweater hoodie with classic ribbed hem cuffing.'
    },
    {
        'name': 'Levi Strauss Premium Denim Jacket', 'brand': 'Levis', 'category': 'Apparel', 'price': 98.00, 'countInStock': 12,
        'image': 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80',
        'description': 'An architectural staple since 1967. Sturdy unlined raw denim fit buttons jacket.'
    },
    {
        'name': 'Puma Slim Fit Training Trackpants', 'brand': 'Puma', 'category': 'Apparel', 'price': 45.00, 'countInStock': 30,
        'image': 'https://images.unsplash.com/photo-1551854838-212c50b4c184?w=600&q=80',
        'description': 'Moisture-managing active polyester sweatpants with zippered ankle panels for easy changes.'
    },
    {
        'name': 'Calvin Klein Plain White Crewneck Tee', 'brand': 'Calvin Klein', 'category': 'Apparel', 'price': 35.00, 'countInStock': 100,
        'image': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
        'description': 'Classic cotton knit signature foundational white tee shirt offering breathable light wear.'
    },
    {
        'name': 'The North Face Hooded Rain Windbreaker', 'brand': 'The North Face', 'category': 'Apparel', 'price': 110.00, 'countInStock': 10,
        'image': 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&q=80',
        'description': 'Fully waterproof breathable outer shell layer made for outdoor weather protection.'
    },
    {
        'name': 'Timberland 6-inch Waterproof Leather Boots', 'brand': 'Timberland', 'category': 'Apparel', 'price': 198.00, 'countInStock': 8,
        'image': 'https://images.unsplash.com/photo-1638247025967-b4e38f6893b4?w=600&q=80',
        'description': 'The iconic heavy-duty nubuck leather boots insulated with rustproof hardware eyelets.'
    },
    {
        'name': 'Champion Reverse Weave Casual Sweatshirt', 'brand': 'Champion', 'category': 'Apparel', 'price': 55.00, 'countInStock': 40,
        'image': 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
        'description': 'Heavyweight athletic cotton blend crewneck sweater built to resist vertical shrinkage.'
    },
    {
        'name': 'Zara Tailored Fit Wool Winter Coat', 'brand': 'Zara', 'category': 'Apparel', 'price': 149.00, 'countInStock': 15,
        'image': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&q=80',
        'description': 'Elegant mid-length button closure modern lapel overcoat crafted with comfortable heavy wool.'
    },
    {
        'name': 'Under Armour Gym Performance Shorts', 'brand': 'Under Armour', 'category': 'Apparel', 'price': 30.00, 'countInStock': 60,
        'image': 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
        'description': 'Lightweight technical fabric shorts engineered to wick sweat away during intense training.'
    },

    # --- HOME & KITCHEN (10 Items: Blenders, Coffee Makers, Dinnerware, Rugs) ---
    {
        'name': 'Nestle Nespresso Vertuo Coffee Maker', 'brand': 'Nespresso', 'category': 'Home & Kitchen', 'price': 179.00, 'countInStock': 11,
        'image': 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80',
        'description': 'Automatic capsule brewing machine outputting single barista-grade espresso cups.'
    },
    {
        'name': 'Ninja Professional 1000W Kitchen Blender', 'brand': 'Ninja', 'category': 'Home & Kitchen', 'price': 99.99, 'countInStock': 15,
        'image': 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600&q=80',
        'description': 'High-velocity crush blades perfect for pulverizing ice, frozen fruits, and green smoothies.'
    },
    {
        'name': 'Ceramic Matte Black Dinnerware 16pc Set', 'brand': 'StudioHome', 'category': 'Home & Kitchen', 'price': 85.00, 'countInStock': 20,
        'image': 'https://images.unsplash.com/photo-1543510473-ac2c35329a28?w=600&q=80',
        'description': 'Contemporary stoneware plates and bowls set finished with elegant satin dark glazes.'
    },
    {
        'name': 'Teflon Non-Stick Frying Pan 12-inch', 'brand': 'T-fal', 'category': 'Home & Kitchen', 'price': 34.50, 'countInStock': 25,
        'image': 'https://images.unsplash.com/photo-1593617316223-93cf8cb41398?w=600&q=80',
        'description': 'Heavy-gauge aluminum pan with thermo-spot heat indicators for effortless meal cooking.'
    },
    {
        'name': 'Scented Organic Soy Wax Jar Candle', 'brand': 'Ember', 'category': 'Home & Kitchen', 'price': 22.00, 'countInStock': 45,
        'image': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
        'description': 'Lavender and warm vanilla oil blend candle with clean long-burning cotton wicks.'
    },
    {
        'name': 'Traditional Woven Soft Area Rug', 'brand': 'Orbit', 'category': 'Home & Kitchen', 'price': 135.00, 'countInStock': 7,
        'image': 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&q=80',
        'description': 'Low-pile beautifully detailed accent floor mat blanket for dining and living rooms.'
    },
    {
        'name': 'Stainless Steel 2-Slice Bread Toaster', 'brand': 'KitchenAid', 'category': 'Home & Kitchen', 'price': 49.99, 'countInStock': 14,
        'image': 'https://images.unsplash.com/photo-162143407151-7111542de6e8?w=600&q=80',
        'description': 'Extra-wide slot toaster with customizable shade dials and easy pop-out crumb trays.'
    },
    {
        'name': 'Pure Cotton Queen Size Bed Sheet Set', 'brand': 'Solace', 'category': 'Home & Kitchen', 'price': 58.00, 'countInStock': 30,
        'image': 'https://images.unsplash.com/photo-1541558026976-17487a9393a9?w=600&q=80',
        'description': 'Ultra-soft deep pocket four-piece bed set woven with highly breathable natural fibers.'
    },
    {
        'name': 'Thermos Stainless Steel Hot Water Flask', 'brand': 'Thermos', 'category': 'Home & Kitchen', 'price': 27.50, 'countInStock': 40,
        'image': 'https://images.unsplash.com/photo-1619558260268-cde7e03a0152?w=600&q=80',
        'description': 'Vacuum insulated leakproof drink container keeping contents hot or cold all day.'
    },
    {
        'name': 'Natural Bamboo Wood Salad Serving Bowl', 'brand': 'Zest', 'category': 'Home & Kitchen', 'price': 32.00, 'countInStock': 22,
        'image': 'https://images.unsplash.com/photo-1594911774802-8822a707cbb3?w=600&q=80',
        'description': 'Eco-friendly solid bamboo food counter safe bowl equipped with matching salad tossers.'
    },

    # --- FITNESS (10 Items: Dumbbells, Mats, Bikes, Ropes) ---
    {
        'name': 'Bowflex SelectTech Adjustable Dumbbell', 'brand': 'Bowflex', 'category': 'Fitness', 'price': 329.00, 'countInStock': 5,
        'image': 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600&q=80',
        'description': 'Smart selector dial weight lifting system replacing entire rows of scattered metal weights.'
    },
    {
        'name': 'Lululemon 5mm Non-Slip Yoga Mat', 'brand': 'Lululemon', 'category': 'Fitness', 'price': 78.00, 'countInStock': 30,
        'image': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
        'description': 'Natural rubber workout mat offering unparalleled joint support cushioning and floor traction.'
    },
    {
        'name': 'Speedo Weighted Sports Jump Rope', 'brand': 'Speedo', 'category': 'Fitness', 'price': 19.99, 'countInStock': 100,
        'image': 'https://images.unsplash.com/photo-1546483875-5f01450a83d4?w=600&q=80',
        'description': 'Smooth high-speed ball-bearing jumping cords designed for cardio endurance drills.'
    },
    {
        'name': 'Everlast Pro Style Leather Boxing Gloves', 'brand': 'Everlast', 'category': 'Fitness', 'price': 65.00, 'countInStock': 15,
        'image': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
        'description': 'Premium synthetic training gloves contouring to natural fist configurations for hand safety.'
    },
    {
        'name': 'Fitbit Charge 6 Fitness Tracker', 'brand': 'Fitbit', 'category': 'Fitness', 'price': 159.95, 'countInStock': 14,
        'image': 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80',
        'description': 'Slim bands tracking real-time heart metrics, step counts, dynamic activity, and sleep qualities.'
    },
    {
        'name': 'Hydro Tissue Muscle Percussion Massage Gun', 'brand': 'Hydro', 'category': 'Fitness', 'price': 99.00, 'countInStock': 20,
        'image': 'https://images.unsplash.com/photo-1632161917715-dbbe5c61ca81?w=600&q=80',
        'description': 'Deep percussion vibrating nodes easing post-workout tissue knot fatigue.'
    },
    {
        'name': 'Outdoor Parachute Nylon Camping Hammock', 'brand': 'Nomad', 'category': 'Fitness', 'price': 39.50, 'countInStock': 25,
        'image': 'https://images.unsplash.com/photo-1510442650500-93217e634e4c?w=600&q=80',
        'description': 'Triple-stitched lightweight double hammock including heavy carabiners and tree straps.'
    },
    {
        'name': 'Aluminum Anti-Slip Road Bicycle Pedals', 'brand': 'Velo', 'category': 'Fitness', 'price': 34.00, 'countInStock': 40,
        'image': 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80',
        'description': 'Wide sturdy structural tread frames equipped with anchor grips for speed cycling.'
    },
    {
        'name': 'Carbon Fiber Impact Hiking Trekking Poles', 'brand': 'Stratus', 'category': 'Fitness', 'price': 72.00, 'countInStock': 12,
        'image': 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80',
        'description': 'Shock-absorbing collapsible support sticks with custom soft moisture-wicking cork handles.'
    },
    {
        'name': 'Waterproof LED Bright Outdoor Headlamp', 'brand': 'VoltCharge', 'category': 'Fitness', 'price': 22.50, 'countInStock': 50,
        'image': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&q=80',
        'description': 'Multi-mode rechargeable forehead tactical light for night running and exploration.'
    },

    # --- OFFICE (10 Items: Desk Organizers, Pens, Journals, Lamps) ---
    {
        'name': 'Mesh Desktop Document Trays Organizer', 'brand': 'OfficeMate', 'category': 'Office', 'price': 24.99, 'countInStock': 30,
        'image': 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80',
        'description': 'Multi-tier steel document desk sorting racks organizing folders and stationery mail.'
    },
    {
        'name': 'Parker IM Matt Black Fountain Pen', 'brand': 'Parker', 'category': 'Office', 'price': 38.00, 'countInStock': 45,
        'image': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&q=80',
        'description': 'Professional fine steel writing nib pen executing consistent smooth daily lines.'
    },
    {
        'name': 'Moleskine Classic Hardcover Notebook', 'brand': 'Moleskine', 'category': 'Office', 'price': 22.50, 'countInStock': 60,
        'image': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80',
        'description': 'Premium thread-bound ruled notebook journal with expandable file folders built into the back.'
    },
    {
        'name': 'Adjustable Architect Swing Arm Desk Lamp', 'brand': 'Lumina', 'category': 'Office', 'price': 45.00, 'countInStock': 18,
        'image': 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5db?w=600&q=80',
        'description': 'Classic metal joints clamp-on desk task light reducing workspace reading fatigue.'
    },
    {
        'name': 'Dual-Sided Waterproof Leather Desk Pad', 'brand': 'Vanguard', 'category': 'Office', 'price': 29.00, 'countInStock': 35,
        'image': 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=600&q=80',
        'description': 'Large protective smooth writing mousepad layer minimizing mechanical mouse tracking lag.'
    },
    {
        'name': 'Solid Walnut Wood MagSafe Phone Dock', 'brand': 'Ember', 'category': 'Office', 'price': 42.00, 'countInStock': 20,
        'image': 'https://images.unsplash.com/photo-1616531770192-6eaea74c8456?w=600&q=80',
        'description': 'Beautifully carved natural hardwood stand supporting magnetic tracking view rings.'
    },
    {
        'name': 'Texas Instruments TI-84 Plus Calculator', 'brand': 'TI', 'category': 'Office', 'price': 118.00, 'countInStock': 15,
        'image': 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80',
        'description': 'Industry standard advanced graphing math calculator loaded with engineering programming apps.'
    },
    {
        'name': 'Heavy Duty Kraft Cardboard Filing Boxes', 'brand': 'Verdant', 'category': 'Office', 'price': 19.50, 'countInStock': 40,
        'image': 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&q=80',
        'description': 'Three-pack sturdy modular legal document containers with secure side handles.'
    },
    {
        'name': 'Felt Sound-Absorbing Desk Divider Shield', 'brand': 'Orbit', 'category': 'Office', 'price': 52.00, 'countInStock': 10,
        'image': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80',
        'description': 'Freestanding acoustical desk wrap panel reducing room background sound chatter distraction.'
    },
    {
        'name': 'Metallic Heavy Duty Desktop Stapler', 'brand': 'OfficeMate', 'category': 'Office', 'price': 14.00, 'countInStock': 80,
        'image': 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&q=80',
        'description': 'Anti-jam spring loading office stapler binding up to 30 sheets cleanly.'
    }
]

for item in premium_items:
    assigned_rating = round(random.uniform(4.1, 5.0), 1)
    assigned_reviews = random.randint(12, 98)
    
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

print(f"Successfully populated database with {len(premium_items)} pristine, ultra-familiar products!")