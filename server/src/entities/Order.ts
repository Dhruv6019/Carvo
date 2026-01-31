import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    OUT_FOR_DELIVERY = "out_for_delivery",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "customerId" })
    customer!: User;

    @Column()
    customerId!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    total_amount!: number;

    @Column({ nullable: true })
    coupon_code!: string;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    discount_amount!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    final_amount!: number;

    @Column({ type: "simple-enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status!: OrderStatus;

    @Column()
    shipping_address!: string;

    @Column({ nullable: true })
    deliveryAgentId!: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: "deliveryAgentId" })
    deliveryAgent!: User;

    @Column({ nullable: true })
    trackingNumber!: string;

    @Column({ nullable: true })
    deliveryOtp!: string;

    @OneToMany(() => OrderItem, (item) => item.order)
    items!: OrderItem[];

    @OneToOne("Invoice", (invoice: any) => invoice.order)
    invoice!: any;

    @CreateDateColumn()
    created_at!: Date;
}


