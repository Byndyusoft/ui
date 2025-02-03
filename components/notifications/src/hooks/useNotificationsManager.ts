import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Callback } from '@byndyusoft-ui/types';
import {
    INotificationsItem,
    TNotificationItemId,
    TNotificationPosition,
    IUseNotificationsStateParams,
    TNotificationRender
} from '../Notifications.types';
import { subscriber } from '../services/notificationsPubSub.service';
import { notificationService } from '../services/notifications.service';

export const useNotificationsManager = (params: IUseNotificationsStateParams) => {
    const {
        position,
        limit,
        isCloseOnClick,
        isClosable,
        isNewestOnTop,
        renderNotification,
        renderNotificationComponents
    } = params;

    const [notifications, setNotifications] = useState<Array<INotificationsItem>>([]);

    const possiblePositions: Array<TNotificationPosition> = useMemo(() => {
        const currentPositions = [position].concat(
            notifications
                .filter((n): n is INotificationsItem & { position: TNotificationPosition } => Boolean(n?.position))
                .map(n => n.position)
        );
        return Array.from(new Set(currentPositions));
    }, [notifications, position]);

    const cuttingByLimit = (items: Array<INotificationsItem>, isNewestOnTop?: boolean): Array<INotificationsItem> => {
        if (!limit) return items;

        return isNewestOnTop ? items.slice(-limit) : items.slice(0, limit);
    };

    const onClickAndClose = (itemId: TNotificationItemId, isCloseOnClickItem?: boolean): Callback | undefined => {
        if (isCloseOnClickItem === false || !isCloseOnClick) return undefined;

        return () => notificationService.dismiss(itemId);
    };

    const removeNotification = (itemId: TNotificationItemId) => (): void => {
        notificationService.remove(itemId);
    };

    const executeRender = (
        render: TNotificationRender | undefined,
        data: INotificationsItem,
        index: number
    ): ReactNode | null => {
        return typeof render === 'function' ? render({ data, index }) : render || null;
    };

    const prepareNotificationProps = (item: INotificationsItem): INotificationsItem => {
        return {
            ...item,
            isClosable: item?.isClosable || isClosable,
            onClose: () => {
                notificationService.dismiss(item.id);
            }
        };
    };

    const renderNotificationItem = (notificationItem: INotificationsItem, index: number): ReactNode | null => {
        const prepareItem = prepareNotificationProps(notificationItem);

        if (prepareItem.render) {
            return executeRender(prepareItem.render, prepareItem, index);
        }

        if (
            typeof renderNotificationComponents === 'object' &&
            prepareItem.theme &&
            prepareItem.theme !== 'custom' &&
            renderNotificationComponents[prepareItem.theme]
        ) {
            return executeRender(renderNotificationComponents[prepareItem.theme], prepareItem, index);
        }

        if (renderNotification) {
            return executeRender(renderNotification, prepareItem, index);
        }

        return null;
    };

    const getNotificationsByPosition = (
        positionItem: TNotificationPosition,
        positionIndex: number
    ): Array<INotificationsItem> =>
        notifications.filter(
            notification => (!notification.position && positionIndex === 0) || notification.position === positionItem
        );

    const prepareNotifications = (
        position: TNotificationPosition,
        positionIndex: number
    ): Array<INotificationsItem> => {
        const notificationsByPosition = getNotificationsByPosition(position, positionIndex);

        return cuttingByLimit(
            isNewestOnTop ? notificationsByPosition.reverse() : notificationsByPosition,
            isNewestOnTop
        );
    };

    useEffect(() => {
        const listener = (newNotifications: Array<INotificationsItem>) => {
            setNotifications([...newNotifications]);
        };

        return subscriber(listener);
    }, [setNotifications]);

    return {
        possiblePositions,
        notifications,
        onClickAndClose,
        removeNotification,
        renderNotificationItem,
        prepareNotifications
    };
};
