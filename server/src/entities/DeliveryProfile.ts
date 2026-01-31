import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class DeliveryProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    vehicle_type!: string;

    @Column({ nullable: true })
    vehicle_model!: string;

    @Column({ nullable: true })
    vehicle_plate_number!: string;

    @Column({ nullable: true })
    license_number!: string;

    @Column({ default: true })
    is_available!: boolean;

    @Column("decimal", { precision: 10, scale: 8, nullable: true })
    current_latitude!: number;

    @Column("decimal", { precision: 11, scale: 8, nullable: true })
    current_longitude!: number;

    @Column("decimal", { precision: 3, scale: 2, default: 0 })
    rating!: number;

    @OneToOne(() => User, (user) => user.deliveryProfile)
    @JoinColumn()
    user!: User;

    @Column()
    userId!: number;
}
