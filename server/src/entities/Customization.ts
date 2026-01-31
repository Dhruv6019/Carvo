import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Car } from "./Car";

@Entity()
export class Customization {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("json")
    configuration!: any;

    @Column({ nullable: true })
    preview_token!: string;

    @ManyToOne(() => User)
    customer!: User;

    @Column()
    customerId!: number;

    @ManyToOne(() => Car, (car) => car.customizations)
    car!: Car;

    @Column()
    carId!: number;

    @CreateDateColumn()
    created_at!: Date;
}
