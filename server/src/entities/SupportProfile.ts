import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class SupportProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    employee_id!: string;

    @Column({ nullable: true })
    department!: string;

    @Column({ nullable: true, type: "time" })
    shift_start!: string;

    @Column({ nullable: true, type: "time" })
    shift_end!: string;

    @OneToOne(() => User, (user) => user.supportProfile)
    @JoinColumn()
    user!: User;

    @Column()
    userId!: number;
}
