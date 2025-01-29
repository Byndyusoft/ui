import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TIME_BEFORE_UNMOUNT } from '../constants';
import { cn } from '../utilities';
import { INotificationsItemProps, TNotificationPosition } from '../Notifications.types';
import './NotificationsItem.css';

const animationClasses: Record<TNotificationPosition, string> = {
    'bottom-left': 'notifications__animation--bottom-left',
    'top-left': 'notifications__animation--top-left',
    'bottom-right': 'notifications__animation--bottom-right',
    'top-right': 'notifications__animation--top-right',
    'top-center': 'notifications__animation--top-center',
    'bottom-center': 'notifications__animation--bottom-center'
};

export const NotificationsItem = (props: INotificationsItemProps) => {
    const {
        dismiss,
        children,
        position,
        duration,
        isAutoClosable,
        isPauseToRemove,
        removeNotification,
        onClick,
        className,
        style
    } = props;

    const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

    const timerStartRef = useRef(0);
    const lastStartRef = useRef(0);
    const remainingTime = useRef(duration);

    const closeNotification = useCallback(() => {
        setIsFadingOut(true);

        setTimeout(() => {
            removeNotification();
        }, TIME_BEFORE_UNMOUNT);
    }, []);

    useEffect(() => {
        if (!isAutoClosable) return;
        remainingTime.current = duration;
    }, [isAutoClosable, duration]);

    useEffect(() => {
        if (!isAutoClosable || duration === Infinity) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const pauseTimer = () => {
            if (timerStartRef.current) {
                const elapsedTime = new Date().getTime() - timerStartRef.current;

                remainingTime.current -= elapsedTime;
            }

            lastStartRef.current = new Date().getTime();
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
        'notifications__item',
        animationClasses[position],
        isFadingOut ? 'notifications__item--hidden' : '',
        onClick ? 'notifications__item--clickable' : '',
        className
    );

    return (
        <li className={classes} onClick={onClick} style={style}>
            {children}
        </li>
    );
};
