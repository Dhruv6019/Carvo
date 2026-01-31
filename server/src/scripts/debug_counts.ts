
import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/Category";

async function debugCounts() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected.");

        const categoryRepository = AppDataSource.getRepository(Category);

        // 1. RAW DATA CHECK
        console.log("\n----- RAW DATA CHECK (SQL) -----");
        // Check "Wheels" (ID 9), "Body Kits" (ID 10), "Engine" (ID 11) manual counts
        const rawParts = await AppDataSource.query(`
            SELECT p.categoryId, c.name, COUNT(*) as count 
            FROM part p 
            JOIN category c ON p.categoryId = c.id
            WHERE p.categoryId IN (9, 10, 11)
            GROUP BY p.categoryId
        `);
        console.log("Raw Counts for problematic categories:");
        console.log(JSON.stringify(rawParts, null, 2));

        if (rawParts.length === 0) {
            console.error("❌ CRITICAL: No parts found for IDs 9, 10, 11 via RAW SQL.");
        }

        // 2. QUERY BUILDER CHECK
        console.log("\n----- TYPEORM QUERY BUILDER CHECK -----");
        const queryBuilder = categoryRepository
            .createQueryBuilder("category")
            .leftJoin("category.parts", "part")
            .select(["category.id", "category.name"])
            .addSelect("COUNT(part.id)", "partCount")
            .where("category.id IN (:...ids)", { ids: [9, 10, 11] })
            .groupBy("category.id")
            .addGroupBy("category.name");

        const sql = queryBuilder.getQuery();
        console.log("📝 Generated SQL:", sql);

        const results = await queryBuilder.getRawMany();
        console.log("\n📊 Query Results:");
        console.log(JSON.stringify(results.map(r => ({
            id: r.category_id,
            name: r.category_name,
            count: r.partCount
        })), null, 2));

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

debugCounts();
