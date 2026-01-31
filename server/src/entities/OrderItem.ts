import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./Order";
import { Part } from "./Part";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: "orderId" })
    order!: Order;

    @Column()
    orderId!: number;

    @ManyToOne(() => Part)
    @JoinColumn({ name: "partId" })
    part!: Part;

    @Column()
    partId!: number;

    @Column()
    quantity!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    price!: number;
}
