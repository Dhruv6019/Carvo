import nodemailer from "nodemailer";
import { AppDataSource } from "../config/data-source";
import { Notification, NotificationType } from "../entities/Notification";
import { SystemSetting } from "../entities/SystemSetting";

import { User, UserRole } from "../entities/User";

class NotificationService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initializeEmailTransporter();
    }

    private initializeEmailTransporter() {
        // Only initialize if SMTP credentials are provided
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || "587"),
                secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            // Verify connection
            this.transporter.verify((error) => {
                if (error) {
                    console.error("Email transporter verification failed:", error);
                } else {
                    console.log("✅ Email service ready");
                }
            });
        } else {
            console.warn("⚠️  Email service not configured. Set SMTP credentials in .env");
        }
    }

    async sendEmail(to: string, subject: string, html: string) {
        // Check system settings
        try {
            const settingsRepo = AppDataSource.getRepository("SystemSetting");
            const disableEmails = await settingsRepo.findOne({ where: { key: "DISABLE_EMAILS" } });
            if (disableEmails && disableEmails.value === "true") {
                console.log("📧 Email blocked by admin settings:", { to, subject });
                return { success: false, message: "Email notifications disabled by admin" };
            }
        } catch (e) {
            // Ignore error if specific table/entity setup is not yet complete during startup
        }

        if (!this.transporter) {
            console.log("📧 Email (not sent - no SMTP config):", { to, subject });
            return { success: false, message: "Email service not configured" };
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || '"Carvo" <noreply@carvo.com>',
                to,
                subject,
                html,
            });

            console.log("✅ Email sent:", info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error("❌ Email send error:", error);
            return { success: false, error };
        }
    }

    async sendOtpEmail(userEmail: string, otp: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                <h2 style="color: #3b82f6; margin-bottom: 16px;">Verify Your Email</h2>
                <p>Use the following OTP to verify your email address and complete your registration:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <span style="background-color: #f3f4f6; color: #1f2937; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 24px; letter-spacing: 4px;">${otp}</span>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;
        return this.sendEmail(userEmail, "Your Verification Code - Carvo", html);
    }

    async createNotification(
        userId: number,
        type: NotificationType,
        title: string,
        message: string,
        relatedEntityId?: number
    ) {
        try {
            const notificationRepository = AppDataSource.getRepository(Notification);

            const notification = new Notification();
            notification.userId = userId;
            notification.type = type;
            notification.title = title;
            notification.message = message;
            notification.relatedEntityId = relatedEntityId || 0;

            await notificationRepository.save(notification);

            console.log("✅ Notification created:", { userId, type, title });
            return notification;
        } catch (error) {
            console.error("❌ Notification creation error:", error);
            throw error;
        }
    }

    async notifyAllAdmins(type: NotificationType, title: string, message: string, relatedEntityId?: number) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            // Assuming 'admin' is the role string. Adjust if enum is used (UserRole.ADMIN).
            // Using raw string 'admin' based on previous checks, but should verify UserRole import if possible.
            // Let's safe-guard by importing UserRole if we can, or strict string 'admin'.
            // Looking at User.ts imports in other files, UserRole is available.
            // But to minimize import churn in Service, I will look up users where role = 'admin'.

            const admins = await userRepository.find({ where: { role: UserRole.ADMIN } });

            for (const admin of admins) {
                await this.createNotification(admin.id, type, title, message, relatedEntityId);
            }
            console.log(`📢 Notified ${admins.length} admins: ${title}`);
        } catch (error) {
            console.error("Failed to notify admins:", error);
        }
    }

    // Email Templates
    async sendOrderConfirmationEmail(userEmail: string, orderId: number, amount: number) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">Order Confirmed!</h2>
                <p>Thank you for your order with Carvo.</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Total Amount:</strong> ₹${amount.toLocaleString()}</p>
                </div>
                <p>We'll notify you once your order is shipped.</p>
                <p style="color: #6b7280; font-size: 14px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;

        return this.sendEmail(userEmail, `Order Confirmation - #${orderId}`, html);
    }

    async sendPaymentConfirmationEmail(userEmail: string, orderId: number, amount: number) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Payment Confirmed!</h2>
                <p>Your payment has been successfully processed.</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Amount Paid:</strong> ₹${amount.toLocaleString()}</p>
                </div>
                <p>Your order is now being processed.</p>
                <p style="color: #6b7280; font-size: 14px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;

        return this.sendEmail(userEmail, `Payment Confirmed - Order #${orderId}`, html);
    }

    async sendDeliveryNotificationEmail(userEmail: string, orderId: number, trackingNumber: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">Your Order is Out for Delivery!</h2>
                <p>Great news! Your order is on its way.</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
                </div>
                <p>Our delivery partner will contact you shortly.</p>
                <p style="color: #6b7280; font-size: 14px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;

        return this.sendEmail(userEmail, `Order Out for Delivery - #${orderId}`, html);
    }

    async sendWelcomeEmail(userEmail: string, userName: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">Welcome to Carvo!</h2>
                <p>Hi ${userName},</p>
                <p>We're thrilled to have you on board. Carvo is your one-stop shop for premium car modifications and parts.</p>
                <p>Explore our latest collection and start customizing your ride today!</p>
                <a href="http://localhost:5173/shop" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Start Shopping</a>
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;
        return this.sendEmail(userEmail, "Welcome to Carvo!", html);
    }

    async sendOrderCancellationEmail(userEmail: string, orderId: number) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ef4444;">Order Cancelled</h2>
                <p>Your order #${orderId} has been successfully cancelled.</p>
                <p>If you have requested a refund, it will be processed within 5-7 business days.</p>
                <p style="color: #6b7280; font-size: 14px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;
        return this.sendEmail(userEmail, `Order Cancelled - #${orderId}`, html);
    }

    async sendSecurityAlertEmail(userEmail: string, changeType: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f59e0b;">Security Alert</h2>
                <p>This is to notify you that your <strong>${changeType}</strong> was recently changed.</p>
                <p>If this wasn't you, please contact support immediately.</p>
                <p style="color: #6b7280; font-size: 14px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;
        return this.sendEmail(userEmail, `Security Alert - ${changeType} Changed`, html);
    }

    async sendPasswordResetEmail(userEmail: string, resetToken: string) {
        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
                <h2 style="color: #3b82f6; margin-bottom: 16px;">Password Reset Request</h2>
                <p>We received a request to reset your password for your Carvo account. Click the button below to choose a new one:</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
                <p style="color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 24px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;
        return this.sendEmail(userEmail, "Reset Your Password - Carvo", html);
    }

    async sendBookingConfirmationEmail(userEmail: string, userName: string, serviceType: string, date: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3b82f6;">Booking Confirmed</h2>
                <p>Hi ${userName},</p>
                <p>Your booking for <strong>${serviceType}</strong> has been confirmed.</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Service:</strong> ${serviceType}</p>
                    <p><strong>Date:</strong> ${date}</p>
                </div>
                <p>We will notify you once a service provider is assigned.</p>
                <p style="color: #6b7280; font-size: 14px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;
        return this.sendEmail(userEmail, `Booking Confirmed - ${serviceType}`, html);
    }

    async sendCustomizationCreatedEmail(userEmail: string, userName: string, customizationName: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #8b5cf6;">Customization Saved</h2>
                <p>Hi ${userName},</p>
                <p>Your car customization <strong>${customizationName}</strong> has been saved successfully.</p>
                <p>You can view your designs in your dashboard and request a quotation when you're ready.</p>
                <a href="http://localhost:5173/dashboard" style="display: inline-block; background: #8b5cf6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Dashboard</a>
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;
        return this.sendEmail(userEmail, `Customization Saved - ${customizationName}`, html);
    }

    async sendQuotationRequestedEmail(userEmail: string, userName: string, customizationName: string) {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f59e0b;">Quotation Requested</h2>
                <p>Hi ${userName},</p>
                <p>We have received your quotation request for <strong>${customizationName}</strong>.</p>
                <p>Our team is reviewing your requirements and will send you a detailed quote shortly.</p>
                <p style="color: #6b7280; font-size: 14px;">
                    Best regards,<br/>
                    The Carvo Team
                </p>
            </div>
        `;
        return this.sendEmail(userEmail, `Quotation Requested - ${customizationName}`, html);
    }

    async sendInvoiceEmail(userEmail: string, invoice: any) {
        // Format dates
        const issueDate = new Date(invoice.issue_date).toLocaleDateString();
        const dueDate = new Date(invoice.due_date).toLocaleDateString();

        const html = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; background: #ffffff; border: 1px solid #eee; border-radius: 4px;">
                <!-- Header -->
                <table style="width: 100%; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
                    <tr>
                        <td align="left">
                            <h1 style="color: #333; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Invoice</h1>
                            <p style="color: #666; margin: 5px 0 0;">#${invoice.invoice_number}</p>
                        </td>
                        <td align="right">
                            <h2 style="color: #333; margin: 0;">CARVO</h2>
                            <p style="color: #666; margin: 5px 0 0; font-size: 14px;">Premium Car Modifications</p>
                        </td>
                    </tr>
                </table>

                <!-- Info -->
                <table style="width: 100%; margin-bottom: 40px;">
                    <tr>
                        <td valign="top" width="50%">
                            <p style="font-weight: bold; color: #333; margin-bottom: 5px;">Billed To:</p>
                            <p style="margin: 0; color: #666;">${invoice.issued_to_name}</p>
                            <p style="margin: 0; color: #666;">${invoice.issued_to_email}</p>
                            <p style="margin: 0; color: #666;">${invoice.issued_to_address || 'Address provided at checkout'}</p>
                        </td>
                        <td valign="top" width="50%" align="right">
                            <p style="margin: 0; color: #666;"><strong>Issue Date:</strong> ${issueDate}</p>
                            <p style="margin: 0; color: #666;"><strong>Due Date:</strong> ${dueDate}</p>
                            <p style="margin: 5px 0 0; color: #${invoice.status === 'paid' ? '10b981' : 'f59e0b'}; font-weight: bold; text-transform: uppercase;">
                                Status: ${invoice.status}
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Totals -->
                <table style="width: 100%; border-top: 2px solid #eee; padding-top: 20px;">
                    <tr>
                        <td align="right" style="padding: 5px 0;"><strong>Subtotal:</strong></td>
                        <td align="right" style="padding: 5px 0; width: 100px;">₹${Number(invoice.subtotal).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td align="right" style="padding: 5px 0; color: #666;">Tax (${invoice.tax_rate}%):</td>
                        <td align="right" style="padding: 5px 0; width: 100px; color: #666;">₹${Number(invoice.tax_amount).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td align="right" style="padding: 10px 0; border-top: 1px solid #eee; font-size: 18px;"><strong>Total:</strong></td>
                        <td align="right" style="padding: 10px 0; border-top: 1px solid #eee; width: 100px; font-size: 18px; font-weight: bold; color: #3b82f6;">₹${Number(invoice.total).toFixed(2)}</td>
                    </tr>
                </table>

                <!-- Footer -->
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
                    <p>Thank you for your business.</p>
                    <p>Carvo Inc.</p>
                </div>
            </div>
        `;
        return this.sendEmail(userEmail, `Invoice #${invoice.invoice_number}`, html);
    }
}

export default new NotificationService();
