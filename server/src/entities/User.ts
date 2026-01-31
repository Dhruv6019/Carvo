import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from "typeorm";
import { CustomerProfile } from "./CustomerProfile";
import { SellerProfile } from "./SellerProfile";
import { ServiceProviderProfile } from "./ServiceProviderProfile";
import { DeliveryProfile } from "./DeliveryProfile";
import { SupportProfile } from "./SupportProfile";

export enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer",
    SELLER = "seller",
    SERVICE_PROVIDER = "service_provider",
    DELIVERY_BOY = "delivery_boy",
    SUPPORT_AGENT = "support_agent",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column({ nullable: true })
    password!: string;

    @Column({ nullable: true, unique: true })
    googleId?: string;

    @Column({ type: "simple-enum", enum: UserRole, default: UserRole.CUSTOMER })
    role!: UserRole;

    @Column()
    name!: string;

    @Column({ nullable: true })
    phone!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ nullable: true })
    resetPasswordExpires?: Date;

    @OneToOne(() => CustomerProfile, (profile) => profile.user)
    customerProfile!: CustomerProfile;

    @OneToOne(() => SellerProfile, (profile) => profile.user)
    sellerProfile!: SellerProfile;

    @OneToOne(() => ServiceProviderProfile, (profile) => profile.user)
    serviceProviderProfile!: ServiceProviderProfile;

    @OneToOne(() => DeliveryProfile, (profile) => profile.user)
    deliveryProfile!: DeliveryProfile;

    @OneToOne(() => SupportProfile, (profile) => profile.user)
    supportProfile!: SupportProfile;

    @Column({ default: false })
    isVerified!: boolean;

    @Column({ nullable: true })
    otp?: string;

    @Column({ nullable: true })
    otpExpiresAt?: Date;
}
