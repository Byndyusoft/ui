export function hasValue(key: string): boolean {
    return window.localStorage.getItem(key) !== null;
}
