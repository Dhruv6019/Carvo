import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";

/**
 * Automatically activate/deactivate categories based on product count
 * - Categories with 0 products → isActive = false
 * - Categories with 1+ products → isActive = true
 */
export async function autoManageCategoryStatus(): Promise<{
    activated: number;
    deactivated: number;
    unchanged: number;
}> {
    try {
        const categoryRepository = AppDataSource.getRepository(Category);

        // Get all categories with their product counts
        const categories = await categoryRepository
            .createQueryBuilder("category")
            .leftJoin("category.parts", "part")
            .select([
                "category.id as id",
                "category.name as name",
                "category.isActive as isActive"
            ])
            .addSelect("COUNT(part.id)", "partCount")
            .groupBy("category.id")
            .addGroupBy("category.name")
            .addGroupBy("category.isActive")
            .getRawMany();

        let activated = 0;
        let deactivated = 0;
        let unchanged = 0;

        for (const cat of categories) {
            const partCount = parseInt(cat.partCount) || 0;
            const shouldBeActive = partCount > 0;
            const currentlyActive = cat.isActive === 1 || cat.isActive === true;

            // Update if status doesn't match what it should be
            if (shouldBeActive && !currentlyActive) {
                // Has products but is inactive → activate it
                await categoryRepository.update(cat.id, { isActive: true });
                activated++;
                console.log(`✅ Activated category "${cat.name}" (${partCount} products)`);
            } else if (!shouldBeActive && currentlyActive) {
                // No products but is active → deactivate it
                await categoryRepository.update(cat.id, { isActive: false });
                deactivated++;
                console.log(`🔒 Deactivated category "${cat.name}" (0 products)`);
            } else {
                unchanged++;
            }
        }

        console.log(`📊 Category status update complete: ${activated} activated, ${deactivated} deactivated, ${unchanged} unchanged`);

        return { activated, deactivated, unchanged };
    } catch (error) {
        console.error("Auto-manage category status error:", error);
        throw error;
    }
}

/**
 * Update a specific category's status based on its product count
 */
export async function updateCategoryStatus(categoryId: number): Promise<boolean> {
    try {
        const categoryRepository = AppDataSource.getRepository(Category);

        const result = await categoryRepository
            .createQueryBuilder("category")
            .leftJoin("category.parts", "part")
            .select("category.id", "id")
            .addSelect("COUNT(part.id)", "partCount")
            .where("category.id = :categoryId", { categoryId })
            .groupBy("category.id")
            .getRawOne();

        if (!result) {
            return false;
        }

        const partCount = parseInt(result.partCount) || 0;
        const shouldBeActive = partCount > 0;

        await categoryRepository.update(categoryId, { isActive: shouldBeActive });

        console.log(`🔄 Updated category ${categoryId} status to ${shouldBeActive ? 'active' : 'inactive'} (${partCount} products)`);

        return true;
    } catch (error) {
        console.error("Update category status error:", error);
        return false;
    }
}

export default {
    autoManageCategoryStatus,
    updateCategoryStatus
};
