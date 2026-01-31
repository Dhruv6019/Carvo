import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'carvo',
    });

    try {
        console.log("✅ Database connected");

        // Disable foreign key checks
        await connection.query(`SET FOREIGN_KEY_CHECKS = 0`);

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await connection.query(`TRUNCATE TABLE part`);
        await connection.query(`TRUNCATE TABLE category`);

        // Re-enable foreign key checks
        await connection.query(`SET FOREIGN_KEY_CHECKS = 1`);

        // Insert categories
        console.log("\n🌱 Seeding categories...");
        const categories = [
            { name: "Engine Parts", slug: "engine-parts", description: "High-performance engine components and accessories", icon: "⚙️" },
            { name: "Suspension", slug: "suspension", description: "Suspension systems and components for better handling", icon: "🔧" },
            { name: "Exhaust Systems", slug: "exhaust-systems", description: "Performance exhaust systems and mufflers", icon: "💨" },
            { name: "Brakes", slug: "brakes", description: "Brake pads, rotors, and performance brake kits", icon: "🛑" },
            { name: "Wheels & Tires", slug: "wheels-tires", description: "Alloy wheels, rims, and performance tires", icon: "🛞" },
            { name: "Interior", slug: "interior", description: "Interior upgrades and accessories", icon: "🪑" },
            { name: "Exterior", slug: "exterior", description: "Body kits, spoilers, and exterior modifications", icon: "🚗" },
            { name: "Lighting", slug: "lighting", description: "LED lights, headlights, and lighting accessories", icon: "💡" },
        ];

        for (const cat of categories) {
            await connection.query(
                `INSERT INTO category (name, slug, description, icon, partCount, isActive, created_at, updated_at) 
                 VALUES (?, ?, ?, ?, 0, 1, NOW(), NOW())`,
                [cat.name, cat.slug, cat.description, cat.icon]
            );
            console.log(`  ✓ Created category: ${cat.name}`);
        }

        // Insert parts
        console.log("\n🔧 Seeding parts...");
        const parts = [
            // Engine Parts (categoryId: 1)
            { name: "Turbocharger Kit", desc: "High-performance turbocharger kit for increased power", price: 1299.99, stock: 15, img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=500&fit=crop", catId: 1 },
            { name: "Cold Air Intake", desc: "Performance cold air intake system", price: 349.99, stock: 25, img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", catId: 1 },
            { name: "Performance Spark Plugs", desc: "Iridium performance spark plugs set", price: 89.99, stock: 50, img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=500&fit=crop", catId: 1 },
            { name: "Engine Oil Filter", desc: "High-flow performance oil filter", price: 24.99, stock: 100, img: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500&h=500&fit=crop", catId: 1 },

            // Suspension (categoryId: 2)
            { name: "Coilover Suspension Kit", desc: "Adjustable coilover suspension system", price: 1899.99, stock: 10, img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=500&fit=crop", catId: 2 },
            { name: "Sway Bar Kit", desc: "Front and rear sway bar upgrade kit", price: 449.99, stock: 20, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop", catId: 2 },
            { name: "Strut Tower Brace", desc: "Aluminum strut tower brace for chassis rigidity", price: 199.99, stock: 30, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=500&fit=crop", catId: 2 },

            // Exhaust Systems (categoryId: 3)
            { name: "Cat-Back Exhaust System", desc: "Stainless steel cat-back exhaust", price: 899.99, stock: 12, img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&h=500&fit=crop", catId: 3 },
            { name: "Performance Muffler", desc: "High-flow performance muffler", price: 299.99, stock: 25, img: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=500&fit=crop", catId: 3 },
            { name: "Exhaust Tips", desc: "Chrome dual exhaust tips", price: 79.99, stock: 40, img: "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=500&h=500&fit=crop", catId: 3 },

            // Brakes (categoryId: 4)
            { name: "Performance Brake Kit", desc: "Complete big brake kit with calipers", price: 2499.99, stock: 8, img: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500&h=500&fit=crop", catId: 4 },
            { name: "Ceramic Brake Pads", desc: "High-performance ceramic brake pads", price: 149.99, stock: 35, img: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&h=500&fit=crop", catId: 4 },
            { name: "Slotted Brake Rotors", desc: "Performance slotted brake rotors pair", price: 329.99, stock: 20, img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop", catId: 4 },

            // Wheels & Tires (categoryId: 5)
            { name: "Forged Alloy Wheels", desc: "18-inch forged alloy wheels set of 4", price: 1999.99, stock: 12, img: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=500&h=500&fit=crop", catId: 5 },
            { name: "Performance Tires", desc: "High-performance summer tires set of 4", price: 899.99, stock: 18, img: "https://images.unsplash.com/photo-1606016159991-47141290d0e1?w=500&h=500&fit=crop", catId: 5 },
            { name: "Wheel Spacers", desc: "Aluminum wheel spacers kit", price: 129.99, stock: 45, img: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=500&h=500&fit=crop", catId: 5 },

            // Interior (categoryId: 6)
            { name: "Racing Seats", desc: "Bucket racing seats pair", price: 1299.99, stock: 10, img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop", catId: 6 },
            { name: "Steering Wheel", desc: "Leather-wrapped performance steering wheel", price: 399.99, stock: 15, img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&h=500&fit=crop", catId: 6 },
            { name: "Floor Mats", desc: "Premium all-weather floor mats", price: 89.99, stock: 50, img: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=500&fit=crop", catId: 6 },

            // Exterior (categoryId: 7)
            { name: "Carbon Fiber Hood", desc: "Lightweight carbon fiber hood", price: 1799.99, stock: 5, img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=500&fit=crop", catId: 7 },
            { name: "Rear Spoiler", desc: "Adjustable rear spoiler wing", price: 599.99, stock: 12, img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop", catId: 7 },
            { name: "Side Skirts", desc: "Aerodynamic side skirts pair", price: 449.99, stock: 15, img: "https://images.unsplash.com/photo-1542362567-b07e54a88620?w=500&h=500&fit=crop", catId: 7 },

            // Lighting (categoryId: 8)
            { name: "LED Headlight Kit", desc: "6000K LED headlight conversion kit", price: 249.99, stock: 30, img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop", catId: 8 },
            { name: "Underglow LED Kit", desc: "RGB underglow LED strip kit", price: 149.99, stock: 25, img: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=500&fit=crop", catId: 8 },
            { name: "Tail Light Assembly", desc: "LED tail light assembly pair", price: 399.99, stock: 20, img: "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=500&h=500&fit=crop", catId: 8 },
        ];

        for (const part of parts) {
            await connection.query(
                `INSERT INTO part (name, description, price, stock_quantity, image_url, categoryId, sellerId) 
                 VALUES (?, ?, ?, ?, ?, ?, 1)`,
                [part.name, part.desc, part.price, part.stock, part.img, part.catId]
            );
            console.log(`  ✓ Created part: ${part.name}`);
        }

        // Update category part counts
        console.log("\n📊 Updating category counts...");
        await connection.query(`
            UPDATE category c 
            SET partCount = (SELECT COUNT(*) FROM part p WHERE p.categoryId = c.id)
        `);

        console.log(`\n✅ Database seeding completed!`);
        console.log(`   📦 ${categories.length} categories created`);
        console.log(`   🔧 ${parts.length} parts created`);
        console.log(`   🖼️  All parts have image URLs from Unsplash`);

        await connection.end();
    } catch (error) {
        console.error("❌ Seeding error:", error);
        await connection.end();
        process.exit(1);
    }
}

seedDatabase();
