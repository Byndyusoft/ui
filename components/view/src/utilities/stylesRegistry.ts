import { IViewConfig, TSpacingValues, IViewStyleEntry } from '../types';

const entries = new Map<string, IViewStyleEntry>();

function hash(value: string): string {
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

function injectStyleElement(entry: IViewStyleEntry): void {
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

function updateStyleElement(entry: IViewStyleEntry): void {
    if (typeof document === 'undefined') {
        return;
    }

    const style = document.getElementById(entry.id);

    if (style && style.textContent !== entry.css) {
        style.textContent = entry.css;
    }
}

export function registerStyles<TGrid extends TSpacingValues>(config: IViewConfig<TGrid>, css: string): IViewStyleEntry {
    const key = JSON.stringify(config);
    const existing = entries.get(key);

    if (existing) {
        if (!existing.css.includes(css)) {
            existing.css += css;
            updateStyleElement(existing);
        }

        return existing;
    }

    const entry: IViewStyleEntry = { id: `bsui-layout-${hash(key)}`, css };

    entries.set(key, entry);

    injectStyleElement(entry);

    return entry;
}

export function getStyleEntries(): Array<IViewStyleEntry> {
    return Array.from(entries.values());
}

export function resetStyles(): void {
    entries.clear();
}
