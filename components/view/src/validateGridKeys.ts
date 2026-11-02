import { TSpacingGrid } from './LayoutConfig.types';

const gridTokenPattern = /^[A-Za-z0-9_-]+$/;

export function validateGridKeys(grid: TSpacingGrid): void {
    Object.keys(grid).forEach(token => {
        if (!gridTokenPattern.test(token)) {
            throw new Error(
                `@byndyusoft-ui/view: недопустимый токен сетки "${token}". ` +
                    'Токен может содержать только латиницу, цифры, дефис и подчёркивание.'
            );
        }
    });
}
