import { CSSProperties, ReactNode } from 'react';
import { Callback } from '@byndyusoft-ui/types';

export type TNotificationItemId = string | number;

export type TNotificationTheme = 'success' | 'info' | 'warning' | 'danger' | 'custom' | 'ordinary';

export type TNotificationPosition =
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';

export interface INotification {
    theme?: TNotificationTheme;
    title?: string;
    message?: ReactNode;
    footer?: ReactNode;
    isClosable?: boolean;
    onClose?: Callback;
    className?: string;
    style?: CSSProperties;
}

export interface INotificationData {
    data: INotificationsItem;
    index: number;
}

export type TNotificationRender = ((params: INotificationData) => ReactNode) | ReactNode;

export type TNotificationRecordRender = Partial<Record<Exclude<TNotificationTheme, 'custom'>, TNotificationRender>>;

export interface INotificationsItem extends INotification {
    id: TNotificationItemId;
    position?: TNotificationPosition;
    duration?: number;
    isClosable?: boolean;
    isAutoClosable?: boolean;
    dismiss?: boolean;
    isCloseOnClick?: boolean;
    render?: TNotificationRender;
    afterClose?: Callback;
    classNameItem?: string;
    styleItem?: CSSProperties;
}

export type TCreateNotificationParams = Partial<Omit<INotificationsItem, 'onClose' | 'dismiss'>>;

export type TThemedNotificationParams = Omit<Partial<INotificationsItem>, 'theme' | 'render' | 'onClose' | 'dismiss'>;

export type TCustomNotificationParams = Partial<
    Omit<INotificationsItem, keyof INotification | 'render' | 'onClose' | 'dismiss'>
>;

export type TPlatformValue =
    | string
    | number
    | {
          web: string | number;
          mobile: string | number;
      };

export interface INotificationsManagerProps {
    position?: TNotificationPosition;
    duration?: number;
    isClosable?: boolean;
    isAutoClosable?: boolean;
    isPauseWhenPageHidden?: boolean;
    isPauseOnHover?: boolean;
    isCloseOnClick?: boolean;
    isNewestOnTop?: boolean;
    limit?: number;
    renderNotification?: TNotificationRender;
    renderNotificationComponents?: TNotificationRecordRender;
    offset?: TPlatformValue;
    gap?: TPlatformValue;
    width?: string | number;
    className?: string;
    classNameItem?: string;
    style?: CSSProperties;
    styleItem?: CSSProperties;
}

export interface IUseNotificationsStateParams {
    position: TNotificationPosition;
    isCloseOnClick: boolean;
    isClosable: boolean;
    limit?: number;
    isNewestOnTop?: boolean;
    renderNotification?: TNotificationRender;
    renderNotificationComponents?: TNotificationRecordRender;
}

export interface INotificationsItemProps {
    children: ReactNode;
    duration: number;
    position: TNotificationPosition;
    removeNotification: () => void;
    dismissNotification: () => void;
    theme?: TNotificationTheme;
    isAutoClosable?: boolean;
    dismiss?: boolean;
    isPauseToRemove?: boolean;
    onClick?: () => void;
    afterClose?: () => void;
    className?: string;
    style?: CSSProperties;
}
