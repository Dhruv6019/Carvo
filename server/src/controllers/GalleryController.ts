import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { GalleryItem } from "../entities/GalleryItem";

export class GalleryController {
    static async getAll(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(GalleryItem);
            const items = await repo.find({ order: { created_at: "DESC" } });
            return res.json(items);
        } catch (error) {
            console.error("Get Gallery Error:", error);
            return res.status(500).json({ message: "Failed to fetch gallery items" });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(GalleryItem);
            const item = repo.create(req.body);
            await repo.save(item);
            return res.status(201).json(item);
        } catch (error) {
            console.error("Create Gallery Item Error:", error);
            return res.status(500).json({ message: "Failed to create gallery item" });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(GalleryItem);
            const { id } = req.params;
            let item = await repo.findOne({ where: { id: parseInt(id) } });

            if (!item) return res.status(404).json({ message: "Item not found" });

            repo.merge(item, req.body);
            await repo.save(item);
            return res.json(item);
        } catch (error) {
            console.error("Update Gallery Item Error:", error);
            return res.status(500).json({ message: "Failed to update gallery item" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(GalleryItem);
            const { id } = req.params;
            const result = await repo.delete(id);

            if (result.affected === 0) return res.status(404).json({ message: "Item not found" });
            return res.json({ message: "Item deleted" });
        } catch (error) {
            console.error("Delete Gallery Item Error:", error);
            return res.status(500).json({ message: "Failed to delete gallery item" });
        }
    }

    static async seedDefaults(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(GalleryItem);

            const defaults = [
                {
                    title: "Matte Black BMW M3",
                    category: "paint",
                    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800",
                    client: "John D.",
                    likes: 234,
                    views: 1200,
                    tags: ["Matte Black", "Carbon Fiber", "Sport Package"]
                },
                {
                    title: "Red Chrome Ferrari 488",
                    category: "paint",
                    imageUrl: "https://images.unsplash.com/photo-1594955767554-d8564dc08b3e?auto=format&fit=crop&q=80&w=800",
                    client: "Sarah M.",
                    likes: 189,
                    views: 890,
                    tags: ["Chrome Red", "Ceramic Coating", "Performance"]
                },
                {
                    title: "Custom 22\" Forged Wheels",
                    category: "wheels",
                    imageUrl: "https://images.unsplash.com/photo-1611016186353-9afdb8c7d7d2?auto=format&fit=crop&q=80&w=800",
                    client: "Mike R.",
                    likes: 156,
                    views: 670,
                    tags: ["Forged", "22 Inch", "Custom Design"]
                },
                {
                    title: "Luxury Interior Upgrade",
                    category: "interior",
                    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800",
                    client: "Lisa K.",
                    likes: 298,
                    views: 1450,
                    tags: ["Leather", "Alcantara", "Custom Stitching"]
                },
                {
                    title: "Turbo Performance Kit",
                    category: "performance",
                    imageUrl: "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=800",
                    client: "David P.",
                    likes: 312,
                    views: 1800,
                    tags: ["Turbo", "ECU Tune", "Cold Air Intake"]
                },
                {
                    title: "RGB Underglow System",
                    category: "lighting",
                    imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800",
                    client: "Alex C.",
                    likes: 87,
                    views: 420,
                    tags: ["RGB", "Underglow", "App Control"]
                },
                {
                    title: "Ceramic Coating Protection",
                    category: "paint",
                    imageUrl: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=800",
                    client: "James W.",
                    likes: 145,
                    views: 560,
                    tags: ["Ceramic", "Protection", "Shine"]
                },
                {
                    title: "Audio System Overhaul",
                    category: "interior",
                    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800",
                    client: "Ryan G.",
                    likes: 210,
                    views: 980,
                    tags: ["Audio", "Subwoofer", "Custom Enclosure"]
                },
                {
                    title: "Suspension Lowering Kit",
                    category: "performance",
                    imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800",
                    client: "Tom H.",
                    likes: 340,
                    views: 1500,
                    tags: ["Lowered", "Coilovers", "Stance"]
                },
                {
                    title: "Widebody Kit Installation",
                    category: "paint",
                    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
                    client: "Chris B.",
                    likes: 560,
                    views: 2300,
                    tags: ["Widebody", "Aero", "Custom"]
                }
            ];

            let addedCount = 0;
            for (const item of defaults) {
                const exists = await repo.findOne({ where: { title: item.title } });
                if (!exists) {
                    await repo.save(item);
                    addedCount++;
                }
            }

            return res.json({ message: `Seeded ${addedCount} new items`, total: defaults.length });
        } catch (error) {
            console.error("Seed Gallery Error:", error);
            return res.status(500).json({ message: "Failed to seed gallery" });
        }
    }
}
