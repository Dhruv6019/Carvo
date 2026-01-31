import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

export enum DiscountType {
    PERCENTAGE = "percentage",
    FIXED = "fixed",
}

@Entity()
export class Coupon {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    code!: string;

    @Column({ type: "simple-enum", enum: DiscountType })
    discount_type!: DiscountType;

    @Column("decimal", { precision: 10, scale: 2 })
    discount_value!: number;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    min_order_value!: number;

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    max_discount!: number; // For percentage discounts

    @Column({ type: "timestamp", nullable: true })
    expiry_date!: Date;

    @Column({ default: true })
    is_active!: boolean;

    @Column({ default: 0 })
    usage_limit!: number; // 0 = unlimited

    @Column({ default: 0 })
    used_count!: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
