import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entities/User";
import { Category } from "../entities/Category";
import { Car } from "../entities/Car";
import { Part } from "../entities/Part";
import { CustomerProfile } from "../entities/CustomerProfile";
import { SellerProfile } from "../entities/SellerProfile";
import { ServiceProviderProfile } from "../entities/ServiceProviderProfile";
import { DeliveryProfile } from "../entities/DeliveryProfile";
import { SupportProfile } from "../entities/SupportProfile";
import bcrypt from "bcryptjs";

const seed = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected for seeding");

        const hashedPassword = await bcrypt.hash("password", 10);

        // Helper to create user if not exists
        const createUser = async (email: string, role: UserRole, name: string, profileCallback: (user: User) => Promise<void>) => {
            const existingUser = await AppDataSource.manager.findOne(User, { where: { email } });
            if (!existingUser) {
                const user = new User();
                user.email = email;
                user.password = hashedPassword;
                user.role = role;
                user.name = name;
                await AppDataSource.manager.save(user);
                await profileCallback(user);
                console.log(`Created user: ${email}`);
            } else {
                console.log(`User already exists: ${email}`);
            }
        };

        // Seed Users
        await createUser("admin@carvo.com", UserRole.ADMIN, "Admin User", async () => { });

        await createUser("customer@carvo.com", UserRole.CUSTOMER, "John Doe", async (user) => {
            const profile = new CustomerProfile();
            profile.user = user;
            profile.address = "123 Main St";
            await AppDataSource.manager.save(profile);
        });

        await createUser("seller@carvo.com", UserRole.SELLER, "Auto Parts Co", async (user) => {
            const profile = new SellerProfile();
            profile.user = user;
            profile.business_name = "Auto Parts Co";
            profile.address = "456 Industrial Ave";
            await AppDataSource.manager.save(profile);
        });

        await createUser("provider@carvo.com", UserRole.SERVICE_PROVIDER, "Best Mechanics", async (user) => {
            const profile = new ServiceProviderProfile();
            profile.user = user;
            profile.company_name = "Best Mechanics";
            profile.service_types = ["installation", "repair"];
            await AppDataSource.manager.save(profile);
        });

        await createUser("delivery@carvo.com", UserRole.DELIVERY_BOY, "Fast Delivery", async (user) => {
            const profile = new DeliveryProfile();
            profile.user = user;
            profile.vehicle_type = "Van";
            await AppDataSource.manager.save(profile);
        });

        await createUser("support@carvo.com", UserRole.SUPPORT_AGENT, "Support Agent", async (user) => {
            const profile = new SupportProfile();
            profile.user = user;
            profile.employee_id = "EMP001";
            await AppDataSource.manager.save(profile);
        });

        // Seed Categories
        const cat1 = new Category();
        cat1.name = "Wheels";
        cat1.description = "Alloy wheels and rims";
        await AppDataSource.manager.save(cat1);

        const cat2 = new Category();
        cat2.name = "Body Kits";
        cat2.description = "Bumpers, skirts, and spoilers";
        await AppDataSource.manager.save(cat2);

        // Seed Cars
        const car1 = new Car();
        car1.make = "Toyota";
        car1.model = "Supra";
        car1.year = 2023;
        car1.base_price = 50000;
        await AppDataSource.manager.save(car1);

        const car2 = new Car();
        car2.make = "Nissan";
        car2.model = "GT-R";
        car2.year = 2024;
        car2.base_price = 110000;
        await AppDataSource.manager.save(car2);

        // Seed Parts
        const sellerUser = await AppDataSource.manager.findOne(User, { where: { email: "seller@carvo.com" } });
        if (sellerUser) {
            const part1 = new Part();
            part1.name = "19-inch Forged Wheels";
            part1.description = "Lightweight forged wheels";
            part1.price = 2000;
            part1.stock_quantity = 10;
            part1.category = cat1;
            part1.seller = sellerUser;
            await AppDataSource.manager.save(part1);

            const part2 = new Part();
            part2.name = "Carbon Fiber Spoiler";
            part2.description = "Aerodynamic spoiler";
            part2.price = 1500;
            part2.stock_quantity = 5;
            part2.category = cat2;
            part2.seller = sellerUser;
            await AppDataSource.manager.save(part2);
        }

        console.log("Seeding completed");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed", error);
        process.exit(1);
    }
};

seed();
