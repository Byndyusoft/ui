import { valuesTokenPattern } from '../constants';
import { TSpacingValues } from '../types';

export function validateValuesKeys(values: TSpacingValues): void {
    Object.keys(values).forEach(token => {
        if (!valuesTokenPattern.test(token)) {
            throw new Error(
                `@byndyusoft-ui/view: недопустимый токен сетки "${token}". ` +
                    'Токен может содержать только латиницу, цифры, дефис и подчёркивание.'
            );
        }
    });
}
