import { NotificationType } from "../entities/Notification";
import { UserRole } from "../entities/User";

export const NOTIFICATION_ROLE_CONFIG: Record<UserRole, NotificationType[]> = {
    [UserRole.CUSTOMER]: [
        NotificationType.ORDER_UPDATE,
        NotificationType.PAYMENT_CONFIRMED,
        NotificationType.DELIVERY_ASSIGNED,
        NotificationType.DELIVERY_COMPLETED,
        NotificationType.CUSTOMIZATION_APPROVED,
        NotificationType.REVIEW_RECEIVED,
        NotificationType.SYSTEM,
    ],
    [UserRole.SELLER]: [
        NotificationType.ORDER_UPDATE,
        NotificationType.PAYMENT_CONFIRMED,
        NotificationType.LOW_STOCK,
        NotificationType.REVIEW_RECEIVED,
        NotificationType.SYSTEM,
    ],
    [UserRole.DELIVERY_BOY]: [
        NotificationType.DELIVERY_ASSIGNED,
        NotificationType.DELIVERY_COMPLETED,
        NotificationType.ORDER_UPDATE,
        NotificationType.SYSTEM,
    ],
    [UserRole.SERVICE_PROVIDER]: [
        NotificationType.ORDER_UPDATE,
        NotificationType.PAYMENT_CONFIRMED,
        NotificationType.CUSTOMIZATION_APPROVED,
        NotificationType.REVIEW_RECEIVED,
        NotificationType.SYSTEM,
    ],
    [UserRole.SUPPORT_AGENT]: [
        NotificationType.ORDER_UPDATE,
        NotificationType.SYSTEM,
        NotificationType.SECURITY_ALERT,
    ],
    [UserRole.ADMIN]: [
        NotificationType.ORDER_UPDATE,
        NotificationType.PAYMENT_CONFIRMED,
        NotificationType.DELIVERY_ASSIGNED,
        NotificationType.DELIVERY_COMPLETED,
        NotificationType.CUSTOMIZATION_APPROVED,
        NotificationType.SYSTEM,
        NotificationType.SECURITY_ALERT,
        NotificationType.ROLE_UPDATE,
        NotificationType.REVIEW_RECEIVED,
        NotificationType.LOW_STOCK,
    ],
};

export function getAllowedNotificationTypes(role: UserRole): NotificationType[] {
    return NOTIFICATION_ROLE_CONFIG[role] || [];
}

export function isNotificationAllowedForRole(type: NotificationType, role: UserRole): boolean {
    const allowedTypes = NOTIFICATION_ROLE_CONFIG[role] || [];
    return allowedTypes.includes(type);
}
