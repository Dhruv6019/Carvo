import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Order } from "./Order";

export enum TransactionType {
    CREDIT = "credit",
    DEBIT = "debit"
}

export enum TransactionSource {
    ORDER_PAYMENT = "order_payment",
    COMMISSION = "commission",
    WITHDRAWAL = "withdrawal"
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    user!: User;

    @Column()
    userId!: number;

    @ManyToOne(() => Order, { nullable: true })
    order!: Order;

    @Column({ nullable: true })
    orderId!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    amount!: number;

    @Column({ type: "simple-enum", enum: TransactionType })
    type!: TransactionType;

    @Column({ type: "simple-enum", enum: TransactionSource })
    source!: TransactionSource;

    @Column({ nullable: true })
    description!: string;

    @CreateDateColumn()
    created_at!: Date;
}
