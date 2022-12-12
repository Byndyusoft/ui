import {act, renderHook} from '@testing-library/react-hooks';
import useDebouncedState from './useDebouncedState';

const Setup = <T,>(initValue: T, delay: number) => renderHook(() => useDebouncedState(initValue, delay));

describe('hooks/useDebounceState', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'clearTimeout');
    });

    test('updates state', () => {
        const initValue = '0';
        const testValue1 = '1';
        const testValue2 = '2';

        const { result } = Setup(initValue, 500);
        let [state, setState] = result.current;

        expect(state).toBe(initValue);

        act(() => setState(testValue1));
        jest.advanceTimersByTime(150);
        [state] = result.current;
        expect(state).not.toBe(testValue1);

        act(() => setState(testValue2));
        jest.advanceTimersByTime(600);
        [state] = result.current;
        expect(state).toBe(testValue2);
    });
});