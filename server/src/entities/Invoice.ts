import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./Order";

export enum InvoiceStatus {
    PENDING = "pending",
    PAID = "paid",
    OVERDUE = "overdue",
    CANCELLED = "cancelled"
}

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    invoice_number!: string;

    @OneToOne(() => Order)
    @JoinColumn()
    order!: Order;

    @Column()
    relationId!: number; // orderId

    @Column()
    issue_date!: Date;

    @Column()
    due_date!: Date;

    @Column("decimal", { precision: 10, scale: 2 })
    subtotal!: number;

    @Column("decimal", { precision: 10, scale: 2, default: 10.00 })
    tax_rate!: number; // Percentage

    @Column("decimal", { precision: 10, scale: 2 })
    tax_amount!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    total!: number;

    @Column({ type: "simple-enum", enum: InvoiceStatus, default: InvoiceStatus.PENDING })
    status!: InvoiceStatus;

    // Snapshot of customer details at time of invoice generation
    @Column()
    issued_to_name!: string;

    @Column()
    issued_to_address!: string;

    @Column({ nullable: true })
    issued_to_email!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
