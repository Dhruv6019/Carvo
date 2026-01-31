import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Part } from "../entities/Part";
import { Category } from "../entities/Category";
import { authenticate, authorize } from "../middlewares/auth";
import { UserRole } from "../entities/User";

const router = Router();

/**
 * Seed the database with sample parts for testing
 * Accessible to all users for demo purposes
 */
router.post("/seed-parts", authenticate, async (req: Request, res: Response) => {
    try {
        const partRepository = AppDataSource.getRepository(Part);
        const categoryRepository = AppDataSource.getRepository(Category);

        // Get all categories
        const categories = await categoryRepository.find();

        if (categories.length === 0) {
            return res.status(400).json({ message: "No categories found. Please create categories first." });
        }

        const sampleParts = [
            // Body Kits
            { name: "Carbon Fiber Front Bumper", description: "Lightweight carbon fiber front bumper with aggressive styling", price: 45000, stock: 5, image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500", category: "Body Kits" },
            { name: "Rear Diffuser Kit", description: "Performance rear diffuser for improved aerodynamics", price: 25000, stock: 8, image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500", category: "Body Kits" },

            // Engine
            { name: "Cold Air Intake System", description: "High-flow cold air intake for better performance", price: 18000, stock: 12, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500", category: "Engine" },

            // Brakes
            { name: "Performance Brake Pads", description: "High-performance ceramic brake pads", price: 8500, stock: 20, image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500", category: "Brakes" },
            { name: "Slotted Brake Rotors", description: "Performance slotted brake rotors (set of 4)", price: 15000, stock: 10, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500", category: "Brakes" },
            { name: "Stainless Steel Brake Lines", description: "Braided stainless steel brake line kit", price: 5500, stock: 15, image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500", category: "Brakes" },

            // Exhaust
            { name: "Titanium Exhaust System", description: "Full titanium exhaust with deep tone", price: 65000, stock: 3, image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=500", category: "Exhaust Systems" },
            { name: "Cat-Back Exhaust", description: "Stainless steel cat-back exhaust system", price: 32000, stock: 6, image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=500", category: "Exhaust Systems" },
            { name: "Headers & Downpipe", description: "Performance headers with downpipe", price: 28000, stock: 4, image: "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=500", category: "Exhaust Systems" },

            // Engine Parts
            { name: "Performance Air Filter", description: "Reusable high-flow air filter", price: 4500, stock: 25, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500", category: "Engine Parts" },
            { name: "Turbo Kit", description: "Complete turbocharger kit with all accessories", price: 95000, stock: 2, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500", category: "Engine Parts" },
            { name: "Performance Spark Plugs", description: "Iridium spark plugs (set of 4)", price: 3200, stock: 30, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500", category: "Engine Parts" },
            { name: "ECU Tune Chip", description: "Performance ECU tuning chip", price: 22000, stock: 8, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500", category: "Engine Parts" },
            { name: "Oil Catch Can", description: "Baffled oil catch can system", price: 7500, stock: 12, image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500", category: "Engine Parts" },

            // Exterior
            { name: "Carbon Fiber Hood", description: "Lightweight carbon fiber hood with vents", price: 55000, stock: 4, image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500", category: "Exterior" },
            { name: "LED Headlights", description: "Premium LED headlight assembly", price: 38000, stock: 6, image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500", category: "Exterior" },
            { name: "Side Skirts Set", description: "Aerodynamic side skirts (left + right)", price: 18000, stock: 7, image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500", category: "Exterior" },

            // Interior
            { name: "Racing Seats (Pair)", description: "FIA-approved racing bucket seats", price: 75000, stock: 4, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500", category: "Interior" },
            { name: "Alcantara Steering Wheel", description: "Sport steering wheel with alcantara grip", price: 25000, stock: 8, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500", category: "Interior" },
            { name: "Carbon Fiber Dashboard Trim", description: "Real carbon fiber interior trim kit", price: 15000, stock: 10, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500", category: "Interior" },
            { name: "Floor Mat Set", description: "Premium all-weather floor mats", price: 4500, stock: 20, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500", category: "Interior" },

            // Lighting
            { name: "LED Light Bar", description: "30-inch LED light bar for off-road", price: 12000, stock: 10, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500", category: "Lighting" },
            { name: "Fog Lights Kit", description: "High-intensity LED fog lights", price: 9000, stock: 15, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500", category: "Lighting" },
            { name: "Underglow LED Kit", description: "RGB underglow lighting kit with remote", price: 6500, stock: 12, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500", category: "Lighting" },
            { name: "Tail Light Assembly", description: "LED tail light assembly (left + right)", price: 28000, stock: 5, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500", category: "Lighting" },

            // Suspension
            { name: "Coilover Suspension Kit", description: "Adjustable coilover suspension system", price: 85000, stock: 3, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500", category: "Suspension" },
            { name: "Sway Bar Kit", description: "Front and rear sway bar upgrade kit", price: 18000, stock: 8, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500", category: "Suspension" },
            { name: "Lowering Springs", description: "Performance lowering springs (set of 4)", price: 12000, stock: 10, image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500", category: "Suspension" },

            // Wheels
            { name: "Forged Alloy Wheels 18\"", description: "Lightweight forged wheels (set of 4)", price: 95000, stock: 4, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", category: "Wheels" },

            // Wheels & Tires
            { name: "Performance Tires 225/45R18", description: "High-grip performance tires (set of 4)", price: 32000, stock: 8, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", category: "Wheels & Tires" },
            { name: "Wheel Spacers Kit", description: "Aluminum wheel spacers for better stance", price: 5500, stock: 15, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", category: "Wheels & Tires" },
            { name: "Locking Lug Nuts", description: "Security locking lug nut set", price: 2500, stock: 25, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500", category: "Wheels & Tires" },
        ];

        const createdParts = [];

        for (const partData of sampleParts) {
            // Find matching category
            const category = categories.find(c => c.name === partData.category);

            if (!category) {
                console.log(`⚠️ Category "${partData.category}" not found, skipping ${partData.name}`);
                continue;
            }

            // Check if part already exists
            const existing = await partRepository.findOne({
                where: { name: partData.name }
            });

            if (existing) {
                console.log(`⚠️ Part "${partData.name}" already exists, skipping`);
                continue;
            }

            const part = new Part();
            part.name = partData.name;
            part.description = partData.description;
            part.price = partData.price;
            part.stock_quantity = partData.stock;
            part.image_url = partData.image;
            part.categoryId = category.id;
            part.sellerId = (req as any).user.userId; // Assign to admin/seller

            const saved = await partRepository.save(part);
            createdParts.push(saved);
            console.log(`✅ Created part: ${partData.name} in category ${category.name}`);
        }

        // Auto-manage category status after seeding
        console.log('🔄 Auto-managing category statuses...');
        const { autoManageCategoryStatus } = await import("../services/CategoryStatusService");
        const statusResult = await autoManageCategoryStatus();
        console.log(`📊 Category status: ${statusResult.activated} activated, ${statusResult.deactivated} deactivated`);

        return res.status(201).json({
            message: `Successfully seeded ${createdParts.length} parts`,
            parts: createdParts,
            categoryStatus: {
                activated: statusResult.activated,
                deactivated: statusResult.deactivated,
                message: `${statusResult.activated} categories activated, ${statusResult.deactivated} categories deactivated`
            }
        });
    } catch (error) {
        console.error("Seed Parts Error:", error);
        return res.status(500).json({ message: "Failed to seed parts" });
    }
});

/**
 * Clear all parts from database (for testing)
 * Accessible to all users for demo purposes
 */
router.delete("/clear-parts", authenticate, async (req: Request, res: Response) => {
    try {
        const partRepository = AppDataSource.getRepository(Part);
        const result = await partRepository.delete({});

        // Auto-deactivate all categories after clearing parts
        console.log('🔄 Auto-managing category statuses after clearing...');
        const { autoManageCategoryStatus } = await import("../services/CategoryStatusService");
        const statusResult = await autoManageCategoryStatus();
        console.log(`📊 Category status: ${statusResult.deactivated} deactivated`);

        return res.json({
            message: "All parts cleared",
            deletedCount: result.affected || 0,
            categoryStatus: {
                deactivated: statusResult.deactivated,
                message: `${statusResult.deactivated} empty categories deactivated`
            }
        });
    } catch (error) {
        console.error("Clear Parts Error:", error);
        return res.status(500).json({ message: "Failed to clear parts" });
    }
});

export default router;
