import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const require = createRequire(import.meta.url);
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://example.test',
    pretendToBeVisual: true
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
// Use the browser scheduler instead of Node's MessageChannel, which keeps the test process alive.
globalThis.MessageChannel = dom.window.MessageChannel;

const { renderHook, act } = require('@testing-library/react-hooks');
const hooks = JSON.parse(readFileSync(new URL('./hooks.json', import.meta.url), 'utf8'));
const noop = () => undefined;
const ref = { current: null };
const args = {
    'use-array': [[1, 2]],
    'use-click-outside': [noop, ref],
    'use-debounced-callback': [noop, 10],
    'use-debounced-value': [1, 10],
    'use-event-listener': ['click', noop],
    'use-focus': [ref],
    'use-hover': [ref],
    'use-intersection-observer': [ref],
    'use-interval': [noop, null],
    'use-is-mounted': [],
    'use-isomorphic-layout-effect': [noop, []],
    'use-latest-ref': [1],
    'use-local-storage': ['package-test', 1],
    'use-previous': [1],
    'use-resize-observer': [[ref], noop],
    'use-scroll-lock': [false],
    'use-throttled-callback': [noop, 10],
    'use-throttled-value': [1, 10],
    'use-timeout': [noop, null],
    'use-toggle': [true, false, true],
    'use-window-size': []
};

for (const format of ['require', 'import']) {
    for (const name of hooks) {
        test(`${format}: ${name} runs from the npm archive`, async () => {
            const hookName = name.split('/')[1];
            assert.ok(Object.hasOwn(args, hookName), `Add arguments for ${name}`);
            const module = format === 'require' ? require(name) : await import(name);
            const hook = module.default;
            assert.equal(typeof hook, 'function');
            const namedExport = hookName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            assert.equal(module[namedExport], hook);
            assert.equal(require(name), hook);

            const { result, unmount } = renderHook(() => hook(...args[hookName]));
            try {
                assert.equal(result.error, undefined);
                if (hookName === 'use-toggle') {
                    assert.equal(result.current[0], true);
                    act(() => result.current[1].toggle());
                    assert.equal(result.current[0], false);
                }
                if (hookName === 'use-local-storage') {
                    act(() => result.current[1].setValue(2));
                    assert.equal(result.current[0], 2);
                    act(() => result.current[1].removeValue());
                    assert.equal(result.current[0], 1);
                }
                if (['use-debounced-callback', 'use-throttled-callback'].includes(hookName)) {
                    act(() => {
                        result.current('test');
                        result.current.flush();
                        result.current.cancel();
                    });
                }
                assert.equal(result.error, undefined);
            } finally {
                unmount();
                window.localStorage.clear();
            }
        });
    }
}

for (const format of ['require', 'import']) {
    for (const [name, exportName, tag, props] of [
        ['@byndyusoft-ui/text-area', 'TextArea', 'textarea', { withAutoHeight: true }],
        ['@byndyusoft-ui/text-input', 'TextInput', 'input', {}]
    ]) {
        test(`${format}: packed ${exportName} mounts with the real hook dependencies`, async () => {
            const module = format === 'require' ? require(name) : await import(name);
            assert.equal(module.default, module[exportName]);
            assert.equal(require(name), module.default);
            const React = require('react');
            const ReactDOM = require('react-dom');
            const container = document.createElement('div');
            document.body.append(container);
            try {
                act(() => ReactDOM.render(React.createElement(module.default, props), container));
                assert.ok(container.querySelector(tag));
            } finally {
                act(() => ReactDOM.unmountComponentAtNode(container));
                container.remove();
            }
        });
    }
}

for (const extension of ['cts', 'mts', 'ts']) {
    test(`TypeScript consumer .${extension} resolves the published declarations`, () => {
        const ts = require('typescript');
        const filename = fileURLToPath(new URL(`./consumer.${extension}`, import.meta.url));
        const resizeObserverTypes = `
            import useResizeObserver, {
                useResizeObserver as namedUseResizeObserver,
                TResizeObserverCallback,
                TResizeObserverRefs
            } from '@byndyusoft-ui/use-resize-observer';
            const sameHook: typeof useResizeObserver = namedUseResizeObserver;
            const refs: TResizeObserverRefs = [{ current: null }];
            const callback: TResizeObserverCallback = entries => { entries.forEach(entry => entry.target); };
            sameHook(refs, callback);
            import TextArea, { TextArea as NamedTextArea, ITextAreaProps } from '@byndyusoft-ui/text-area';
            import TextInput, { TextInput as NamedTextInput, ITextInputProps } from '@byndyusoft-ui/text-input';
            const textArea: typeof TextArea = NamedTextArea;
            const textInput: typeof TextInput = NamedTextInput;
            const textAreaProps: ITextAreaProps = { withAutoHeight: true, rows: 2 };
            const textInputProps: ITextInputProps = { defaultValue: 'value' };
        `;
        writeFileSync(
            filename,
            hooks
                .map(
                    (name, index) =>
                        `import hook${index} from '${name}';\n` +
                        `const check${index}: (...args: never[]) => unknown = hook${index};`
                )
                .join('\n') + resizeObserverTypes
        );
        const program = ts.createProgram([filename], {
            module: extension === 'ts' ? ts.ModuleKind.CommonJS : ts.ModuleKind.NodeNext,
            moduleResolution: extension === 'ts' ? ts.ModuleResolutionKind.NodeJs : ts.ModuleResolutionKind.NodeNext,
            esModuleInterop: true,
            strict: true,
            target: ts.ScriptTarget.ESNext,
            noEmit: true,
            types: []
        });
        const errors = ts.getPreEmitDiagnostics(program);
        assert.equal(
            errors.length,
            0,
            errors.map(error => ts.flattenDiagnosticMessageText(error.messageText, '\n')).join('\n')
        );
    });
}

test.after(() => dom.window.close());
