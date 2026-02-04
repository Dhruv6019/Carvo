import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Order } from "./Order";
import { Booking } from "./Booking";

export enum PaymentStatus {
    PENDING = "pending",
    AWAITING_CONFIRMATION = "awaiting_confirmation",
    COMPLETED = "completed",
    FAILED = "failed",
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, { nullable: true })
    order!: Order;

    @Column({ nullable: true })
    orderId!: number;

    @ManyToOne(() => Booking, { nullable: true })
    booking!: Booking;

    @Column({ nullable: true })
    bookingId!: number;

    @ManyToOne(() => require("./Quotation").Quotation, { nullable: true })
    quotation!: any;

    @Column({ nullable: true })
    quotationId!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    amount!: number;

    @Column()
    method!: string;

    @Column({ type: "simple-enum", enum: PaymentStatus, default: PaymentStatus.PENDING })
    status!: PaymentStatus;

    @Column({ nullable: true })
    transaction_id!: string;

    @Column({ nullable: true })
    transaction_reference!: string;

    @Column({ nullable: true })
    upi_transaction_id!: string;

    @CreateDateColumn()
    created_at!: Date;
}
