import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Customization } from "./Customization";

@Entity()
export class Car {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    make!: string;

    @Column()
    model!: string;

    @Column()
    year!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    base_price!: number;

    @Column({ nullable: true })
    image_url!: string;

    @OneToMany(() => Customization, (customization) => customization.car)
    customizations!: Customization[];
}
