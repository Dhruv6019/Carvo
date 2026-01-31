import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entities/User";
import { Category } from "../entities/Category";
import { Part } from "../entities/Part";
import * as dotenv from "dotenv";

// Load env vars
dotenv.config();

const seedShopItems = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected for additional seeding");

        // 1. Get Seller
        const seller = await AppDataSource.getRepository(User).findOne({ where: { role: UserRole.SELLER } });

        if (!seller) {
            console.error("No seller found. Please run the main seed script first.");
            process.exit(1);
        }

        console.log(`Using seller: ${seller.email}`);

        // 2. Get or Create Categories
        const categoryRepo = AppDataSource.getRepository(Category);

        let performanceCat = await categoryRepo.findOne({ where: { name: "Performance" } });
        if (!performanceCat) {
            performanceCat = categoryRepo.create({ name: "Performance", description: "Engine and performance upgrades" });
            await categoryRepo.save(performanceCat);
        }

        let interiorCat = await categoryRepo.findOne({ where: { name: "Interior" } });
        if (!interiorCat) {
            interiorCat = categoryRepo.create({ name: "Interior", description: "Interior modifications and accessories" });
            await categoryRepo.save(interiorCat);
        }

        let exteriorCat = await categoryRepo.findOne({ where: { name: "Exterior" } });
        if (!exteriorCat) {
            exteriorCat = categoryRepo.create({ name: "Exterior", description: "Body kits and exterior styling" });
            await categoryRepo.save(exteriorCat);
        }

        const partRepo = AppDataSource.getRepository(Part);

        const newParts = [
            {
                name: "High-Flow Air Intake",
                description: "Increases horsepower and throttle response. Fits most sports cars.",
                price: 349.99,
                stock_quantity: 50,
                image_url: "https://images.unsplash.com/photo-1626154366838-5110052adbb6?q=80&w=2070",
                category: performanceCat,
                seller: seller
            },
            {
                name: "Sport Suspension Kit",
                description: "Adjustable coilover suspension for improved handling and stance.",
                price: 1299.00,
                stock_quantity: 15,
                image_url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2072",
                category: performanceCat,
                seller: seller
            },
            {
                name: "Race Spec Brake Calipers",
                description: "6-piston high-performance brake calipers in red.",
                price: 899.50,
                stock_quantity: 25,
                image_url: "https://images.unsplash.com/photo-1552886047-987820bc0442?q=80&w=2070",
                category: performanceCat,
                seller: seller
            },
            {
                name: "Titanium Exhaust System",
                description: "Full titanium exhaust system for weight reduction and aggressive sound.",
                price: 2499.00,
                stock_quantity: 8,
                image_url: "https://images.unsplash.com/photo-1615900119312-2acd3a71f3aa?q=80&w=2070",
                category: performanceCat,
                seller: seller
            },
            {
                name: "Carbon Fiber Steering Wheel",
                description: "Ergonomic racing steering wheel with carbon fiber finish.",
                price: 450.00,
                stock_quantity: 30,
                image_url: "https://images.unsplash.com/photo-1622370830495-25251664188b?q=80&w=2070",
                category: interiorCat,
                seller: seller
            },
            {
                name: "Racing Bucket Seats (Pair)",
                description: "FIA approved racing bucket seats with 5-point harness support.",
                price: 1100.00,
                stock_quantity: 12,
                image_url: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070",
                category: interiorCat,
                seller: seller
            },
            {
                name: "LED Underglow Kit",
                description: "RGB underglow kit with remote control and multiple patterns.",
                price: 120.00,
                stock_quantity: 100,
                image_url: "https://images.unsplash.com/photo-1613214150530-84dc248d8866?q=80&w=2070",
                category: exteriorCat,
                seller: seller
            },
            {
                name: "Widebody Fender Flares",
                description: "Universal fit widebody fender flares for aggressive look.",
                price: 399.00,
                stock_quantity: 20,
                image_url: "https://images.unsplash.com/photo-1597818320448-f584e84b8c2c?q=80&w=2070",
                category: exteriorCat,
                seller: seller
            },
            {
                name: "Ceramic Brake Pads",
                description: "Low dust, high performance ceramic brake pads.",
                price: 89.99,
                stock_quantity: 200,
                image_url: "https://images.unsplash.com/photo-1563273188-df09695d7f26?q=80&w=2070",
                category: performanceCat,
                seller: seller
            },
            {
                name: "Digital Dashboard Display",
                description: "Configurable LCD gauge cluster replacement.",
                price: 750.00,
                stock_quantity: 15,
                image_url: "https://images.unsplash.com/photo-1570535316335-d2ed03770428?q=80&w=2000",
                category: interiorCat,
                seller: seller
            }
        ];

        for (const partData of newParts) {
            // Check if exists to avoid duplicates
            const existing = await partRepo.findOne({ where: { name: partData.name } });
            if (!existing) {
                const part = new Part();
                part.name = partData.name;
                part.description = partData.description;
                part.price = partData.price;
                part.stock_quantity = partData.stock_quantity;
                part.image_url = partData.image_url;

                // Explicitly cast or assign relations
                // @ts-ignore
                part.category = partData.category;
                // @ts-ignore
                part.seller = partData.seller;
                part.categoryId = partData.category.id;
                part.sellerId = partData.seller.id;

                await partRepo.save(part);
                console.log(`Added: ${part.name}`);
            } else {
                console.log(`Skipped (already exists): ${partData.name}`);
            }
        }

        console.log("Shop items seeded successfully!");
        process.exit(0);

    } catch (error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
};

seedShopItems();
