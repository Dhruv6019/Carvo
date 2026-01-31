import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Part } from "./Part";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    slug!: string;

    @Column("text", { nullable: true })
    description!: string;

    @Column({ nullable: true })
    icon!: string; // Icon name or emoji

    @Column({ default: 0 })
    partCount!: number; // Cached count of parts

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany(() => Part, (part) => part.category)
    parts!: Part[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
