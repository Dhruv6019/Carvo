import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { CustomerProfile } from "../entities/CustomerProfile";
import bcrypt from "bcryptjs";

export class UserController {
    static async getProfile(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const user = await AppDataSource.getRepository(User).findOne({
            where: { id: userId },
            relations: ["customerProfile"]
        });
        if (!user) return res.status(404).json({ message: "User not found" });

        const { password, ...userWithoutPassword } = user;
        return res.json({
            ...userWithoutPassword,
            address: user.customerProfile?.address
        });
    }

    static async updateProfile(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({
            where: { id: userId },
            relations: ["customerProfile"]
        });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Prevent role/password update here
        const { role, password, address, ...updateData } = req.body;

        userRepository.merge(user, updateData);
        await userRepository.save(user);

        // Update Customer Profile if address is provided
        if (address !== undefined && user.role === "customer") {
            const profileRepository = AppDataSource.getRepository(CustomerProfile);
            let profile = user.customerProfile;

            if (!profile) {
                profile = new CustomerProfile();
                profile.user = user;
            }

            profile.address = address;
            await profileRepository.save(profile);
        }

        // Refetch to get full data
        user = await userRepository.findOne({
            where: { id: userId },
            relations: ["customerProfile"]
        });

        const { password: _, ...updatedUser } = user!;
        return res.json({
            ...updatedUser,
            address: updatedUser.customerProfile?.address
        });
    }

    static async changePassword(req: Request, res: Response) {
        const userId = (req as any).user.userId;
        const { currentPassword, newPassword } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: userId } });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid current password" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await userRepository.save(user);

        return res.json({ message: "Password updated successfully" });
    }
}
