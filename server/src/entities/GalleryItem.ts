import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class GalleryItem {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    category!: string;

    @Column()
    imageUrl!: string;

    @Column({ nullable: true })
    client?: string;

    @Column("simple-array", { nullable: true })
    tags?: string[]; // Stored as CSV string in some DBs or generic array in TypeORM

    @Column({ default: 0 })
    likes!: number;

    @Column({ default: 0 })
    views!: number;

    @CreateDateColumn()
    created_at!: Date;
}
