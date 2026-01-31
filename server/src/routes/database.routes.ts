import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Part } from "../entities/Part";
import { Category } from "../entities/Category";
import { Order } from "../entities/Order";
import { Notification } from "../entities/Notification";
import { Customization } from "../entities/Customization";
import { Booking } from "../entities/Booking";
import { authenticate } from "../middlewares/auth";

const router = Router();

/**
 * Check for duplicates in all tables
 */
router.get("/check-duplicates", authenticate, async (req: Request, res: Response) => {
    try {
        const duplicates: any = {
            users: [],
            parts: [],
            categories: [],
            notifications: [],
            customizations: [],
            bookings: []
        };

        // Check duplicate users by email
        const duplicateUsers = await AppDataSource.query(`
            SELECT email, COUNT(*) as count, GROUP_CONCAT(id) as ids
            FROM user
            GROUP BY email
            HAVING count > 1
        `);
        duplicates.users = duplicateUsers;

        // Check duplicate parts by name
        const duplicateParts = await AppDataSource.query(`
            SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
            FROM part
            GROUP BY name
            HAVING count > 1
        `);
        duplicates.parts = duplicateParts;

        // Check duplicate categories by name
        const duplicateCategories = await AppDataSource.query(`
            SELECT name, COUNT(*) as count, GROUP_CONCAT(id) as ids
            FROM category
            GROUP BY name
            HAVING count > 1
        `);
        duplicates.categories = duplicateCategories;

        const totalDuplicates =
            duplicates.users.length +
            duplicates.parts.length +
            duplicates.categories.length;

        return res.json({
            message: `Found ${totalDuplicates} duplicate groups`,
            duplicates,
            summary: {
                users: duplicates.users.length,
                parts: duplicates.parts.length,
                categories: duplicates.categories.length
            }
        });
    } catch (error) {
        console.error("Check Duplicates Error:", error);
        return res.status(500).json({ message: "Failed to check duplicates" });
    }
});

/**
 * Remove duplicates from all tables
 * Keeps the latest record (highest ID) for each duplicate group
 */
router.post("/remove-duplicates", authenticate, async (req: Request, res: Response) => {
    try {
        const removedCounts = {
            users: 0,
            parts: 0,
            categories: 0
        };

        // Remove duplicate users (keep latest)
        const duplicateUsers = await AppDataSource.query(`
            SELECT email, MAX(id) as keep_id, GROUP_CONCAT(id) as all_ids
            FROM user
            GROUP BY email
            HAVING COUNT(*) > 1
        `);

        for (const dup of duplicateUsers) {
            const idsToDelete = dup.all_ids.split(',').filter((id: string) => id !== dup.keep_id.toString());
            if (idsToDelete.length > 0) {
                const result = await AppDataSource.query(
                    `DELETE FROM user WHERE id IN (${idsToDelete.join(',')})`
                );
                removedCounts.users += idsToDelete.length;
                console.log(`🗑️ Removed ${idsToDelete.length} duplicate users with email: ${dup.email}`);
            }
        }

        // Remove duplicate parts (keep latest)
        const duplicateParts = await AppDataSource.query(`
            SELECT name, MAX(id) as keep_id, GROUP_CONCAT(id) as all_ids
            FROM part
            GROUP BY name
            HAVING COUNT(*) > 1
        `);

        for (const dup of duplicateParts) {
            const idsToDelete = dup.all_ids.split(',').filter((id: string) => id !== dup.keep_id.toString());
            if (idsToDelete.length > 0) {
                const result = await AppDataSource.query(
                    `DELETE FROM part WHERE id IN (${idsToDelete.join(',')})`
                );
                removedCounts.parts += idsToDelete.length;
                console.log(`🗑️ Removed ${idsToDelete.length} duplicate parts: ${dup.name}`);
            }
        }

        // Remove duplicate categories (keep latest)
        const duplicateCategories = await AppDataSource.query(`
            SELECT name, MAX(id) as keep_id, GROUP_CONCAT(id) as all_ids
            FROM category
            GROUP BY name
            HAVING COUNT(*) > 1
        `);

        for (const dup of duplicateCategories) {
            const idsToDelete = dup.all_ids.split(',').filter((id: string) => id !== dup.keep_id.toString());
            if (idsToDelete.length > 0) {
                const result = await AppDataSource.query(
                    `DELETE FROM category WHERE id IN (${idsToDelete.join(',')})`
                );
                removedCounts.categories += idsToDelete.length;
                console.log(`🗑️ Removed ${idsToDelete.length} duplicate categories: ${dup.name}`);
            }
        }

        const totalRemoved = removedCounts.users + removedCounts.parts + removedCounts.categories;

        return res.json({
            message: `Successfully removed ${totalRemoved} duplicate records`,
            removed: removedCounts,
            note: "Kept the latest record (highest ID) for each duplicate group"
        });
    } catch (error) {
        console.error("Remove Duplicates Error:", error);
        return res.status(500).json({ message: "Failed to remove duplicates" });
    }
});

/**
 * Clean up orphaned records (records that reference deleted parent records)
 */
router.post("/cleanup-orphans", authenticate, async (req: Request, res: Response) => {
    try {
        const cleanedCounts: any = {};

        // Remove parts with invalid categoryId
        const orphanedParts = await AppDataSource.query(`
            DELETE p FROM part p
            LEFT JOIN category c ON p.categoryId = c.id
            WHERE p.categoryId IS NOT NULL AND c.id IS NULL
        `);
        cleanedCounts.partsWithInvalidCategory = orphanedParts.affectedRows || 0;

        // Remove notifications for deleted users
        const orphanedNotifications = await AppDataSource.query(`
            DELETE n FROM notification n
            LEFT JOIN user u ON n.userId = u.id
            WHERE u.id IS NULL
        `);
        cleanedCounts.notificationsForDeletedUsers = orphanedNotifications.affectedRows || 0;

        // Remove orders for deleted customers
        const orphanedOrders = await AppDataSource.query(`
            DELETE o FROM \`order\` o
            LEFT JOIN user u ON o.customerId = u.id
            WHERE u.id IS NULL
        `);
        cleanedCounts.ordersForDeletedCustomers = orphanedOrders.affectedRows || 0;

        const totalCleaned = Object.values(cleanedCounts).reduce((sum: any, count: any) => sum + count, 0);

        return res.json({
            message: `Cleaned up ${totalCleaned} orphaned records`,
            cleaned: cleanedCounts
        });
    } catch (error) {
        console.error("Cleanup Orphans Error:", error);
        return res.status(500).json({ message: "Failed to cleanup orphaned records" });
    }
});

/**
 * Optimize all tables (compress and defragment)
 */
router.post("/optimize-tables", authenticate, async (req: Request, res: Response) => {
    try {
        const tables = ['user', 'part', 'category', 'order', 'order_item', 'notification',
            'customization', 'booking', 'customer_profile', 'seller_profile'];

        const results = [];

        for (const table of tables) {
            try {
                await AppDataSource.query(`OPTIMIZE TABLE \`${table}\``);
                results.push({ table, status: 'optimized' });
                console.log(`✅ Optimized table: ${table}`);
            } catch (error) {
                results.push({ table, status: 'error', error: (error as Error).message });
                console.log(`⚠️ Failed to optimize table: ${table}`);
            }
        }

        return res.json({
            message: "Database optimization complete",
            results
        });
    } catch (error) {
        console.error("Optimize Tables Error:", error);
        return res.status(500).json({ message: "Failed to optimize tables" });
    }
});

/**
 * Get database statistics
 */
router.get("/database-stats", authenticate, async (req: Request, res: Response) => {
    try {
        const stats: any = {};

        // Count records in each table
        const userCount = await AppDataSource.getRepository(User).count();
        const partCount = await AppDataSource.getRepository(Part).count();
        const categoryCount = await AppDataSource.getRepository(Category).count();
        const orderCount = await AppDataSource.getRepository(Order).count();
        const notificationCount = await AppDataSource.getRepository(Notification).count();
        const customizationCount = await AppDataSource.getRepository(Customization).count();
        const bookingCount = await AppDataSource.getRepository(Booking).count();

        stats.records = {
            users: userCount,
            parts: partCount,
            categories: categoryCount,
            orders: orderCount,
            notifications: notificationCount,
            customizations: customizationCount,
            bookings: bookingCount,
            total: userCount + partCount + categoryCount + orderCount + notificationCount + customizationCount + bookingCount
        };

        // Get table sizes
        const tableSizes = await AppDataSource.query(`
            SELECT 
                table_name as tableName,
                ROUND((data_length + index_length) / 1024 / 1024, 2) as sizeMB
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
            ORDER BY (data_length + index_length) DESC
        `);
        stats.tableSizes = tableSizes;

        return res.json(stats);
    } catch (error) {
        console.error("Database Stats Error:", error);
        return res.status(500).json({ message: "Failed to get database stats" });
    }
});

/**
 * Auto-manage category status based on product count
 * Activates categories with products, deactivates empty ones
 */
router.post("/auto-manage-categories", authenticate, async (req: Request, res: Response) => {
    try {
        const { autoManageCategoryStatus } = await import("../services/CategoryStatusService");

        const result = await autoManageCategoryStatus();

        return res.json({
            message: "Category statuses updated automatically",
            result: {
                activated: result.activated,
                deactivated: result.deactivated,
                unchanged: result.unchanged,
                total: result.activated + result.deactivated + result.unchanged
            },
            summary: `${result.activated} categories activated, ${result.deactivated} categories deactivated`
        });
    } catch (error) {
        console.error("Auto-manage Categories Error:", error);
        return res.status(500).json({ message: "Failed to auto-manage categories" });
    }
});

export default router;
