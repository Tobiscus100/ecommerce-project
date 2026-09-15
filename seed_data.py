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

    # 2. Complete 50 Real-World Items Linked to Explicit, Matching Product Photos (Prices updated to Naira)
    items = [
        # === ELECTRONICS ===
        {
            "category": "Electronics", "name": "Samsung 65-inch 4K Smart QLED TV",
            "price": 1350000.00, "brand": "Samsung", "countInStock": 12,
            "image": "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80",
            "description": "Experience breathtaking color clarity with an intelligent 4K processor."
        },
        {
            "category": "Electronics", "name": "Sony WH-1000XM5 Wireless Headphones",
            "price": 520000.00, "brand": "Sony", "countInStock": 25,
            "image": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
            "description": "Industry-leading noise cancellation paired with pristine acoustic sound."
        },
        {
            "category": "Electronics", "name": "Apple MacBook Air M3 13-inch",
            "price": 1650000.00, "brand": "Apple", "countInStock": 8,
            "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
            "description": "Strikingly thin architecture running the blindingly fast M3 system loop."
        },
        {
            "category": "Electronics", "name": "Dell UltraSharp 27-inch 4K Monitor",
            "price": 645000.00, "brand": "Dell", "countInStock": 14,
            "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80",
            "description": "Impeccable color coverage specs matching critical creative workstation requirements."
        },
        {
            "category": "Electronics", "name": "iPad Air 11-inch M2 Chip",
            "price": 900000.00, "brand": "Apple", "countInStock": 19,
            "image": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80",
            "description": "Lightweight, versatile, and insanely powerful for mobile design pipelines."
        },
        {
            "category": "Electronics", "name": "Logitech G Pro X Superlight Mouse",
            "price": 210000.00, "brand": "Logitech", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
            "description": "Engineered meticulously alongside leading esports athletes."
        },
        {
            "category": "Electronics", "name": "Keychron Q1 Mechanical Keyboard",
            "price": 285000.00, "brand": "Keychron", "countInStock": 11,
            "image": "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&q=80",
            "description": "Full CNC machined aluminum body assembly housing hot-swappable tactile switches."
        },
        {
            "category": "Electronics", "name": "Nintendo Switch OLED Model",
            "price": 525000.00, "brand": "Nintendo", "countInStock": 15,
            "image": "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80",
            "description": "Vibrant screen displaying ultra-sharp color rendering performance profiles."
        },
        {
            "category": "Electronics", "name": "Anker Prime 20,000mAh Power Bank",
            "price": 195000.00, "brand": "Anker", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1706059740201-9b09bf95df87?w=500&q=80",
            "description": "Blazing fast charging capacity architecture safely managing power."
        },
        {
            "category": "Electronics", "name": "Sonos Era 100 Smart Speaker",
            "price": 375000.00, "brand": "Sonos", "countInStock": 16,
            "image": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80",
            "description": "Acoustic remastering framework optimizing room-filling stereo sound performance."
        },

        # === ACCESSORIES ===
        {
            "category": "Accessories", "name": "Apple Watch Series 9 GPS",
            "price": 600000.00, "brand": "Apple", "countInStock": 22,
            "image": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&q=80",
            "description": "Advanced health sensing data engines managing internal biometric tracking metrics."
        },
        {
            "category": "Accessories", "name": "Ray-Ban Classic Wayfarer",
            "price": 245000.00, "brand": "Ray-Ban", "countInStock": 25,
            "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80",
            "description": "Timeless structural silhouette styling configurations matched to high-performance lenses."
        },
        {
            "category": "Accessories", "name": "Peak Design Everyday Backpack 20L",
            "price": 420000.00, "brand": "Peak Design", "countInStock": 10,
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
            "description": "Award-winning flexible compartment organization system safeguarding gear layouts."
        },
        {
            "category": "Accessories", "name": "Leather Minimalist Wallet",
            "price": 68000.00, "brand": "Bellroy", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
            "description": "Premium top-grain leather tailored into an ultra-slim operational footprint."
        },
        {
            "category": "Accessories", "name": "Kindle Paperwhite 16GB",
            "price": 225000.00, "brand": "Amazon", "countInStock": 18,
            "image": "https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=500&q=80",
            "description": "Glare-free display surface explicitly mimicking traditional physical book structures."
        },
        {
            "category": "Accessories", "name": "Anker Soundcore Motion+ Speaker",
            "price": 150000.00, "brand": "Anker", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80",
            "description": "Hi-Res Audio certification containing specialized custom dual high-frequency tweeters."
        },
        {
            "category": "Accessories", "name": "Elgato Stream Deck MK.2",
            "price": 225000.00, "brand": "Elgato", "countInStock": 12,
            "image": "https://images.unsplash.com/photo-1625805503463-55734a74a173?w=500&q=80",
            "description": "Customizable LCD keys to control applications, switch scenes, and trigger macros."
        },
        {
            "category": "Accessories", "name": "Satechi Trio Wireless Charging Pad",
            "price": 180000.00, "brand": "Satechi", "countInStock": 20,
            "image": "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500&q=80",
            "description": "Simultaneous fast power routing management layout targeting smartphone form factors."
        },
        {
            "category": "Accessories", "name": "Hydro Flask 32oz Wide Mouth",
            "price": 68000.00, "brand": "Hydro Flask", "countInStock": 60,
            "image": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
            "description": "Double-wall vacuum insulation design safeguarding internal thermal properties."
        },
        {
            "category": "Accessories", "name": "Belkin AirTag Leather Key Ring",
            "price": 30000.00, "brand": "Belkin", "countInStock": 100,
            "image": "https://images.unsplash.com/photo-1581415260586-5d5d90042a57?w=500&q=80",
            "description": "Durable snap closure housing built to safeguard secure item tracking attachments."
        },

        # === APPAREL ===
        {
            "category": "Apparel", "name": "Premium Cotton Essentials Hoodie",
            "price": 112000.00, "brand": "Uniqlo", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
            "description": "Ultra-soft heavy cotton tailored for everyday functional luxury styling templates."
        },
        {
            "category": "Apparel", "name": "Classic White Minimalist Sneakers",
            "price": 180000.00, "brand": "Adidas", "countInStock": 15,
            "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80",
            "description": "Custom inner-sole assemblies matched to structured water-resistant uppers."
        },
        {
            "category": "Apparel", "name": "Waterproof Technical Shell Jacket",
            "price": 375000.00, "brand": "Arc'teryx", "countInStock": 9,
            "image": "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80",
            "description": "Advanced membrane shielding against intense seasonal microclimatic extremes."
        },
        {
            "category": "Apparel", "name": "Raw Denim Slim Fit Jeans",
            "price": 147000.00, "brand": "Levi's", "countInStock": 22,
            "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80",
            "description": "Japanese selvedge denim construction forming uniquely to personal gait patterns."
        },
        {
            "category": "Apparel", "name": "Polarized Active Sport Sunglasses",
            "price": 210000.00, "brand": "Oakley", "countInStock": 14,
            "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
            "description": "High-wrap framework shielding sight lines during outdoor training loops."
        },
        {
            "category": "Apparel", "name": "Merino Wool Knit Sweater",
            "price": 165000.00, "brand": "Everlane", "countInStock": 16,
            "image": "https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=500&q=80",
            "description": "Sustainably sourced wool fiber matrix optimizing natural thermal properties."
        },
        {
            "category": "Apparel", "name": "Classic Leather Chelsea Boots",
            "price": 270000.00, "brand": "Thursday Boot Co", "countInStock": 11,
            "image": "https://images.unsplash.com/photo-1638247025967-b4e38f6893b4?w=500&q=80",
            "description": "Goodyear welt construction layout ensuring complete structural water-barrier performance."
        },
        {
            "category": "Apparel", "name": "Breathable Core Training Shorts",
            "price": 72000.00, "brand": "Nike", "countInStock": 35,
            "image": "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80",
            "description": "Moisture-wicking mesh ventilation patterns engineered to dump body heat dynamically."
        },
        {
            "category": "Apparel", "name": "Chrono Stainless Steel Watch",
            "price": 322500.00, "brand": "Seiko", "countInStock": 13,
            "image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80",
            "description": "Japanese quartz multi-dial sub-register movement housed inside surgical steel."
        },
        {
            "category": "Apparel", "name": "Ergonomic Canvas Travel Duffel",
            "price": 127500.00, "brand": "Herschel", "countInStock": 20,
            "image": "https://images.unsplash.com/photo-1572569511254-18f66d444688?w=500&q=80",
            "description": "Heavyweight treated cotton weave layout matched to reinforced hardware assemblies."
        },

        # === HOME & KITCHEN ===
        {
            "category": "Home & Kitchen", "name": "Barista Express Espresso Machine",
            "price": 1050000.00, "brand": "Breville", "countInStock": 7,
            "image": "https://images.unsplash.com/photo-1517256064527-09c53b2d0c6b?w=500&q=80",
            "description": "Integrated dose-control conical burr grinder system providing rich espresso profiles."
        },
        {
            "category": "Home & Kitchen", "name": "Vitamix E310 Explorian Blender",
            "price": 525000.00, "brand": "Vitamix", "countInStock": 12,
            "image": "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=500&q=80",
            "description": "Aircraft-grade hardened stainless steel cutting edges fracturing difficult items."
        },
        {
            "category": "Home & Kitchen", "name": "Fellow Stagg EKG Electric Kettle",
            "price": 247500.00, "brand": "Fellow", "countInStock": 15,
            "image": "https://images.unsplash.com/photo-1542382156909-9ae3b2f5919a?w=500&q=80",
            "description": "Precision pour gooseneck spout layout mapped to automated manual control interfaces."
        },
        {
            "category": "Home & Kitchen", "name": "Chef's Classic Cast Iron Skillet",
            "price": 45000.00, "brand": "Lodge", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&q=80",
            "description": "Pre-seasoned cooking surface creating high-grade heat retention properties."
        },
        {
            "category": "Home & Kitchen", "name": "Philips Premium Airfryer XXL",
            "price": 375000.00, "brand": "Philips", "countInStock": 14,
            "image": "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?w=500&q=80",
            "description": "Vortex heat extraction technology draining unwanted excessive saturated oils."
        },
        {
            "category": "Home & Kitchen", "name": "Dyson V15 Detect Vacuum",
            "price": 1125000.00, "brand": "Dyson", "countInStock": 6,
            "image": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&q=80",
            "description": "Intelligent sensor array quantifying particle pollution density onto display screens."
        },
        {
            "category": "Home & Kitchen", "name": "Automatic Ceramic Burr Coffee Grinder",
            "price": 135000.00, "brand": "OXO", "countInStock": 22,
            "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80",
            "description": "Uniform extraction geometry output specs featuring distinct granular parameters."
        },
        {
            "category": "Home & Kitchen", "name": "Enamelled Dutch Oven 5.5Qt",
            "price": 435000.00, "brand": "Le Creuset", "countInStock": 8,
            "image": "https://images.unsplash.com/photo-1464454701691-ee1751fa631b?w=500&q=80",
            "description": "Impeccable chip-resistant structural enamel layer optimizing heat balancing loops."
        },
        {
            "category": "Home & Kitchen", "name": "Smart 10-in-1 Multi-Cooker",
            "price": 195000.00, "brand": "Instant Pot", "countInStock": 25,
            "image": "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=500&q=80",
            "description": "Advanced calibration circuitry parsing complex slow-cooking execution paths."
        },
        {
            "category": "Home & Kitchen", "name": "Premium SodaStream Aqua Fizz",
            "price": 240000.00, "brand": "SodaStream", "countInStock": 18,
            "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80",
            "description": "Elegant carbonation chamber structural assembly tailored to fit glass carafes."
        },

        # === FITNESS ===
        {
            "category": "Fitness", "name": "Bowflex SelectTech Adjustable Dumbbells",
            "price": 645000.00, "brand": "Bowflex", "countInStock": 10,
            "image": "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&q=80",
            "description": "Dynamic weight selector system replacing 15 individual dumbbell pairs."
        },
        {
            "category": "Fitness", "name": "Premium High-Density Yoga Mat",
            "price": 132000.00, "brand": "Lululemon", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&q=80",
            "description": "Ultra-grippy textured surface compound delivering deep joint cushioning feedback."
        },
        {
            "category": "Fitness", "name": "Theragun Pro Deep Tissue Massager",
            "price": 750000.00, "brand": "Therabody", "countInStock": 15,
            "image": "https://images.unsplash.com/photo-1640537754664-92765d752250?w=500&q=80",
            "description": "Professional-grade percussion therapy engine accelerating recovery workflows."
        },
        {
            "category": "Fitness", "name": "Garmin Fenix 7X Sapphire Solar",
            "price": 1350000.00, "brand": "Garmin", "countInStock": 8,
            "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
            "description": "Ultra-rugged tracking terminal processing complex offline topographic maps."
        },
        {
            "category": "Fitness", "name": "Peloton Digital Fitness Bike",
            "price": 2160000.00, "brand": "Peloton", "countInStock": 4,
            "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
            "description": "Immersive cardio workstation infrastructure packing smooth resistance control hubs."
        },
        {
            "category": "Fitness", "name": "Heavy Duty Fabric Resistance Bands",
            "price": 37500.00, "brand": "Gymshark", "countInStock": 50,
            "image": "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?w=500&q=80",
            "description": "Anti-slip internal grip weaving patterns preventing sudden elastic slips."
        },
        {
            "category": "Fitness", "name": "Under Desk Walking Pad Treadmill",
            "price": 450000.00, "brand": "WalkingPad", "countInStock": 12,
            "image": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=500&q=80",
            "description": "Ultra-quiet motor architecture collapsing flat to slip underneath desk setups."
        },
        {
            "category": "Fitness", "name": "Speed-Lock Professional Jump Rope",
            "price": 52500.00, "brand": "Rogue Fitness", "countInStock": 45,
            "image": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&q=80",
            "description": "Dual ball-bearing hardware assembly maximizing spin fluid metrics for drills."
        },
        {
            "category": "Fitness", "name": "Insulated Stainless Steel Shaker Bottle",
            "price": 49500.00, "brand": "BlenderBottle", "countInStock": 40,
            "image": "https://images.unsplash.com/photo-1593085512500-5d55148d6f0d?w=500&q=80",
            "description": "Double-wall vacuum barrier layer preserving optimal nutritional mixing temperatures."
        },
        {
            "category": "Fitness", "name": "Ergonomic Abdominal Roller Wheel",
            "price": 33000.00, "brand": "Everlast", "countInStock": 30,
            "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&q=80",
            "description": "Core stability fitness exercise wheel ab roller."
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