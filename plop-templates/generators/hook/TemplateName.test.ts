import { renderHook } from '@testing-library/react-hooks';
import TemplateName from './TemplateName';

describe('TemplateName', () => {
    test('rendered', () => {
        const { result } = renderHook(() => TemplateName);

        expect(result.current).toBeDefined();
    });
});
