import PubSub from '@byndyusoft-ui/pub-sub';
import { Callback } from '@byndyusoft-ui/types';
import { INotificationsItem } from '../Notifications.types';

type TNotificationsPubSubInstance = {
    updateState: (data: Array<INotificationsItem>) => void;
};

const INSTANCE_NAME = 'notifications';

const notificationsPubSubInstance = PubSub.getInstance<TNotificationsPubSubInstance>(INSTANCE_NAME);

export const publisher = (dataItems: Array<INotificationsItem>): void => {
    notificationsPubSubInstance.publish('updateState', dataItems);
};

export const subscriber = (listener: Callback<Array<INotificationsItem>>): Callback => {
    notificationsPubSubInstance.subscribe('updateState', listener);

    return () => notificationsPubSubInstance.unsubscribe('updateState', listener);
};
