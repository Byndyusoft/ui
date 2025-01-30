import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, waitFor } from '@testing-library/react';
import { INotificationData, INotificationsManagerProps, TThemedNotificationParams } from '../Notifications.types';
import NotificationsManager, { useNotifications } from '../index';
import { TIME_BEFORE_UNMOUNT } from '../constants';

const BUTTON_NAMES = {
    CREATE: 'Create notification',
    UPDATE: 'Update notification',
    SUCCESS: 'Show success',
    DANGER: 'Show danger',
    INFO: 'Show info',
    WARNING: 'Show warning',
    ORDINARY: 'Show ordinary',
    CUSTOM: 'Show custom',
    REMOVE: 'Remove notification',
    REMOVE_ALL: 'Remove all notifications',
    DISMISS: 'Dismiss notification',
    DISMISS_ALL: 'Dismiss all notifications'
};

const NotificationComponent = ({ data }: INotificationData) => (
    <div data-testid="notification-item" className={`notification-item ${data.theme}`}>
        <h3>{data.title}</h3>
        {data?.message && <div>{data.message}</div>}
        {data?.isClosable && (
            <button data-testid="close-button" onClick={data?.onClose}>
                ✖️
            </button>
        )}
    </div>
);

const ActionsComponent = (paramsEmitter: TThemedNotificationParams = {}) => {
    const { create, update, success, danger, info, warning, ordinary, custom, remove, removeAll, dismiss, dismissAll } =
        useNotifications();
    return (
        <div>
            <button
                onClick={() =>
                    create({
                        id: 'id-1',
                        title: 'Title',
                        message: 'Message',
                        footer: 'Footer',
                        ...paramsEmitter
                    })
                }
            >
                {BUTTON_NAMES.CREATE}
            </button>
            <button onClick={() => update('id-1', { title: 'New title', ...paramsEmitter })}>
                {BUTTON_NAMES.UPDATE}
            </button>
            <button onClick={() => success({ title: 'Success', ...paramsEmitter })}>{BUTTON_NAMES.SUCCESS}</button>
            <button onClick={() => danger({ title: 'Danger', ...paramsEmitter })}>{BUTTON_NAMES.DANGER}</button>
            <button onClick={() => info({ title: 'Info', ...paramsEmitter })}>{BUTTON_NAMES.INFO}</button>
            <button onClick={() => warning({ title: 'Warning', ...paramsEmitter })}>{BUTTON_NAMES.WARNING}</button>
            <button onClick={() => ordinary({ title: 'Ordinary', ...paramsEmitter })}>{BUTTON_NAMES.ORDINARY}</button>
            <button onClick={() => custom(<div>Custom</div>, paramsEmitter)}>{BUTTON_NAMES.CUSTOM}</button>
            <button onClick={() => remove('id-1')}>{BUTTON_NAMES.REMOVE}</button>
            <button onClick={removeAll}>{BUTTON_NAMES.REMOVE_ALL}</button>
            <button onClick={() => dismiss('id-1')}>{BUTTON_NAMES.DISMISS}</button>
            <button onClick={dismissAll}>{BUTTON_NAMES.DISMISS_ALL}</button>
        </div>
    );
};

const setup = (props: INotificationsManagerProps = {}, paramsEmitter: TThemedNotificationParams = {}) => {
    return render(
        <div>
            <NotificationsManager renderNotification={NotificationComponent} {...props} />
            <ActionsComponent {...paramsEmitter} />
        </div>
    );
};

describe('NotificationsManager', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    describe('actions', () => {
        test('create notification', async () => {
            const { getByRole, getByTestId } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.CREATE }));

            expect(getByTestId('notification-item')).toBeInTheDocument();
            expect(getByRole('status')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('updates notification', async () => {
            const { getByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.CREATE }));

            expect(getByRole('heading', { level: 3 })).toHaveTextContent('Title');

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.UPDATE }));

            expect(getByRole('heading', { level: 3 })).toHaveTextContent('New title');

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('adds `success` notification', async () => {
            const { getByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.SUCCESS }));

            expect(getByRole('status')).toBeInTheDocument();
            expect(getByRole('heading')).toHaveTextContent('Success');

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('adds `info` notification', async () => {
            const { getByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.INFO }));

            expect(getByRole('status')).toBeInTheDocument();
            expect(getByRole('heading')).toHaveTextContent('Info');

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('adds `warning` notification', async () => {
            const { getByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.WARNING }));

            expect(getByRole('status')).toBeInTheDocument();
            expect(getByRole('heading')).toHaveTextContent('Warning');

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('adds `ordinary` notification', async () => {
            const { getByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.ORDINARY }));

            expect(getByRole('status')).toBeInTheDocument();
            expect(getByRole('heading')).toHaveTextContent('Ordinary');

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('adds `danger` notification', async () => {
            const { getByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.DANGER }));

            expect(getByRole('alert')).toBeInTheDocument();
            expect(getByRole('heading')).toHaveTextContent('Danger');

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('adds `custom` notification', async () => {
            const { getByRole, getByText, queryByTestId } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.CUSTOM }));

            expect(getByText('Custom')).toBeInTheDocument();
            expect(queryByTestId('notification-item')).not.toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('dismiss notification', async () => {
            const { getByRole, queryByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.CREATE }));

            expect(getByRole('status')).toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.DISMISS }));

            await waitFor(
                () => {
                    expect(queryByRole('status')).not.toBeInTheDocument();
                },
                { timeout: TIME_BEFORE_UNMOUNT + 1 }
            );

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('dismiss all notifications', async () => {
            const { getByRole, getAllByRole, queryAllByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.DANGER }));
            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.SUCCESS }));
            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.WARNING }));
            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.DANGER }));
            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.DANGER }));

            expect(getAllByRole('status')).toHaveLength(2);
            expect(getAllByRole('alert')).toHaveLength(3);

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.DISMISS_ALL }));

            await waitFor(
                () => {
                    expect(queryAllByRole('status')).toHaveLength(0);
                    expect(queryAllByRole('alert')).toHaveLength(0);
                },
                { timeout: TIME_BEFORE_UNMOUNT + 1 }
            );

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('remove notification', async () => {
            const { getByRole, queryByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.CREATE }));

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE }));

            expect(queryByRole('status')).not.toBeInTheDocument();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));
        });

        test('remove all notifications', async () => {
            const { getByRole, getAllByRole, queryAllByRole } = setup();

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.SUCCESS }));
            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.WARNING }));

            expect(getAllByRole('status')).toHaveLength(2);

            await userEvent.click(getByRole('button', { name: BUTTON_NAMES.REMOVE_ALL }));

            expect(queryAllByRole('status')).toHaveLength(0);
        });
    });
});
