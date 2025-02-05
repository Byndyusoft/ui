import {
    INotificationsItem,
    TCreateNotificationParams,
    TCustomNotificationParams,
    TNotificationItemId,
    TNotificationRender,
    TThemedNotificationParams
} from '../Notifications.types';
import { publisher } from './notificationsPubSub.service';

let notificationCounter = 1;

class NotificationsService {
    private notifications: Array<INotificationsItem> = [];
    private readonly notify: () => void;

    constructor(publisher: (data: Array<INotificationsItem>) => void) {
        this.notify = () => publisher(this.notifications);
    }

    create = (partial: TCreateNotificationParams): TNotificationItemId => {
        const id = partial?.id || notificationCounter++;
        const theme = partial?.theme || 'ordinary';
        const index = this.notifications.findIndex(item => item.id === id);
        const updatedItem = {
            ...this.notifications[index],
            ...partial,
            id,
            theme
        };

        if (index !== -1) {
            this.notifications[index] = updatedItem;
        } else {
            this.notifications.push(updatedItem);
        }

        this.notify();

        return id;
    };

    update = (notificationId: TNotificationItemId, patch: Partial<INotificationsItem>): void => {
        const index = this.notifications.findIndex(notification => notification.id === notificationId);

        if (index === -1) return;

        Object.assign(this.notifications[index], patch);

        this.notify();
    };

    ordinary = (params: TThemedNotificationParams): TNotificationItemId => {
        return this.create({ ...params, theme: 'ordinary' });
    };

    success = (params: TThemedNotificationParams): TNotificationItemId => {
        return this.create({ ...params, theme: 'success' });
    };

    danger = (params: TThemedNotificationParams): TNotificationItemId => {
        return this.create({ ...params, theme: 'danger' });
    };

    warning = (params: TThemedNotificationParams): TNotificationItemId => {
        return this.create({ ...params, theme: 'warning' });
    };

    info = (params: TThemedNotificationParams): TNotificationItemId => {
        return this.create({ ...params, theme: 'info' });
    };

    custom = (render: TNotificationRender, params: TCustomNotificationParams = {}): TNotificationItemId => {
        return this.create({ ...params, render, theme: 'custom' });
    };

    remove = (id: TNotificationItemId): void => {
        const index = this.notifications.findIndex(notification => notification.id === id);

        this.notifications = [...this.notifications.slice(0, index), ...this.notifications.slice(index + 1)];

        this.notify();
    };

    removeAll = (): void => {
        this.notifications = [];

        this.notify();
    };

    dismiss = (id: TNotificationItemId): void => {
        this.notifications = this.notifications.map(notification => {
            if (id === notification.id) {
                return { ...notification, dismiss: true };
            }
            return notification;
        });

        this.notify();
    };

    dismissAll = (): void => {
        this.notifications = this.notifications.map(notification => {
            return { ...notification, dismiss: true };
        });

        this.notify();
    };
}

export const notificationService = new NotificationsService(publisher);
