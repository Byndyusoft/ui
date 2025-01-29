import { notificationService } from '../services/notifications.service';

export const useNotificationsActions = () => ({
    create: notificationService.create,
    update: notificationService.update,
    success: notificationService.success,
    danger: notificationService.danger,
    info: notificationService.info,
    warning: notificationService.warning,
    ordinary: notificationService.ordinary,
    custom: notificationService.custom,
    dismiss: notificationService.dismiss,
    dismissAll: notificationService.dismissAll
});
