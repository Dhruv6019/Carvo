import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";

export enum ComplaintStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
}

@Entity()
export class Complaint {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User)
    customer!: User;

    @Column()
    customerId!: number;

    @ManyToOne(() => User, { nullable: true })
    agent!: User;

    @Column({ nullable: true })
    agentId!: number;

    @Column()
    subject!: string;

    @Column("text")
    description!: string;

    @Column({ type: "simple-enum", enum: ComplaintStatus, default: ComplaintStatus.OPEN })
    status!: ComplaintStatus;

    @Column({ default: "medium" })
    priority!: string;

    @CreateDateColumn()
    created_at!: Date;
}
