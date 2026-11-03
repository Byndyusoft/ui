export function getSpacingClassName(spacingPrefix: string, token: string, classPrefix = 'bsui'): string {
    return `${classPrefix}-${spacingPrefix}-${token}`;
}
