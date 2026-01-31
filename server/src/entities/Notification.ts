import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

export enum NotificationType {
    ORDER_UPDATE = "order_update",
    PAYMENT_CONFIRMED = "payment_confirmed",
    DELIVERY_ASSIGNED = "delivery_assigned",
    DELIVERY_COMPLETED = "delivery_completed",
    CUSTOMIZATION_APPROVED = "customization_approved",
    SYSTEM = "system",
    SECURITY_ALERT = "security_alert",
    ROLE_UPDATE = "role_update",
    REVIEW_RECEIVED = "review_received",
    LOW_STOCK = "low_stock"
}

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    userId!: number;

    @Column({ type: "simple-enum", enum: NotificationType })
    type!: NotificationType;

    @Column()
    title!: string;

    @Column("text")
    message!: string;

    @Column({ default: false })
    isRead!: boolean;

    @Column({ nullable: true })
    relatedEntityId!: number; // Order ID, Payment ID, etc.

    @CreateDateColumn()
    created_at!: Date;
}
