import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { StoryObj } from '@storybook/react';
import NotificationsManager, { useNotifications, INotificationData } from '..';
import { TNotificationPosition, TNotificationTheme } from '../Notifications.types';
import styles from './Notifications.stories.module.css';
import { NotificationsItem } from '../components/NotificationsItem';

const positions: TNotificationPosition[] = [
    'top-right',
    'top-left',
    'top-center',
    'bottom-right',
    'bottom-left',
    'bottom-center'
];
const themes: TNotificationTheme[] = ['success', 'danger', 'info', 'warning', 'ordinary', 'custom'];

const NotificationComponent = ({ data }: INotificationData): JSX.Element => {
    return (
        <div
            className={`${styles.notification} ${data.theme && styles[data.theme]} ${data.className}`}
            style={data.style}
        >
            <strong>{data.title}</strong>
            {data?.message && <div>{data.message}</div>}
            {data?.footer && <div>{data.footer}</div>}
            {data?.isClosable && (
                <button className={styles.notification_close_btn} onClick={data?.onClose}>
                    ✖️
                </button>
            )}
        </div>
    );
};

const Template = (): JSX.Element => {
    const [activePosition, setActivePosition] = useState<TNotificationPosition>('top-right');
    const [activeTheme, setActiveTheme] = useState<TNotificationTheme>('ordinary');
    const [duration, setDuration] = useState<number>(5000);
    const [limit, setLimit] = useState<number>(0);
    const [isCloseOnClick, setIsCloseOnClick] = useState<boolean>(false);
    const [isPauseWhenPageHidden, setIsPauseWhenPageHidden] = useState<boolean>(true);
    const [isPauseOnHover, setIsPauseOnHover] = useState<boolean>(true);
    const [isNewestOnTop, setIsNewestOnTop] = useState<boolean>(false);
    const [isClosable, setIsClosable] = useState<boolean>(true);
    const [isAutoClosable, setIsAutoClosable] = useState<boolean>(true);

    const { custom, create, dismissAll } = useNotifications();

    const handleChangeInputNumber = (set: Dispatch<SetStateAction<number>>) => (e: ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        set(Number(numericValue));
    };

    const onShowNotification = () => {
        if (activeTheme === 'custom') {
            custom(({ index }) => <div>{index} | Custom notification</div>, {
                position: activePosition,
                duration,
                isCloseOnClick,
                isAutoClosable
            });
        } else {
            create({
                position: activePosition,
                theme: activeTheme,
                title: `🔔 Notification ${activeTheme}`,
                message: 'Notification message',
                footer: new Date().toDateString(),
                duration,
                isCloseOnClick,
                isClosable,
                isAutoClosable
            });
        }
    };

    const renderEmitterCode = () => {
        const baseCode = (type?: string) => `
${type}({
    title: \`🔔 Notification ${activeTheme}\`,
    message: 'Notification message',
    footer: new Date().toDateString(),
    position: ${activePosition},
    delay: ${duration},
    isCloseOnClick: ${isCloseOnClick}
    isClosable: ${isClosable}
    isAutoClosable: ${isAutoClosable}
});`;

        if (activeTheme === 'custom') {
            return `
custom(({data}) => <div>{data.id} | Custom notification</div>,
    {
        position: ${activePosition},
        duration: ${duration},
        isCloseOnClick: ${isCloseOnClick}
        isAutoClosable: ${isAutoClosable}
    }
);`;
        }

        return baseCode(activeTheme);
    };

    return (
        <div className={styles.container}>
            <h1>Notifications</h1>

            <NotificationsManager
                position={activePosition}
                duration={duration}
                limit={limit}
                isCloseOnClick={isCloseOnClick}
                isClosable={isClosable}
                isAutoClosable={isAutoClosable}
                isPauseWhenPageHidden={isPauseWhenPageHidden}
                isPauseOnHover={isPauseOnHover}
                isNewestOnTop={isNewestOnTop}
                renderNotification={NotificationComponent}
            />

            <section className={styles.row}>
                <div className={styles.col}>
                    <h3>Notifications Container</h3>
                    <pre className={styles.code}>
                        <code>
                            {`<NotificationsManager
    position="${activePosition}"
    duration={${duration}}
    limit={${limit}}
    isCloseOnClick={${isCloseOnClick}}
    isClosable={${isClosable}}
    isAutoClosable={${isAutoClosable}}
    isPauseWhenPageHidden={${isPauseWhenPageHidden}}
    isPauseOnHover={${isPauseOnHover}}
    isNewestOnTop={${isNewestOnTop}}
    renderNotification={NotificationComponent}
/>`}
                        </code>
                    </pre>
                </div>
                <div className={styles.col}>
                    <h3>Notification Emitter</h3>
                    <pre className={styles.code}>
                        <code>{renderEmitterCode()}</code>
                    </pre>
                </div>
            </section>

            <section className={styles.col}>
                <div className={styles.col}>
                    <h3>Position</h3>
                    <div className={styles.row}>
                        {positions.map(position => (
                            <button
                                key={position}
                                className={activePosition === position ? styles.button_active : ''}
                                onClick={() => setActivePosition(position)}
                            >
                                {position}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.col}>
                    <h3>Theme</h3>
                    <div className={styles.row}>
                        {themes.map(theme => (
                            <button
                                key={theme}
                                className={activeTheme === theme ? styles.button_active : ''}
                                onClick={() => setActiveTheme(theme)}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.col}>
                    <h3>Options</h3>

                    <label>
                        Autoclose Delay
                        <input
                            type="number"
                            value={duration}
                            disabled={!isAutoClosable}
                            onChange={handleChangeInputNumber(setDuration)}
                        />
                    </label>
                    <label>
                        Limit
                        <input type="number" value={limit} onChange={handleChangeInputNumber(setLimit)} />
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={isCloseOnClick}
                            onChange={e => setIsCloseOnClick(e.target.checked)}
                        />
                        Close on click (isCloseOnClick)
                    </label>
                    <label>
                        <input type="checkbox" checked={isClosable} onChange={e => setIsClosable(e.target.checked)} />
                        Сan close the notification (isClosable)
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={isAutoClosable}
                            onChange={e => setIsAutoClosable(e.target.checked)}
                        />
                        Automatic closing notification by duration (isAutoClosable)
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={isPauseWhenPageHidden}
                            onChange={e => setIsPauseWhenPageHidden(e.target.checked)}
                        />
                        Pause when page hidden (isPauseWhenPageHidden)
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={isPauseOnHover}
                            onChange={e => setIsPauseOnHover(e.target.checked)}
                        />
                        Pause duration on hover (isPauseOnHover)
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={isNewestOnTop}
                            onChange={e => setIsNewestOnTop(e.target.checked)}
                        />
                        Newest on top (isNewestOnTop)
                    </label>
                    <hr />
                    <div className={styles.row}>
                        <button onClick={onShowNotification}>Show notification</button>
                        <button
                            onClick={() => {
                                create({
                                    theme: 'success',
                                    position: 'top-center',
                                    title: 'top-center'
                                });
                            }}
                        >
                            create
                        </button>
                        <button onClick={dismissAll}>Close all</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export const NotificationsStory: StoryObj<typeof Template> = {
    name: 'Notifications tory',
    render: Template,
    args: {}
};

export default {
    title: 'components/Notifications'
    // parameters: {
    //     layout: 'fullscreen'
    // }
};
