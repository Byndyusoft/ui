import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TIME_BEFORE_UNMOUNT } from '../constants';
import { cn } from '../utilities';
import { INotificationsItemProps, TNotificationPosition } from '../Notifications.types';
import styles from './NotificationsItem.module.css';

const animationClasses: Record<TNotificationPosition, string> = {
    'bottom-left': styles.animation_bottom_left,
    'top-left': styles.animation_top_left,
    'bottom-right': styles.animation_bottom_right,
    'top-right': styles.animation_top_right,
    'top-center': styles.animation_top_center,
    'bottom-center': styles.animation_bottom_center
};

export const NotificationsItem = (props: INotificationsItemProps) => {
    const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

    const {
        dismiss,
        children,
        position,
        theme,
        duration,
        isAutoClosable,
        isPauseToRemove,
        removeNotification,
        className,
        style,
        onClick,
        afterClose
    } = props;

    const timerStartRef = useRef(0);
    const remainingTime = useRef(duration);

    const closeNotification = useCallback(() => {
        setIsFadingOut(true);
        afterClose?.();

        setTimeout(() => {
            removeNotification();
        }, TIME_BEFORE_UNMOUNT);
    }, []);

    useEffect(() => {
        if (!isAutoClosable) return;
        remainingTime.current = duration;
    }, [isAutoClosable, duration]);

    useEffect(() => {
        if (!isAutoClosable || duration === Infinity || duration < 0) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const pauseTimer = () => {
            if (timerStartRef.current) {
                const elapsedTime = new Date().getTime() - timerStartRef.current;

                remainingTime.current -= elapsedTime;
            }
        };

        const startTimer = () => {
            if (remainingTime.current === Infinity) return;

            timerStartRef.current = new Date().getTime();

            timeoutId = setTimeout(closeNotification, remainingTime.current);
        };

        if (isPauseToRemove) {
            pauseTimer();
        } else {
            startTimer();
        }

        return () => clearTimeout(timeoutId);
    }, [isPauseToRemove, closeNotification, isAutoClosable]);

    useEffect(() => {
        if (dismiss) {
            closeNotification();
        }
    }, [dismiss]);

    const classes = cn(
        styles.notification_item,
        animationClasses[position],
        isFadingOut ? styles.hidden : '',
        onClick ? styles.pointer : '',
        className
    );

    const containerRole = theme === 'danger' ? 'alert' : 'status';

    return (
        <li className={classes} style={style} role={containerRole} onClick={onClick}>
            {children}
        </li>
    );
};
