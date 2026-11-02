import { validateValuesKeys } from '../utilities';

describe('components/View/validateValuesKeys', () => {
    test('принимает буквенные, цифровые и смешанные токены', () => {
        expect(() => validateValuesKeys({ xs: 0.25, '025': 0.25, 's-1': 1, token_name: 2 })).not.toThrow();
    });

    test.each(['my token', 'a.b', 'a:b', 'a/b', ''])('отклоняет недопустимый токен "%s"', token => {
        expect(() => validateValuesKeys({ [token]: 1 })).toThrow(`недопустимый токен сетки "${token}"`);
    });
});
