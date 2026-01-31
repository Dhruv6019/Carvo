import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class CustomerProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    address!: string;

    @OneToOne(() => User, (user) => user.customerProfile)
    @JoinColumn()
    user!: User;

    @Column()
    userId!: number;
}
