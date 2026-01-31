import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entities/User";
import { generateTokens } from "../utils/jwt";
import { CustomerProfile } from "../entities/CustomerProfile";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import NotificationService from "../services/NotificationService";
import crypto from "crypto";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage'
);

export class AuthController {
    static async signup(req: Request, res: Response) {
        const { email, password, name, role } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const existingUser = await userRepository.findOne({ where: { email } });
            if (existingUser) {
                // If user exists but not verified, we could resend OTP, but for security just say exists
                if (!existingUser.isVerified && !existingUser.googleId) {
                    // Optionally logic to resend OTP here if desired, but simple flow first
                    return res.status(400).json({ message: "User already exists. Please login." });
                }
                return res.status(400).json({ message: "User already exists" });
            }

            const user = new User();
            user.email = email;
            user.password = await bcrypt.hash(password, 10);
            user.name = name;
            user.role = role || UserRole.CUSTOMER;

            // Generate OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes
            user.isVerified = false;

            await userRepository.save(user);

            // Create profile based on role
            if (user.role === UserRole.CUSTOMER) {
                const profile = new CustomerProfile();
                profile.user = user;
                await AppDataSource.getRepository(CustomerProfile).save(profile);
            }

            // Send OTP Email
            await NotificationService.sendOtpEmail(user.email, otp);

            return res.status(201).json({ message: "Signup successful. Please check your email for OTP verification.", userId: user.id });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async verifyOtp(req: Request, res: Response) {
        const { email, otp } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            if (user.isVerified) {
                return res.status(200).json({ message: "User already verified" });
            }

            if (user.otp !== otp) {
                return res.status(400).json({ message: "Invalid OTP" });
            }

            if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
                return res.status(400).json({ message: "OTP expired" });
            }

            // Verify User
            user.isVerified = true;
            user.otp = undefined;
            user.otpExpiresAt = undefined;
            await userRepository.save(user);

            // Send Welcome Email now
            await NotificationService.sendWelcomeEmail(user.email, user.name);

            const tokens = generateTokens(user);
            return res.json({ user, ...tokens });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async resendOtp(req: Request, res: Response) {
        const { email } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            if (user.isVerified) {
                return res.status(400).json({ message: "User already verified" });
            }

            // Generate New OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = otp;
            user.otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes
            await userRepository.save(user);

            await NotificationService.sendOtpEmail(user.email, otp);

            return res.json({ message: "OTP resent successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            if (!user.password) {
                return res.status(401).json({ message: "Please login with Google" });
            }

            // Check verification
            if (!user.isVerified) {
                return res.status(403).json({ message: "Email not verified. Please verify your email.", isVerified: false });
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const tokens = generateTokens(user);
            return res.json({ user, ...tokens });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async googleLogin(req: Request, res: Response) {
        const { code } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const { tokens } = await client.getToken(code);
            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token!,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();

            if (!payload || !payload.email) {
                return res.status(400).json({ message: "Invalid Google token" });
            }

            const { email, sub: googleId, name } = payload;

            // Check if user exists
            let user = await userRepository.findOne({
                where: [
                    { googleId },
                    { email }
                ]
            });

            if (!user) {
                // Create new user
                user = new User();
                user.email = email;
                user.name = name || "Google User";
                user.googleId = googleId;
                user.role = UserRole.CUSTOMER;
                user.isVerified = true; // Google users are automatically verified

                await userRepository.save(user);

                // Create profile
                const profile = new CustomerProfile();
                profile.user = user;
                await AppDataSource.getRepository(CustomerProfile).save(profile);

                // Send Welcome Email (optional for Google login, but good for engagement)
                await NotificationService.sendWelcomeEmail(user.email, user.name);
            } else {
                // Link Google Account if not linked
                if (!user.googleId) {
                    user.googleId = googleId;
                    // If they linked google, verify them
                    user.isVerified = true;
                    await userRepository.save(user);
                }
            }

            const tokensResponse = generateTokens(user);
            return res.json({ user, ...tokensResponse });

        } catch (error) {
            console.error("Google login error details:", error);
            if (error instanceof Error) {
                console.error("Error message:", error.message);
                console.error("Error stack:", error.stack);
            }
            return res.status(500).json({ message: "Google login failed: " + (error instanceof Error ? error.message : "Unknown error") });
        }
    }

    static async refresh(req: Request, res: Response) {
        // Implement refresh token logic here
        return res.status(501).json({ message: "Not implemented yet" });
    }

    static async logout(req: Request, res: Response) {
        // Implement logout logic (e.g., blacklist token)
        return res.json({ message: "Logged out" });
    }

    static async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const user = await userRepository.findOne({ where: { email } });
            if (!user) {
                // Return success even if user not found for security (don't leak registered emails)
                return res.json({ message: "If a user with that email exists, a reset link has been sent." });
            }

            // Generate reset token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = await bcrypt.hash(resetToken, 10);

            // Save token and expiry (1 hour)
            user.resetPasswordToken = hashedToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000);
            await userRepository.save(user);

            // Send email
            await NotificationService.sendPasswordResetEmail(user.email, resetToken);

            return res.json({ message: "If a user with that email exists, a reset link has been sent." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async resetPassword(req: Request, res: Response) {
        const { token, password } = req.body;
        const userRepository = AppDataSource.getRepository(User);

        try {
            const users = await userRepository.find(); // Finding manually because we need to check hashed tokens
            let matchedUser: User | null = null;

            for (const user of users) {
                if (user.resetPasswordToken && user.resetPasswordExpires && user.resetPasswordExpires > new Date()) {
                    const isMatch = await bcrypt.compare(token, user.resetPasswordToken);
                    if (isMatch) {
                        matchedUser = user;
                        break;
                    }
                }
            }

            if (!matchedUser) {
                return res.status(400).json({ message: "Invalid or expired reset token" });
            }

            // Update password
            matchedUser.password = await bcrypt.hash(password, 10);
            matchedUser.resetPasswordToken = undefined;
            matchedUser.resetPasswordExpires = undefined;
            await userRepository.save(matchedUser);

            return res.json({ message: "Password has been reset successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
