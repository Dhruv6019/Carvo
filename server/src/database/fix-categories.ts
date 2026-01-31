import { AppDataSource } from "../config/data-source";

async function manualFix() {
    try {
        await AppDataSource.initialize();
        console.log("✅ Database connected");

        // First, drop the unique index if it exists
        try {
            await AppDataSource.query(`ALTER TABLE category DROP INDEX IDX_cb73208f151aa71cdd78f662d7`);
            console.log("✓ Dropped existing unique index on slug");
        } catch (e) {
            console.log("No existing index to drop (this is fine)");
        }

        // Update all categories with empty or null slugs
        const categories = await AppDataSource.query(`SELECT id, name, slug FROM category`);

        console.log(`Found ${categories.length} categories`);

        for (const cat of categories) {
            if (!cat.slug || cat.slug === '') {
                const newSlug = cat.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                await AppDataSource.query(
                    `UPDATE category SET slug = ?, icon = '📦', partCount = 0, isActive = 1 WHERE id = ?`,
                    [newSlug, cat.id]
                );
                console.log(`  ✓ Updated: ${cat.name} -> ${newSlug}`);
            }
        }

        console.log("✅ All categories fixed!");
        await AppDataSource.destroy();
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

manualFix();
