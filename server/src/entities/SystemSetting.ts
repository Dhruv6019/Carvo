
import { Entity, PrimaryColumn, Column, UpdateDateColumn } from "typeorm";

@Entity()
export class SystemSetting {
    @PrimaryColumn()
    key!: string;

    @Column()
    value!: string;

    @Column({ nullable: true })
    description?: string;

    @UpdateDateColumn()
    updated_at!: Date;
}
