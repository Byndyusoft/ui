import React, { CSSProperties, useState } from 'react';
import Portal from '@byndyusoft-ui/portal';
import { normalizeCssValue, normalizePlatformValue } from './utilities';
import { NotificationsItem } from './partials/NotificationsItem';
import { useIsDocumentHidden } from './hooks/use-document-visibility';
import { INotificationsManagerProps, TNotificationPosition } from './Notifications.types';
import { useNotificationsManager } from './hooks/useNotificationsManager';
import { cn } from './utilities';
import { NOTIFICATION_LIFETIME, OFFSET, POSITION, NOTIFICATION_WIDTH, GAP } from './constants';
import styles from './NotificationsManager.module.css';

const NotificationsManager = (props: INotificationsManagerProps) => {
    const {
        position = POSITION,
        duration = NOTIFICATION_LIFETIME,
        limit,
        renderNotification,
        renderNotificationComponents,
        isPauseWhenPageHidden = true,
        isPauseOnHover = true,
        isClosable = true,
        isAutoClosable = true,
        isCloseOnClick = false,
        isNewestOnTop = false,
        gap,
        offset,
        width,
        className,
        classNameItem,
        style,
        styleItem
    } = props;

    const [focusedPosition, setFocusedPosition] = useState<TNotificationPosition | null>(null); // Хранение текущей позиции

    const {
        notifications,
        possiblePositions,
        onClickAndClose,
        dismissNotification,
        removeNotification,
        renderNotificationItem,
        prepareNotifications
    } = useNotificationsManager({
        position,
        isCloseOnClick,
        isClosable,
        isNewestOnTop,
        limit,
        renderNotification,
        renderNotificationComponents
    });

    const isDocumentHidden = useIsDocumentHidden();

    if (!notifications?.length) return null;

    return (
        <Portal id="notifications">
            {possiblePositions?.map((position, positionIndex) => {
                const preparedNotifications = prepareNotifications(position, positionIndex);

                if (!preparedNotifications?.length) return null;

                return (
                    <ul
                        key={`notifications-position-${position}`}
                        className={cn(styles.notifications, styles[position], className)}
                        style={
                            {
                                '--offset': normalizePlatformValue('web', OFFSET, offset),
                                '--offset-mobile': normalizePlatformValue('mobile', OFFSET, offset),
                                '--gap': normalizePlatformValue('web', GAP, gap),
                                '--gap-mobile': normalizePlatformValue('mobile', GAP, gap),
                                '--width': normalizeCssValue(width ?? NOTIFICATION_WIDTH),
                                ...style
                            } as CSSProperties
                        }
                        onMouseEnter={() => setFocusedPosition(position)}
                        onMouseLeave={() => setFocusedPosition(null)}
                    >
                        {preparedNotifications?.map((item, itemIndex) => (
                            <NotificationsItem
                                key={`notifications-item-${item.id}`}
                                className={item?.classNameItem || classNameItem}
                                style={item?.styleItem || styleItem}
                                duration={item?.duration ?? duration}
                                position={item?.position || position}
                                theme={item.theme}
                                dismiss={item.dismiss}
                                isAutoClosable={item.isAutoClosable ?? isAutoClosable}
                                isPauseToRemove={
                                    (isPauseOnHover && focusedPosition === position) ||
                                    (isPauseWhenPageHidden && isDocumentHidden)
                                }
                                dismissNotification={dismissNotification(item.id)}
                                removeNotification={removeNotification(item.id)}
                                onClick={onClickAndClose(item.id, item.isCloseOnClick)}
                                afterClose={item?.afterClose}
                            >
                                {renderNotificationItem(item, itemIndex)}
                            </NotificationsItem>
                        ))}
                    </ul>
                );
            })}
        </Portal>
    );
};

export default NotificationsManager;
