import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Quotation } from "./Quotation";

export enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    customer!: User;

    @Column()
    customerId!: number;

    @ManyToOne(() => User)
    provider!: User;

    @Column({ nullable: true })
    providerId!: number;

    @ManyToOne(() => Quotation, { nullable: true })
    quotation!: Quotation;

    @Column({ nullable: true })
    quotationId!: number;

    @Column({ nullable: true })
    service_type!: string;

    @Column("text", { nullable: true })
    notes!: string;

    @Column()
    scheduled_date!: Date;

    @Column({ type: "simple-enum", enum: BookingStatus, default: BookingStatus.PENDING })
    status!: BookingStatus;

    @CreateDateColumn()
    created_at!: Date;
}
