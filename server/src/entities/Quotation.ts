import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { Customization } from "./Customization";

export enum QuotationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    COMPLETED = "completed",
}

@Entity()
export class Quotation {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    customer!: User;

    @Column()
    customerId!: number;

    @ManyToOne(() => Customization)
    customization!: Customization;

    @Column()
    customizationId!: number;

    @ManyToOne(() => User, { nullable: true })
    provider!: User;

    @Column({ nullable: true })
    providerId!: number;

    @Column("decimal", { precision: 10, scale: 2, nullable: true })
    estimated_price!: number;

    @Column({ type: "simple-enum", enum: QuotationStatus, default: QuotationStatus.PENDING })
    @Column({ type: "simple-enum", enum: QuotationStatus, default: QuotationStatus.PENDING })
    status!: QuotationStatus;

    @OneToMany(() => require("./Payment").Payment, (payment: any) => payment.quotation)
    payments!: any[];

    @CreateDateColumn()
    created_at!: Date;
}
