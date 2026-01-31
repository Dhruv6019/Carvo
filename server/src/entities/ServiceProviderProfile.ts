import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class ServiceProviderProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    company_name!: string;

    @Column("simple-array", { nullable: true })
    service_types!: string[];

    @Column({ nullable: true })
    experience_years!: number;

    @Column("text", { nullable: true })
    certification_details!: string;

    @Column({ default: false })
    is_verified!: boolean;

    @Column("decimal", { precision: 3, scale: 2, default: 0 })
    rating!: number;

    @Column({ nullable: true })
    operating_hours!: string;

    @Column({ nullable: true })
    address!: string;

    @OneToOne(() => User, (user) => user.serviceProviderProfile)
    @JoinColumn()
    user!: User;

    @Column()
    userId!: number;
}
