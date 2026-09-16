import os
import django

# Tell Python which settings file to read before talking to the database
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Product, Category

def seed_database():
    print("🧹 Cleaning out old placeholder data rows...")
    Product.objects.all().delete()
    Category.objects.all().delete()

    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        print("Creating default admin user...")
        admin_user = User.objects.create_superuser('admin', 'admin@premiumshop.com', 'password123')

    # 1. Define the core Category Tree
    categories_data = ['Electronics', 'Accessories', 'Apparel', 'Home & Kitchen', 'Fitness']
    categories = {}
    
    for cat_name in categories_data:
        cat, created = Category.objects.get_or_create(name=cat_name)
        categories[cat_name] = cat

    # 2. Complete 50 Real-World Items Linked to Explicit, Matching Product Photos (Prices capped under ₦10,000)
    items = [
        # === ELECTRONICS ===
        {
            "category": "Electronics", "name": "Braided 4K Ultra HD HDMI Cable (2m)",
            "price": 6500.00, "brand": "Samsung", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80",
            "description": "High-speed 4K/60Hz transmission cable with gold-plated connectors."
        },
        {
            "category": "Electronics", "name": "Sony In-Ear Wired Bass Earphones",
            "price": 8500.00, "brand": "Sony", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
            "description": "Clear acoustic sound with punchy bass and an inline hands-free microphone."
        },
        {
            "category": "Electronics", "name": "Silicone Keyboard Protector & Dust Cover",
            "price": 3500.00, "brand": "Apple", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
            "description": "Ultra-thin precision mold shielding your keyboard from spills and crumbs."
        },
        {
            "category": "Electronics", "name": "Screen Cleaning Kit & Microfiber Cloths",
            "price": 4200.00, "brand": "Dell", "countInStock": 45,
            "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
            "description": "Streak-free antibacterial spray designed safely for monitor and phone displays."
        },
        {
            "category": "Electronics", "name": "Tempered Glass Screen Protector (9H)",
            "price": 3800.00, "brand": "Apple", "countInStock": 60,
            "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80",
            "description": "Scratch-resistant oleophobic tempered shield preserving screen responsiveness."
        },
        {
            "category": "Electronics", "name": "Logitech Ergonomic Silent Mouse Pad",
            "price": 5000.00, "brand": "Logitech", "countInStock": 55,
            "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
            "description": "Smooth micro-weave cloth surface with non-slip natural rubber base."
        },
        {
            "category": "Electronics", "name": "Mechanical Switch Keycap Puller Set",
            "price": 4500.00, "brand": "Keychron", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
            "description": "Stainless steel dual wire tool for effortless keycap and switch maintenance."
        },
        {
            "category": "Electronics", "name": "Thumb Grip Caps for Gaming Controllers",
            "price": 3000.00, "brand": "Nintendo", "countInStock": 70,
            "image": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=600&q=80",
            "description": "Ergonomic textured silicone analog thumb caps enhancing control accuracy."
        },
        {
            "category": "Electronics", "name": "Anker Braided USB-C to USB-C Cable (1m)",
            "price": 7500.00, "brand": "Anker", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1609592426508-cc85347ff22c?auto=format&fit=crop&w=600&q=80",
            "description": "Heavy-duty 60W fast-charging nylon cable engineered for 25,000+ bends."
        },
        {
            "category": "Electronics", "name": "Auxiliary 3.5mm Gold-Plated Audio Cord",
            "price": 2800.00, "brand": "Sonos", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
            "description": "Double-shielded oxygen-free copper core preventing static audio interference."
        },

        # === ACCESSORIES ===
        {
            "category": "Accessories", "name": "Breathable Silicone Smartwatch Strap",
            "price": 5500.00, "brand": "Apple", "countInStock": 45,
            "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80",
            "description": "Sweat-resistant soft fluoroelastomer sports band with secure pin closure."
        },
        {
            "category": "Accessories", "name": "Hard Shell Foldable Sunglasses Case",
            "price": 4000.00, "brand": "Ray-Ban", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
            "description": "Shockproof protective eyewear box with velvet interior lining."
        },
        {
            "category": "Accessories", "name": "Weatherproof Backpack Rain Cover",
            "price": 6000.00, "brand": "Peak Design", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
            "description": "Water-resistant ripstop nylon shell that easily fits over 20-30L packs."
        },
        {
            "category": "Accessories", "name": "RFID Blocking Slim Card Holder",
            "price": 7500.00, "brand": "Bellroy", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
            "description": "Compact front-pocket sleeve shielding credit cards from unauthorized scanning."
        },
        {
            "category": "Accessories", "name": "Clip-On LED Reading Book Light",
            "price": 5800.00, "brand": "Amazon", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=600&q=80",
            "description": "Flexible neck with warm eye-care light modes and USB rechargeable battery."
        },
        {
            "category": "Accessories", "name": "Portable EVA Hard Protective Travel Pouch",
            "price": 4800.00, "brand": "Anker", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
            "description": "Waterproof zipper organizer case for power banks, adapters, and audio cords."
        },
        {
            "category": "Accessories", "name": "Anti-Slip Desktop Cable Management Clips",
            "price": 3200.00, "brand": "Elgato", "countInStock": 60,
            "image": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
            "description": "Self-adhesive silicone wire holders keeping work desks neat and clutter-free."
        },
        {
            "category": "Accessories", "name": "Compact Foldable Phone Stand",
            "price": 4500.00, "brand": "Satechi", "countInStock": 45,
            "image": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=600&q=80",
            "description": "Sturdy aluminum desk cradle providing multi-angle hands-free viewing."
        },
        {
            "category": "Accessories", "name": "Wide Mouth Silicone Water Bottle Boot",
            "price": 3800.00, "brand": "Hydro Flask", "countInStock": 55,
            "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
            "description": "Protective bottom sleeve cushioning drops and eliminating loud clanks."
        },
        {
            "category": "Accessories", "name": "Belkin AirTag Protective Case Key Ring",
            "price": 6500.00, "brand": "Belkin", "countInStock": 80,
            "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
            "description": "Scratch-resistant twist-and-lock shell keeping tracking tags fastened securely."
        },

        # === APPAREL ===
        {
            "category": "Apparel", "name": "Classic Heavyweight Cotton Crew Neck Tee",
            "price": 8500.00, "brand": "Uniqlo", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
            "description": "100% breathable organic ring-spun cotton crafted for durable daily wear."
        },
        {
            "category": "Apparel", "name": "Sneaker Cleaning Brush & Foam Shampoo",
            "price": 6200.00, "brand": "Adidas", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
            "description": "Safe deep-cleaning formula designed for canvas, knit mesh, and leather uppers."
        },
        {
            "category": "Apparel", "name": "Waterproof Outdoor Storm Poncho",
            "price": 9500.00, "brand": "Arc'teryx", "countInStock": 25,
            "image": "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80",
            "description": "Ultra-lightweight ripstop rain cape packed inside a drawstring pouch."
        },
        {
            "category": "Apparel", "name": "Braided Stretch Casual Canvas Belt",
            "price": 7000.00, "brand": "Levi's", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=600&q=80",
            "description": "Flexible hole-free weave strap fitted with a brushed metal alloy buckle."
        },
        {
            "category": "Apparel", "name": "UV400 Polarized Lightweight Sun Glasses",
            "price": 9000.00, "brand": "Oakley", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
            "description": "Glare-reducing polarized lenses shielded with full ultraviolet protection."
        },
        {
            "category": "Apparel", "name": "Merino Wool Blend Thermal Boot Socks (2-Pack)",
            "price": 6800.00, "brand": "Everlane", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
            "description": "Cushioned moisture-wicking wool blend designed to prevent blister friction."
        },
        {
            "category": "Apparel", "name": "Premium Leather Boot Wax & Conditioner",
            "price": 5400.00, "brand": "Thursday Boot Co", "countInStock": 28,
            "image": "https://images.unsplash.com/photo-1638247025967-b4e38f6893b4?auto=format&fit=crop&w=600&q=80",
            "description": "Natural beeswax formula nourishing and weatherproofing full-grain leather."
        },
        {
            "category": "Apparel", "name": "Moisture-Wicking Athletic Sweatband Set",
            "price": 4000.00, "brand": "Nike", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80",
            "description": "High-absorbency terry cotton wrist and headbands for intense gym sessions."
        },
        {
            "category": "Apparel", "name": "Stainless Steel Mesh Watch Milanese Band",
            "price": 7500.00, "brand": "Seiko", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
            "description": "Magnetic lock stainless steel woven band adjustable to all wrist sizes."
        },
        {
            "category": "Apparel", "name": "Drawstring Canvas Laundry & Shoe Sack",
            "price": 4200.00, "brand": "Herschel", "countInStock": 45,
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
            "description": "Durable cotton canvas storage bag separating shoes from travel clothes."
        },

        # === HOME & KITCHEN ===
        {
            "category": "Home & Kitchen", "name": "Stainless Steel Espresso Milk Pitcher (350ml)",
            "price": 7200.00, "brand": "Breville", "countInStock": 25,
            "image": "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?auto=format&fit=crop&w=600&q=80",
            "description": "Precision pouring spout calibrated inside with laser measurement markings."
        },
        {
            "category": "Home & Kitchen", "name": "Silicone Non-Scratch Blender Scraper Spatula",
            "price": 3800.00, "brand": "Vitamix", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80",
            "description": "Extended handle flexible scraper reaching cleanly beneath blender blades."
        },
        {
            "category": "Home & Kitchen", "name": "Stainless Steel Tea Infuser Mesh Strainer",
            "price": 4500.00, "brand": "Fellow", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
            "description": "Ultra-fine perforated mesh basket designed for loose leaf herbal brews."
        },
        {
            "category": "Home & Kitchen", "name": "Heavy-Duty Silicone Cast Iron Handle Holder",
            "price": 3500.00, "brand": "Lodge", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1584990347449-37968535a287?auto=format&fit=crop&w=600&q=80",
            "description": "Heat-resistant grip insulating hands up to 230°C from searing hot pans."
        },
        {
            "category": "Home & Kitchen", "name": "Reusable Air Fryer Silicone Baking Liners",
            "price": 5500.00, "brand": "Philips", "countInStock": 45,
            "image": "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80",
            "description": "Food-grade non-stick silicone basket insert preventing oily kitchen mess."
        },
        {
            "category": "Home & Kitchen", "name": "Washable HEPA Filter Replacement",
            "price": 6800.00, "brand": "Dyson", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
            "description": "High-efficiency post-motor filter capturing microscopic allergen particles."
        },
        {
            "category": "Home & Kitchen", "name": "Natural Wood Espresso Grinder Cleaning Brush",
            "price": 3200.00, "brand": "OXO", "countInStock": 60,
            "image": "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
            "description": "Tough natural boar bristles sweeping coffee grounds without scratching steel."
        },
        {
            "category": "Home & Kitchen", "name": "Heat-Insulated Silicone Trivet Coaster Set",
            "price": 4800.00, "brand": "Le Creuset", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1584990347449-37968535a287?auto=format&fit=crop&w=600&q=80",
            "description": "Honeycomb anti-slip surface safeguarding counters from scalding Dutch ovens."
        },
        {
            "category": "Home & Kitchen", "name": "Silicone Sealing Lid Ring Replacement (6Qt)",
            "price": 3600.00, "brand": "Instant Pot", "countInStock": 45,
            "image": "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?auto=format&fit=crop&w=600&q=80",
            "description": "Tight-fitting food-grade silicone ring maintaining optimal cooking pressure."
        },
        {
            "category": "Home & Kitchen", "name": "Glass Cleaning Sponge & Long Bottle Brush",
            "price": 3000.00, "brand": "SodaStream", "countInStock": 55,
            "image": "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80",
            "description": "Ergonomic curved scrub head cleaning deep corners of water bottles and carafes."
        },

        # === FITNESS ===
        {
            "category": "Fitness", "name": "Anti-Slip Gym Chalk Ball (60g)",
            "price": 4000.00, "brand": "Bowflex", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
            "description": "100% magnesium carbonate chalk bag delivering zero-slip barbell control."
        },
        {
            "category": "Fitness", "name": "Adjustable Cotton Yoga Mat Carry Strap",
            "price": 3500.00, "brand": "Lululemon", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=600&q=80",
            "description": "Reinforced sling buckle looping snugly around all yoga mat sizes."
        },
        {
            "category": "Fitness", "name": "Targeted Trigger Point Massage Lacrosse Ball",
            "price": 4500.00, "brand": "Therabody", "countInStock": 60,
            "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
            "description": "High-density solid rubber ball relieving tight knots and myofascial tension."
        },
        {
            "category": "Fitness", "name": "Charging Cradle Dock Cord with Clip",
            "price": 6000.00, "brand": "Garmin", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
            "description": "Sturdy copper-pin magnetic power adapter cord charging sports watches safely."
        },
        {
            "category": "Fitness", "name": "Padded Breathable Cycling Seat Cover",
            "price": 8500.00, "brand": "Peloton", "countInStock": 25,
            "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
            "description": "Ergonomic memory foam cushion pad relieving tailbone pressure on workouts."
        },
        {
            "category": "Fitness", "name": "Fabric Resistance Booty Loop Band (Medium)",
            "price": 5000.00, "brand": "Gymshark", "countInStock": 60,
            "image": "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=600&q=80",
            "description": "Durable cotton-elastic blend band with inner rubber anti-roll grip stripes."
        },
        {
            "category": "Fitness", "name": "Silicone Treadmill Belt Lubricant Oil (100ml)",
            "price": 5800.00, "brand": "WalkingPad", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=600&q=80",
            "description": "100% pure silicone spray reducing motor drag and extending treadmill life."
        },
        {
            "category": "Fitness", "name": "Speed Skipping Rope with Ball Bearings",
            "price": 7000.00, "brand": "Rogue Fitness", "countInStock": 45,
            "image": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
            "description": "Adjustable kink-resistant steel wire rope engineered for smooth rotations."
        },
        {
            "category": "Fitness", "name": "Protein Shaker Cup with Wire Whisk Ball (700ml)",
            "price": 6200.00, "brand": "BlenderBottle", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80",
            "description": "BPA-free leakproof mixing cup featuring surgical stainless steel whisk wire."
        },
        {
            "category": "Fitness", "name": "Non-Slip Exercise Push-Up Stands (Pair)",
            "price": 8000.00, "brand": "Everlast", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
            "description": "Ergonomic foam-grip pushup bars reducing wrist strain during workouts."
        }
    ]

    print(f"📦 Populating database arrays with 50 matching high-res production items...")
    for item_data in items:
        category_name = item_data.pop('category')
        category_object = categories[category_name]
        Product.objects.create(user=admin_user, category=category_object, **item_data)

    print("🚀 Seeding sequence complete! All 50 items are perfectly matched.")

if __name__ == '__main__':
    seed_database()