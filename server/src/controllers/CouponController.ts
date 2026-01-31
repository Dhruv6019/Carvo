import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Coupon, DiscountType } from "../entities/Coupon";

export class CouponController {
    static async validateCoupon(req: Request, res: Response) {
        try {
            const { code, orderAmount } = req.body;

            if (!code || orderAmount === undefined) {
                return res.status(400).json({ message: "Coupon code and order amount are required" });
            }

            const couponRepository = AppDataSource.getRepository(Coupon);
            const coupon = await couponRepository.findOne({
                where: { code: code.toUpperCase() }
            });

            if (!coupon) {
                return res.status(404).json({
                    valid: false,
                    message: "Invalid coupon code"
                });
            }

            // Check if coupon is active
            if (!coupon.is_active) {
                return res.status(400).json({
                    valid: false,
                    message: "This coupon is no longer active"
                });
            }

            // Check expiry
            if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
                return res.status(400).json({
                    valid: false,
                    message: "This coupon has expired"
                });
            }

            // Check usage limit
            if (coupon.usage_limit > 0 && coupon.used_count >= coupon.usage_limit) {
                return res.status(400).json({
                    valid: false,
                    message: "This coupon has reached its usage limit"
                });
            }

            // Check minimum order value
            if (orderAmount < coupon.min_order_value) {
                return res.status(400).json({
                    valid: false,
                    message: `Minimum order value of ₹${coupon.min_order_value} required`
                });
            }

            // Calculate discount
            let discountAmount = 0;
            if (coupon.discount_type === DiscountType.PERCENTAGE) {
                discountAmount = (orderAmount * coupon.discount_value) / 100;
                // Apply max discount cap if set
                if (coupon.max_discount && discountAmount > coupon.max_discount) {
                    discountAmount = coupon.max_discount;
                }
            } else {
                discountAmount = coupon.discount_value;
            }

            // Ensure discount doesn't exceed order amount
            if (discountAmount > orderAmount) {
                discountAmount = orderAmount;
            }

            return res.json({
                valid: true,
                coupon: {
                    code: coupon.code,
                    discount_type: coupon.discount_type,
                    discount_value: coupon.discount_value,
                    discount_amount: discountAmount,
                    final_amount: orderAmount - discountAmount
                },
                message: `Coupon applied! You saved ₹${discountAmount.toFixed(2)}`
            });

        } catch (error) {
            console.error("Validate Coupon Error:", error);
            return res.status(500).json({ message: "Failed to validate coupon" });
        }
    }

    static async getActiveCoupons(req: Request, res: Response) {
        try {
            const couponRepository = AppDataSource.getRepository(Coupon);
            const coupons = await couponRepository.find({
                where: { is_active: true },
                select: ["code", "discount_type", "discount_value", "min_order_value", "expiry_date"]
            });

            // Filter out expired coupons
            const activeCoupons = coupons.filter(coupon =>
                !coupon.expiry_date || new Date(coupon.expiry_date) >= new Date()
            );

            return res.json(activeCoupons);
        } catch (error) {
            console.error("Get Active Coupons Error:", error);
            return res.status(500).json({ message: "Failed to fetch coupons" });
        }
    }

    // Increment coupon usage count (called after successful order)
    static async incrementUsage(code: string) {
        try {
            const couponRepository = AppDataSource.getRepository(Coupon);
            const coupon = await couponRepository.findOne({ where: { code: code.toUpperCase() } });

            if (coupon) {
                coupon.used_count += 1;
                await couponRepository.save(coupon);
            }
        } catch (error) {
            console.error("Increment Coupon Usage Error:", error);
        }
    }

    // Admin: Create Coupon
    static async createCoupon(req: Request, res: Response) {
        try {
            const { code, discount_type, discount_value, min_order_value, max_discount, expiry_date, usage_limit } = req.body;

            const couponRepository = AppDataSource.getRepository(Coupon);

            const existingCoupon = await couponRepository.findOne({ where: { code: code.toUpperCase() } });
            if (existingCoupon) {
                return res.status(400).json({ message: "Coupon code already exists" });
            }

            const coupon = new Coupon();
            coupon.code = code.toUpperCase();
            coupon.discount_type = discount_type;
            coupon.discount_value = discount_value;
            coupon.min_order_value = min_order_value || 0;
            coupon.max_discount = max_discount;
            coupon.expiry_date = expiry_date;
            coupon.usage_limit = usage_limit || 0;
            coupon.is_active = true;

            await couponRepository.save(coupon);

            return res.status(201).json(coupon);
        } catch (error) {
            console.error("Create Coupon Error:", error);
            return res.status(500).json({ message: "Failed to create coupon" });
        }
    }

    // Admin: Get All Coupons
    static async getAllCoupons(req: Request, res: Response) {
        try {
            const couponRepository = AppDataSource.getRepository(Coupon);
            const coupons = await couponRepository.find({
                order: { created_at: "DESC" }
            });
            return res.json(coupons);
        } catch (error) {
            console.error("Get All Coupons Error:", error);
            return res.status(500).json({ message: "Failed to fetch coupons" });
        }
    }

    // Admin: Update Coupon
    static async updateCoupon(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { code, discount_type, discount_value, min_order_value, max_discount, expiry_date, usage_limit, is_active } = req.body;

            const couponRepository = AppDataSource.getRepository(Coupon);
            const coupon = await couponRepository.findOne({ where: { id: parseInt(id) } });

            if (!coupon) {
                return res.status(404).json({ message: "Coupon not found" });
            }

            coupon.code = code.toUpperCase();
            coupon.discount_type = discount_type;
            coupon.discount_value = discount_value;
            coupon.min_order_value = min_order_value;
            coupon.max_discount = max_discount;
            coupon.expiry_date = expiry_date;
            coupon.usage_limit = usage_limit;
            if (is_active !== undefined) coupon.is_active = is_active;

            await couponRepository.save(coupon);

            return res.json(coupon);
        } catch (error) {
            console.error("Update Coupon Error:", error);
            return res.status(500).json({ message: "Failed to update coupon" });
        }
    }

    // Admin: Delete Coupon
    static async deleteCoupon(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const couponRepository = AppDataSource.getRepository(Coupon);

            const result = await couponRepository.delete(id);

            if (result.affected === 0) {
                return res.status(404).json({ message: "Coupon not found" });
            }

            return res.json({ message: "Coupon deleted successfully" });
        } catch (error) {
            console.error("Delete Coupon Error:", error);
            return res.status(500).json({ message: "Failed to delete coupon" });
        }
    }
}
