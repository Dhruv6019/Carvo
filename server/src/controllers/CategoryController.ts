import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";
import { Part } from "../entities/Part";

export class CategoryController {
    static async getAllCategories(req: Request, res: Response) {
        try {
            const categoryRepository = AppDataSource.getRepository(Category);

            // Use efficient JOIN query to get categories with part counts in one query
            const includeInactive = req.query.includeInactive === "true";

            const queryBuilder = categoryRepository
                .createQueryBuilder("category")
                .leftJoin("category.parts", "part")
                .select([
                    "category.id",
                    "category.name",
                    "category.description",
                    "category.slug",
                    "category.isActive"
                ])
                .addSelect("COUNT(part.id)", "partCount");

            if (!includeInactive) {
                queryBuilder.where("category.isActive = :isActive", { isActive: true });
            }

            const categories = await queryBuilder
                .groupBy("category.id")
                .addGroupBy("category.name")
                .addGroupBy("category.description")
                .addGroupBy("category.slug")
                .addGroupBy("category.isActive")
                .orderBy("category.name", "ASC")
                .getRawMany();

            // Format the response to match expected structure
            const formattedCategories = categories.map(cat => ({
                id: cat.category_id,
                name: cat.category_name,
                description: cat.category_description,
                slug: cat.category_slug,
                isActive: cat.category_isActive,
                partCount: parseInt(cat.partCount) || 0
            }));

            console.log(`📦 Fetched ${formattedCategories.length} categories (Active only: ${!includeInactive})`);

            return res.json(formattedCategories);
        } catch (error) {
            console.error("Get Categories Error:", error);
            return res.status(500).json({ message: "Failed to fetch categories" });
        }
    }

    static async getCategoryBySlug(req: Request, res: Response) {
        try {
            const { slug } = req.params;
            const categoryRepository = AppDataSource.getRepository(Category);

            const category = await categoryRepository.findOne({
                where: { slug, isActive: true },
                relations: ["parts"],
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            return res.json(category);
        } catch (error) {
            console.error("Get Category Error:", error);
            return res.status(500).json({ message: "Failed to fetch category" });
        }
    }
}
