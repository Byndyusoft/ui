// @vitest-environment node
import { getStyleEntries, registerStyles } from '../utilities';

describe('components/View/stylesRegistry (SSR)', () => {
    test('регистрация в окружении без DOM не падает и не трогает document', () => {
        expect(typeof document).toBe('undefined');

        const config = { step: { value: 8, unit: 'px' }, values: { md: 1 } } as const;

        expect(() => registerStyles(config, '.bsui-p-md{}')).not.toThrow();
        expect(getStyleEntries().length).toBeGreaterThan(0);
    });
});
