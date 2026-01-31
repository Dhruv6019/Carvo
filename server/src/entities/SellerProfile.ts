import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class SellerProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    business_name!: string;

    @Column({ nullable: true })
    registration_number!: string;

    @Column({ nullable: true })
    tax_id!: string;

    @Column({ nullable: true })
    bank_name!: string;

    @Column({ nullable: true })
    bank_account_number!: string;

    @Column({ default: false })
    is_verified!: boolean;

    @Column("decimal", { precision: 3, scale: 2, default: 0 })
    rating!: number;

    @Column({ nullable: true })
    address!: string;

    @OneToOne(() => User, (user) => user.sellerProfile)
    @JoinColumn()
    user!: User;

    @Column()
    userId!: number;
}
