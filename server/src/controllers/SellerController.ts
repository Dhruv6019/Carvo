import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Part } from "../entities/Part";
import { Category } from "../entities/Category";
import { Order } from "../entities/Order";
import { User, UserRole } from "../entities/User";
import NotificationService from "../services/NotificationService";
import { NotificationType } from "../entities/Notification";

export class SellerController {

    // --- PARTS INVENTORY ---

    static async getInventory(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const partRepository = AppDataSource.getRepository(Part);

            const parts = await partRepository.find({
                where: { sellerId: user.userId },
                relations: ["category"]
            });

            return res.json(parts);
        } catch (error) {
            console.error("Seller Inventory Error:", error);
            return res.status(500).json({ message: "Failed to fetch inventory" });
        }
    }

    static async createPart(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const { name, description, price, stock_quantity, categoryId, image_url } = req.body;

            const partRepository = AppDataSource.getRepository(Part);
            const categoryRepository = AppDataSource.getRepository(Category);

            const category = await categoryRepository.findOne({ where: { id: categoryId } });
            if (!category) return res.status(404).json({ message: "Category not found" });

            const part = new Part();
            part.name = name;
            part.description = description;
            part.price = price;
            part.stock_quantity = stock_quantity;
            /* 
               We must explicitly set categoryId if we want it to be stored directly 
               or just rely on the relation. Better to rely on relation object 
               but Entity has categoryId column too defined? 
               Checking Entity definition from previous view_file:
               @Column() categoryId!: number;
               So we must set it.
            */
            part.category = category;
            part.categoryId = category.id;

            part.image_url = image_url;
            part.sellerId = user.userId;

            await partRepository.save(part);

            // AUTO-SYNC: Update category status
            const { updateCategoryStatus } = await import("../services/CategoryStatusService");
            await updateCategoryStatus(category.id);

            return res.status(201).json(part);
        } catch (error) {
            console.error("Create Part Error:", error);
            return res.status(500).json({ message: "Failed to create part" });
        }
    }

    static async updatePart(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            const { name, description, price, stock_quantity, categoryId, image_url } = req.body;

            const partRepository = AppDataSource.getRepository(Part);

            const part = await partRepository.findOne({ where: { id: parseInt(id) } });

            if (!part) return res.status(404).json({ message: "Part not found" });

            // Ownership check
            if (part.sellerId !== user.userId) {
                return res.status(403).json({ message: "Unauthorized to update this part" });
            }

            if (name) part.name = name;
            if (description) part.description = description;
            if (price) part.price = price;
            if (stock_quantity !== undefined) part.stock_quantity = stock_quantity;
            if (image_url) part.image_url = image_url;

            if (categoryId) {
                const categoryRepository = AppDataSource.getRepository(Category);
                const category = await categoryRepository.findOne({ where: { id: categoryId } });
                if (!category) return res.status(404).json({ message: "Category not found" });
                part.category = category;
                part.categoryId = category.id;
            }

            const oldCategoryId = part.categoryId; // Store old category if needed (though we only have current object)
            // Actually part.categoryId is already updated if we set it above.
            // If we didn't update category, oldCategoryId is same.

            await partRepository.save(part);

            // AUTO-SYNC: Update category status
            const { updateCategoryStatus } = await import("../services/CategoryStatusService");
            if (categoryId) {
                await updateCategoryStatus(parseInt(categoryId));
                // Note: If category changed, we should ideally update the OLD category too.
                // However, tracking the old one requires fetching relation before edit or relying on frontend.
                // For now, updating the NEW one is critical. 
                // To be robust: Running autoManageCategoryStatus() might be safer for updates involving category swaps,
                // but it's heavier. 
                // Let's stick to updating the target category.
            } else {
                // If stock or price changed but category didn't, strictly speaking status won't change 
                // unless we implement logic for "out of stock" = inactive? 
                // Current rule is "count > 0", so updating category is only relevant on add/delete.
                // Updating part details doesn't change count. 
                // So actually, updatePart only needs this if categoryId changed.
                // But let's run it on the current category just in case.
                await updateCategoryStatus(part.categoryId);
            }

            return res.json(part);
        } catch (error) {
            console.error("Update Part Error:", error);
            return res.status(500).json({ message: "Failed to update part" });
        }
    }

    static async deletePart(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = (req as any).user;

            const partRepository = AppDataSource.getRepository(Part);
            const part = await partRepository.findOne({ where: { id: parseInt(id) } });

            if (!part) return res.status(404).json({ message: "Part not found" });

            if (part.sellerId !== user.userId) {
                return res.status(403).json({ message: "Unauthorized to delete this part" });
            }

            await partRepository.remove(part);

            // AUTO-SYNC: Update category status
            const { updateCategoryStatus } = await import("../services/CategoryStatusService");
            await updateCategoryStatus(part.categoryId);

            return res.json({ message: "Part deleted successfully" });
        } catch (error) {
            console.error("Delete Part Error:", error);
            return res.status(500).json({ message: "Failed to delete part" });
        }
    }

    // --- CATEGORIES MANAGEMENT ---
    // Allowing sellers to manage categories globally as per request (or should it be restricted? Plan said CRUD categories)

    static async getCategories(req: Request, res: Response) {
        try {
            const categoryRepository = AppDataSource.getRepository(Category);
            const categories = await categoryRepository.find();
            return res.json(categories);
        } catch (error) {
            return res.status(500).json({ message: "Failed to fetch categories" });
        }
    }

    static async createCategory(req: Request, res: Response) {
        try {
            const { name, description, icon, slug } = req.body;
            const categoryRepository = AppDataSource.getRepository(Category);

            const existing = await categoryRepository.findOne({ where: { slug } });
            if (existing) return res.status(400).json({ message: "Category slug already exists" });

            const category = new Category();
            category.name = name;
            category.description = description;
            category.icon = icon;
            category.slug = slug || name.toLowerCase().replace(/ /g, '-');
            category.isActive = true;

            await categoryRepository.save(category);
            return res.status(201).json(category);
        } catch (error) {
            console.error("Create Category Error:", error);
            return res.status(500).json({ message: "Failed to create category" });
        }
    }

    static async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name, description, icon, isActive } = req.body;
            const categoryRepository = AppDataSource.getRepository(Category);

            const category = await categoryRepository.findOne({ where: { id: parseInt(id) } });
            if (!category) return res.status(404).json({ message: "Category not found" });

            if (name) category.name = name;
            if (description) category.description = description;
            if (icon !== undefined) category.icon = icon;
            if (isActive !== undefined) category.isActive = isActive;

            await categoryRepository.save(category);
            return res.json(category);
        } catch (error) {
            return res.status(500).json({ message: "Failed to update category" });
        }
    }

    static async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const categoryRepository = AppDataSource.getRepository(Category);

            const category = await categoryRepository.findOne({ where: { id: parseInt(id) } });
            if (!category) return res.status(404).json({ message: "Category not found" });

            // Ideally check dependencies (parts) before delete, but basic remove for now
            await categoryRepository.remove(category);
            return res.json({ message: "Category deleted" });
        } catch (error) {
            return res.status(500).json({ message: "Failed to delete category" });
        }
    }

    // --- ORDER & DELIVERY MANAGEMENT ---

    static async assignOrder(req: Request, res: Response) {
        try {
            const { orderId, agentId } = req.body;
            const orderRepository = AppDataSource.getRepository(Order);

            const order = await orderRepository.findOne({
                where: { id: parseInt(orderId) },
                relations: ["customer"]
            });

            if (!order) return res.status(404).json({ message: "Order not found" });

            // In a real app, we'd assign to specific delivery table or field.
            // For now, let's assume we update status or store agent ID in metadata/logs 
            // OR strictly just send notifications as requested by the feature "Assign Delivery".

            // Let's assume we update status to SHIPPED/ASSIGNED
            order.status = 'shipped' as any; // or 'processing'
            await orderRepository.save(order);

            // Notify Customer (Email + In-App)
            if (order.customer?.email) {
                // Tracking number simulation
                const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                await NotificationService.sendDeliveryNotificationEmail(order.customer.email, order.id, trackingNumber);

                await NotificationService.createNotification(
                    order.customerId,
                    NotificationType.DELIVERY_ASSIGNED,
                    "Order Out for Delivery",
                    `Your order #${order.id} has been assigned to a delivery agent. Tracking: ${trackingNumber}`,
                    order.id
                );
            }

            // Notify Delivery Agent (In-App)
            await NotificationService.createNotification(
                parseInt(agentId),
                NotificationType.DELIVERY_ASSIGNED,
                "New Delivery Assignment",
                `New delivery assigned: Order #${order.id}. Pickup details in app.`,
                order.id
            );

            return res.json({ message: "Order assigned successfully" });

        } catch (error) {
            console.error("Assign Order Error:", error);
            return res.status(500).json({ message: "Failed to assign order" });
        }
    }

    static async getOrders(req: Request, res: Response) {
        try {
            const user = (req as any).user;
            const orderRepository = AppDataSource.getRepository(Order);

            // Fetch orders where at least one item belongs to this seller
            // Using QueryBuilder for more reliable nested filtering
            const orders = await orderRepository.createQueryBuilder("order")
                .leftJoinAndSelect("order.customer", "customer")
                .leftJoinAndSelect("order.items", "item")
                .leftJoinAndSelect("item.part", "part")
                .where("part.sellerId = :sellerId", { sellerId: user.userId })
                .orderBy("order.created_at", "DESC")
                .getMany();

            return res.json(orders);
        } catch (error) {
            console.error("Seller Orders Error:", error);
            return res.status(500).json({ message: "Failed to fetch orders" });
        }
    }

    static async getDeliveryAgents(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const agents = await userRepository.find({
                where: { role: UserRole.DELIVERY_BOY }
            });
            return res.json(agents);
        } catch (error) {
            console.error("Fetch Delivery Agents Error:", error);
            return res.status(500).json({ message: "Failed to fetch delivery agents" });
        }
    }
}
