import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";
import { Part } from "../entities/Part";

async function seedComplete() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected");

        const categoryRepository = AppDataSource.getRepository(Category);
        const partRepository = AppDataSource.getRepository(Part);

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await partRepository.delete({});
        await categoryRepository.delete({});

        // Seed Categories with detailed data
        const categoriesData = [
            {
                name: "Engine Parts",
                slug: "engine-parts",
                description: "High-performance engine components and accessories",
                icon: "⚙️",
                isActive: true,
            },
            {
                name: "Suspension",
                slug: "suspension",
                description: "Suspension systems and components for better handling",
                icon: "🔧",
                isActive: true,
            },
            {
                name: "Exhaust Systems",
                slug: "exhaust-systems",
                description: "Performance exhaust systems and mufflers",
                icon: "💨",
                isActive: true,
            },
            {
                name: "Brakes",
                slug: "brakes",
                description: "Brake pads, rotors, and performance brake kits",
                icon: "🛑",
                isActive: true,
            },
            {
                name: "Wheels & Tires",
                slug: "wheels-tires",
                description: "Alloy wheels, rims, and performance tires",
                icon: "🛞",
                isActive: true,
            },
            {
                name: "Interior",
                slug: "interior",
                description: "Interior upgrades and accessories",
                icon: "🪑",
                isActive: true,
            },
            {
                name: "Exterior",
                slug: "exterior",
                description: "Body kits, spoilers, and exterior modifications",
                icon: "🚗",
                isActive: true,
            },
            {
                name: "Lighting",
                slug: "lighting",
                description: "LED lights, headlights, and lighting accessories",
                icon: "💡",
                isActive: true,
            },
        ];

        console.log("🌱 Seeding categories...");
        const categories: Category[] = [];
        for (const categoryData of categoriesData) {
            const category = categoryRepository.create(categoryData);
            const saved = await categoryRepository.save(category);
            categories.push(saved);
            console.log(`  ✓ Created category: ${category.name}`);
        }

        // Seed Parts for each category
        console.log("\n🔧 Seeding parts...");

        const partsData = [
            // Engine Parts
            {
                category: categories[0],
                name: "Turbocharger Kit",
                description: "High-performance turbocharger kit for increased power",
                price: "1299.99",
                stock_quantity: 15,
                image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=500&fit=crop",
            },
            {
                category: categories[0],
                name: "Cold Air Intake",
                description: "Performance cold air intake system",
                price: "349.99",
                stock_quantity: 25,
                image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop",
            },
            {
                category: categories[0],
                name: "Performance Spark Plugs",
                description: "Iridium performance spark plugs set",
                price: "89.99",
                stock_quantity: 50,
                image_url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=500&fit=crop",
            },
            {
                category: categories[0],
                name: "Engine Oil Filter",
                description: "High-flow performance oil filter",
                price: "24.99",
                stock_quantity: 100,
                image_url: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500&h=500&fit=crop",
            },

            // Suspension
            {
                category: categories[1],
                name: "Coilover Suspension Kit",
                description: "Adjustable coilover suspension system",
                price: "1899.99",
                stock_quantity: 10,
                image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=500&fit=crop",
            },
            {
                category: categories[1],
                name: "Sway Bar Kit",
                description: "Front and rear sway bar upgrade kit",
                price: "449.99",
                stock_quantity: 20,
                image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop",
            },
            {
                category: categories[1],
                name: "Strut Tower Brace",
                description: "Aluminum strut tower brace for chassis rigidity",
                price: "199.99",
                stock_quantity: 30,
                image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=500&fit=crop",
            },

            // Exhaust Systems
            {
                category: categories[2],
                name: "Cat-Back Exhaust System",
                description: "Stainless steel cat-back exhaust",
                price: "899.99",
                stock_quantity: 12,
                image_url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&h=500&fit=crop",
            },
            {
                category: categories[2],
                name: "Performance Muffler",
                description: "High-flow performance muffler",
                price: "299.99",
                stock_quantity: 25,
                image_url: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=500&fit=crop",
            },
            {
                category: categories[2],
                name: "Exhaust Tips",
                description: "Chrome dual exhaust tips",
                price: "79.99",
                stock_quantity: 40,
                image_url: "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=500&h=500&fit=crop",
            },

            // Brakes
            {
                category: categories[3],
                name: "Performance Brake Kit",
                description: "Complete big brake kit with calipers",
                price: "2499.99",
                stock_quantity: 8,
                image_url: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500&h=500&fit=crop",
            },
            {
                category: categories[3],
                name: "Ceramic Brake Pads",
                description: "High-performance ceramic brake pads",
                price: "149.99",
                stock_quantity: 35,
                image_url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&h=500&fit=crop",
            },
            {
                category: categories[3],
                name: "Slotted Brake Rotors",
                description: "Performance slotted brake rotors pair",
                price: "329.99",
                stock_quantity: 20,
                image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
            },

            // Wheels & Tires
            {
                category: categories[4],
                name: "Forged Alloy Wheels",
                description: "18-inch forged alloy wheels set of 4",
                price: "1999.99",
                stock_quantity: 12,
                image_url: "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=500&h=500&fit=crop",
            },
            {
                category: categories[4],
                name: "Performance Tires",
                description: "High-performance summer tires set of 4",
                price: "899.99",
                stock_quantity: 18,
                image_url: "https://images.unsplash.com/photo-1606016159991-47141290d0e1?w=500&h=500&fit=crop",
            },
            {
                category: categories[4],
                name: "Wheel Spacers",
                description: "Aluminum wheel spacers kit",
                price: "129.99",
                stock_quantity: 45,
                image_url: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=500&h=500&fit=crop",
            },

            // Interior
            {
                category: categories[5],
                name: "Racing Seats",
                description: "Bucket racing seats pair",
                price: "1299.99",
                stock_quantity: 10,
                image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop",
            },
            {
                category: categories[5],
                name: "Steering Wheel",
                description: "Leather-wrapped performance steering wheel",
                price: "399.99",
                stock_quantity: 15,
                image_url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&h=500&fit=crop",
            },
            {
                category: categories[5],
                name: "Floor Mats",
                description: "Premium all-weather floor mats",
                price: "89.99",
                stock_quantity: 50,
                image_url: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=500&fit=crop",
            },

            // Exterior
            {
                category: categories[6],
                name: "Carbon Fiber Hood",
                description: "Lightweight carbon fiber hood",
                price: "1799.99",
                stock_quantity: 5,
                image_url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=500&fit=crop",
            },
            {
                category: categories[6],
                name: "Rear Spoiler",
                description: "Adjustable rear spoiler wing",
                price: "599.99",
                stock_quantity: 12,
                image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop",
            },
            {
                category: categories[6],
                name: "Side Skirts",
                description: "Aerodynamic side skirts pair",
                price: "449.99",
                stock_quantity: 15,
                image_url: "https://images.unsplash.com/photo-1542362567-b07e54a88620?w=500&h=500&fit=crop",
            },

            // Lighting
            {
                category: categories[7],
                name: "LED Headlight Kit",
                description: "6000K LED headlight conversion kit",
                price: "249.99",
                stock_quantity: 30,
                image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop",
            },
            {
                category: categories[7],
                name: "Underglow LED Kit",
                description: "RGB underglow LED strip kit",
                price: "149.99",
                stock_quantity: 25,
                image_url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=500&fit=crop",
            },
            {
                category: categories[7],
                name: "Tail Light Assembly",
                description: "LED tail light assembly pair",
                price: "399.99",
                stock_quantity: 20,
                image_url: "https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=500&h=500&fit=crop",
            },
        ];

        let partCount = 0;
        for (const partData of partsData) {
            const part = partRepository.create({
                name: partData.name,
                description: partData.description,
                price: parseFloat(partData.price),
                stock_quantity: partData.stock_quantity,
                image_url: partData.image_url,
                categoryId: partData.category.id,
                sellerId: 1, // Default seller ID - adjust as needed
            });
            await partRepository.save(part);
            partCount++;
            console.log(`  ✓ Created part: ${part.name} (${partData.category.name})`);
        }

        // Update category part counts
        console.log("\n📊 Updating category counts...");
        for (const category of categories) {
            const count = await partRepository.count({
                where: { categoryId: category.id },
            });
            category.partCount = count;
            await categoryRepository.save(category);
            console.log(`  ✓ ${category.name}: ${count} parts`);
        }

        console.log(`\n✅ Database seeding completed!`);
        console.log(`   📦 ${categories.length} categories created`);
        console.log(`   🔧 ${partCount} parts created`);
        console.log(`   🖼️  All parts have image URLs`);

        await AppDataSource.destroy();
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
}

// Run seeder
seedComplete();
