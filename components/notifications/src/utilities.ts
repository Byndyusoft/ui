import { TPlatformValue } from './Notifications.types';

export function cn(...classes: Array<string | undefined>): string {
    return classes.filter(Boolean).join(' ');
}

export const normalizeCssValue = (value: number | string): number | string => {
    return typeof value === 'number' ? `${value}px` : value;
};

export const normalizePlatformValue = (
    type: 'web' | 'mobile',
    defaultValue: number,
    platformValue?: TPlatformValue
): string | number => {
    if (typeof platformValue === 'number' || typeof platformValue === 'string') {
        return normalizeCssValue(platformValue ?? defaultValue);
    }

    return normalizeCssValue(platformValue?.[type] ?? defaultValue);
};
