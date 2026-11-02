// @vitest-environment node
import { getLayoutStyleEntries, registerLayoutStyles } from './layoutStylesRegistry';

describe('components/View/layoutStylesRegistry (SSR)', () => {
    test('регистрация в окружении без DOM не падает и не трогает document', () => {
        expect(typeof document).toBe('undefined');

        const config = { unit: '8px', grid: { md: 1 } } as const;

        expect(() => registerLayoutStyles(config, '.bsui-p-md{}')).not.toThrow();
        expect(getLayoutStyleEntries().length).toBeGreaterThan(0);
    });
});
