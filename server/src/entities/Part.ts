import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./Category";
import { User } from "./User";

@Entity()
export class Part {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    description!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;

    @Column()
    stock_quantity!: number;

    @Column({ nullable: true })
    image_url!: string;

    @ManyToOne(() => Category, (category) => category.parts)
    @JoinColumn({ name: "categoryId" })
    category!: Category;

    @Column()
    categoryId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "sellerId" })
    seller!: User;

    @Column({ default: 3 })
    sellerId!: number;
}
