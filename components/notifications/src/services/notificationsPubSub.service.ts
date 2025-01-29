import PubSub from '@byndyusoft-ui/pub-sub';
import { INotificationsItem } from '../Notifications.types';

type TNotificationsPubSubInstance = {
    updateState: (data: Array<INotificationsItem>) => void;
};

const INSTANCE_NAME = 'notifications';

export const notificationsPubSub = PubSub.getInstance<TNotificationsPubSubInstance>(INSTANCE_NAME);
