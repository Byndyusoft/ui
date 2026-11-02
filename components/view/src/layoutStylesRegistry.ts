import { IViewConfig, TSpacingGrid } from './LayoutConfig.types';

export interface ILayoutStyleEntry {
    id: string;
    css: string;
}

const entries = new Map<string, ILayoutStyleEntry>();

function hashLayoutConfig(value: string): string {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;

    for (let index = 0; index < value.length; index++) {
        const char = value.charCodeAt(index);

        h1 = Math.imul(h1 ^ char, 2654435761);
        h2 = Math.imul(h2 ^ char, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return (h2 >>> 0).toString(36) + (h1 >>> 0).toString(36);
}

function injectStyleElement(entry: ILayoutStyleEntry): void {
    if (typeof document === 'undefined') {
        return;
    }

    if (document.getElementById(entry.id)) {
        return;
    }

    const style = document.createElement('style');

    style.id = entry.id;
    style.textContent = entry.css;
    document.head.appendChild(style);
}

function updateStyleElement(entry: ILayoutStyleEntry): void {
    if (typeof document === 'undefined') {
        return;
    }

    const style = document.getElementById(entry.id);

    if (style && style.textContent !== entry.css) {
        style.textContent = entry.css;
    }
}

export function registerLayoutStyles<TGrid extends TSpacingGrid>(
    config: IViewConfig<TGrid>,
    css: string
): ILayoutStyleEntry {
    const key = JSON.stringify(config);
    const existing = entries.get(key);

    if (existing) {
        if (!existing.css.includes(css)) {
            existing.css += css;
            updateStyleElement(existing);
        }

        return existing;
    }

    const entry: ILayoutStyleEntry = { id: `bsui-layout-${hashLayoutConfig(key)}`, css };

    entries.set(key, entry);
    injectStyleElement(entry);

    return entry;
}

export function getLayoutStyleEntries(): Array<ILayoutStyleEntry> {
    return Array.from(entries.values());
}

export function resetLayoutStyles(): void {
    entries.clear();
}
