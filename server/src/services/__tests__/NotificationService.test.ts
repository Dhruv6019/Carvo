import { NotificationService } from "../NotificationService";

describe("NotificationService", () => {
    it("should send an email", async () => {
        const result = await NotificationService.sendEmail("test@example.com", "Subject", "Body");
        expect(result).toBe(true);
    });

    it("should send an in-app notification", async () => {
        const result = await NotificationService.sendInAppNotification(1, "Message");
        expect(result).toBe(true);
    });
});
