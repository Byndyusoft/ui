import { CSSProperties } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import useTextAreaAutoHeight from './useTextAreaAutoHeight';
import { createTextArea, ITextAreaEnvironment, setupTextAreaEnvironment } from './__tests__/textAreaEnvironment';

describe('text-area/useTextAreaAutoHeight', () => {
    let environment: ITextAreaEnvironment;

    beforeEach(() => {
        environment = setupTextAreaEnvironment();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        document.body.replaceChildren();
    });

    test('сразу измеряет поле и сохраняет нативный минимум в две строки', () => {
        const element = createTextArea();
        renderHook(() => useTextAreaAutoHeight(element, true));

        expect(element).toHaveStyle({ height: '40px' });
        expect(element.rows).toBe(2);
        expect(element).toHaveStyle({ resize: 'none' });
        expect(element).toHaveStyle({ overflowY: 'hidden' });
        expect(environment.observers[0].observe).toHaveBeenCalledExactlyOnceWith(element);
    });

    test('растёт и уменьшается при неуправляемом вводе, объединяя события в один кадр', () => {
        const element = createTextArea();
        renderHook(() => useTextAreaAutoHeight(element, true));
        environment.layout.contentHeight = 100;
        element.dispatchEvent(new Event('input'));
        element.dispatchEvent(new Event('input'));

        expect(environment.requestFrame).toHaveBeenCalledTimes(1);
        expect(element).toHaveStyle({ height: '40px' });
        act(environment.flushFrames);
        expect(element).toHaveStyle({ height: '100px' });

        environment.layout.contentHeight = 20;
        element.dispatchEvent(new Event('input'));
        act(environment.flushFrames);
        expect(element).toHaveStyle({ height: '40px' });
    });

    test('использует rows как минимум и пересчитывает высоту при его изменении', () => {
        const element = createTextArea();
        element.rows = 4;
        const { rerender } = renderHook(() => useTextAreaAutoHeight(element, true));

        expect(element).toHaveStyle({ height: '80px' });
        element.rows = 1;
        rerender();
        expect(element).toHaveStyle({ height: '20px' });
    });

    test.each([
        ['content-box', '80px'],
        ['border-box', '101px']
    ])('учитывает padding и border при box-sizing %s', (boxSizing, height) => {
        const element = createTextArea();
        element.style.boxSizing = boxSizing;
        element.style.paddingTop = '6px';
        element.style.paddingBottom = '10px';
        element.style.borderTop = '2px solid';
        element.style.borderBottom = '3px solid';
        environment.layout.contentHeight = 80;

        renderHook(() => useTextAreaAutoHeight(element, true));

        expect(element.style.height).toBe(height);
        expect(element).toHaveStyle({ overflowY: 'hidden' });
    });

    test('учитывает минимальную и максимальную высоту CSS и включает прокрутку при переполнении', () => {
        const element = createTextArea();
        element.style.minHeight = '70px';
        element.style.maxHeight = '90px';
        const { rerender } = renderHook(() => useTextAreaAutoHeight(element, true));

        expect(element).toHaveStyle({ height: '70px' });
        environment.layout.contentHeight = 120;
        rerender();
        expect(element).toHaveStyle({ height: '90px' });
        expect(element).toHaveStyle({ overflowY: 'auto' });

        environment.layout.contentHeight = 20;
        rerender();
        expect(element).toHaveStyle({ height: '70px' });
        expect(element).toHaveStyle({ overflowY: 'hidden' });
    });

    test('игнорирует изменения только высоты и реагирует на изменение ширины', () => {
        const element = createTextArea();
        renderHook(() => useTextAreaAutoHeight(element, true));
        act(() => environment.observers[0].notify(element, 200));
        act(environment.flushFrames);
        environment.requestFrame.mockClear();
        environment.layout.contentHeight = 80;

        act(() => environment.observers[0].notify(element, 200, 80));
        expect(environment.requestFrame).not.toHaveBeenCalled();
        expect(element).toHaveStyle({ height: '40px' });

        act(() => environment.observers[0].notify(element, 100));
        act(() => environment.observers[0].notify(element, 150));
        expect(environment.requestFrame).toHaveBeenCalledTimes(1);
        act(environment.flushFrames);
        expect(element).toHaveStyle({ height: '80px' });
    });

    test('использует изменение размера окна как резерв и удаляет подписку', () => {
        vi.stubGlobal('ResizeObserver', undefined);
        const element = createTextArea();
        const { unmount } = renderHook(() => useTextAreaAutoHeight(element, true));
        environment.layout.contentHeight = 80;
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('resize'));

        expect(environment.requestFrame).toHaveBeenCalledTimes(1);
        act(environment.flushFrames);
        expect(element).toHaveStyle({ height: '80px' });
        unmount();
        window.dispatchEvent(new Event('resize'));
        expect(environment.requestFrame).toHaveBeenCalledTimes(1);
    });

    test('не подписывается на размер окна при доступном ResizeObserver', () => {
        const element = createTextArea();
        renderHook(() => useTextAreaAutoHeight(element, true));
        window.dispatchEvent(new Event('resize'));

        expect(environment.requestFrame).not.toHaveBeenCalled();
    });

    test('не измеряет поле при выключенном флаге и начинает при включении', () => {
        const element = createTextArea();
        element.style.height = '60px';
        const { rerender } = renderHook(({ enabled }) => useTextAreaAutoHeight(element, enabled), {
            initialProps: { enabled: false }
        });

        expect(element).toHaveStyle({ height: '60px' });
        expect(environment.observers).toHaveLength(0);
        element.dispatchEvent(new Event('input'));
        expect(environment.requestFrame).not.toHaveBeenCalled();

        rerender({ enabled: true });
        expect(element).toHaveStyle({ height: '40px' });
        expect(environment.observers).toHaveLength(1);
    });

    test('при выключении восстанавливает стили, отменяет кадр и удаляет подписки', () => {
        const element = createTextArea();
        const initialStyle: CSSProperties = { height: 60, overflowY: 'scroll', resize: 'vertical' };
        const nextStyle: CSSProperties = { height: '7em', overflowY: 'visible', resize: 'both' };
        const { rerender } = renderHook(({ enabled, style }) => useTextAreaAutoHeight(element, enabled, style), {
            initialProps: { enabled: true, style: initialStyle }
        });
        element.dispatchEvent(new Event('input'));
        rerender({ enabled: false, style: nextStyle });

        expect(element.style.getPropertyValue('height')).toBe('7em');
        expect(element).toHaveStyle({ overflowY: 'visible' });
        expect(element).toHaveStyle({ resize: 'both' });
        expect(environment.cancelFrame).toHaveBeenCalledTimes(1);
        expect(environment.observers[0].unobserve).toHaveBeenCalledExactlyOnceWith(element);
        act(environment.flushFrames);
        element.dispatchEvent(new Event('input'));
        expect(environment.requestFrame).toHaveBeenCalledTimes(1);

        rerender({ enabled: true, style: nextStyle });
        expect(element).toHaveStyle({ resize: 'none' });
        expect(environment.observers).toHaveLength(1);
    });

    test('при размонтировании восстанавливает актуальные стили и отменяет ожидания', () => {
        const element = createTextArea();
        const initialStyle: CSSProperties = { height: 60, resize: 'vertical' };
        const { rerender, unmount } = renderHook(({ style }) => useTextAreaAutoHeight(element, true, style), {
            initialProps: { style: initialStyle }
        });
        rerender({ style: { height: 80, overflowY: 'scroll', resize: 'both' } });
        element.dispatchEvent(new Event('input'));
        unmount();
        act(environment.flushFrames);

        expect(element).toHaveStyle({ height: '80px' });
        expect(element).toHaveStyle({ overflowY: 'scroll' });
        expect(element).toHaveStyle({ resize: 'both' });
        expect(environment.cancelFrame).toHaveBeenCalledTimes(1);
        expect(environment.observers[0].disconnect).toHaveBeenCalledTimes(1);
        element.dispatchEvent(new Event('input'));
        expect(environment.requestFrame).toHaveBeenCalledTimes(1);
    });

    test('измеряет после восстановления значения нативным сбросом формы', () => {
        const element = createTextArea();
        const form = document.createElement('form');
        document.body.append(form);
        form.append(element);
        element.defaultValue = 'Initial';
        element.value = 'Changed';
        environment.layout.contentHeight = 100;
        renderHook(() => useTextAreaAutoHeight(element, true));

        form.reset();
        expect(element.value).toBe('Initial');
        expect(element).toHaveStyle({ height: '100px' });
        environment.layout.contentHeight = 20;
        act(environment.flushFrames);
        expect(element).toHaveStyle({ height: '40px' });
    });

    test('обновляет подписку на форму при изменении атрибута form', () => {
        const element = createTextArea();
        const first = document.createElement('form');
        const second = document.createElement('form');
        first.id = 'first';
        second.id = 'second';
        document.body.append(first, second);
        element.setAttribute('form', 'first');
        const { rerender } = renderHook(() => useTextAreaAutoHeight(element, true));
        element.setAttribute('form', 'second');
        rerender();

        first.reset();
        expect(environment.requestFrame).not.toHaveBeenCalled();
        second.reset();
        expect(environment.requestFrame).toHaveBeenCalledTimes(1);
    });

    test('пересчитывает высоту после повторного отображения без замены DOM-элемента', () => {
        const element = createTextArea();
        environment.layout.visible = false;
        renderHook(() => useTextAreaAutoHeight(element, true));
        expect(element.style.getPropertyValue('height')).toBe('');
        act(() => environment.observers[0].notify(element, 0));
        act(environment.flushFrames);

        environment.layout.visible = true;
        environment.layout.contentHeight = 80;
        act(() => environment.observers[0].notify(element, 200));
        act(environment.flushFrames);
        expect(element).toHaveStyle({ height: '80px' });
    });

    test('пересчитывает ограничения CSS и размеры шрифта при изменении класса', () => {
        const element = createTextArea();
        const stylesheet = document.createElement('style');
        stylesheet.textContent = '.tall-textarea { line-height: 30px; min-height: 90px; }';
        document.body.append(stylesheet);
        element.style.lineHeight = '';
        const { rerender } = renderHook(() => useTextAreaAutoHeight(element, true));
        element.className = 'tall-textarea';
        rerender();

        expect(element).toHaveStyle({ height: '90px' });
    });

    test('при замене элемента прекращает наблюдение и измерение предыдущего', () => {
        const first = createTextArea();
        const second = createTextArea();
        const { rerender } = renderHook(({ element }) => useTextAreaAutoHeight(element, true), {
            initialProps: { element: first }
        });
        first.dispatchEvent(new Event('input'));
        rerender({ element: second });

        expect(first.style.getPropertyValue('height')).toBe('');
        expect(second).toHaveStyle({ height: '40px' });
        expect(environment.cancelFrame).toHaveBeenCalledTimes(1);
        environment.requestFrame.mockClear();
        first.dispatchEvent(new Event('input'));
        expect(environment.requestFrame).not.toHaveBeenCalled();
        second.dispatchEvent(new Event('input'));
        expect(environment.requestFrame).toHaveBeenCalledTimes(1);
    });
});
