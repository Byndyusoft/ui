import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import TextEditor from '@byndyusoft-ui/text-editor';
import { ALL_TOOLS } from './utilities/markdown';

const meta: Meta = { title: 'Components/TextEditor', component: TextEditor };
export default meta;

export function Default(): React.ReactElement {
    return <TextEditor aria-label="Описание" placeholder="Введите описание" />;
}
export function Full(): React.ReactElement {
    return (
        <TextEditor
            tools={ALL_TOOLS}
            withAutoHeight
            aria-label="Статья"
            defaultValue={
                '# Заголовок\n\n**Жирный** *курсив* ++подчёркнутый++ ~~зачёркнутый~~\n\n1. Первый\n2. Второй\n    - Вложенный\n\n[Ссылка](/article)'
            }
        />
    );
}
export function NoTools(): React.ReactElement {
    return (
        <TextEditor
            tools={[]}
            aria-label="Сохранённое оформление"
            defaultValue={'## Заголовок\n\n**Жирный** и ++подчёркнутый++'}
        />
    );
}
export function DynamicTools(): React.ReactElement {
    const [isFull, setFull] = useState(false);
    return (
        <>
            <button type="button" onClick={() => setFull(!isFull)}>
                Переключить инструменты
            </button>
            <TextEditor
                tools={isFull ? ALL_TOOLS : ['bold', 'italic']}
                className={isFull ? 'text-editor-full' : 'text-editor-minimal'}
                aria-label="Динамический набор"
                defaultValue={'# Заголовок\n\n**Текст**'}
            />
        </>
    );
}
export function States(): React.ReactElement {
    return (
        <>
            <TextEditor isReadOnly aria-label="Только чтение" defaultValue="**Можно выделять и копировать**" />
            <TextEditor isDisabled aria-label="Отключено" defaultValue="++Отключённое поле++" />
        </>
    );
}
export function LimitedPaste(): React.ReactElement {
    return (
        <>
            <p>
                Вставьте HTML или Markdown с заголовками, списками и жирным/курсивным текстом. Сохранится только курсив.
            </p>
            <TextEditor
                tools={['italic']}
                aria-label="Вставка с ограничениями"
                defaultValue="**Сохранённое жирное оформление остаётся**"
            />
        </>
    );
}
export function Notifications(): React.ReactElement {
    const [value, setValue] = useState('');
    const [debounced, setDebounced] = useState('');
    const [throttled, setThrottled] = useState('');
    const [debounceCount, setDebounceCount] = useState(0);
    const [throttleCount, setThrottleCount] = useState(0);
    return (
        <>
            <TextEditor
                value={value}
                onChange={setValue}
                aria-label="Уведомления"
                tools={ALL_TOOLS}
                onDebouncedChange={next => {
                    setDebounced(next);
                    setDebounceCount(count => count + 1);
                }}
                onThrottledChange={next => {
                    setThrottled(next);
                    setThrottleCount(count => count + 1);
                }}
            />
            <pre>Сразу: {value}</pre>
            <pre>
                Debounce ({debounceCount}): {debounced}
            </pre>
            <pre>
                Throttle ({throttleCount}): {throttled}
            </pre>
        </>
    );
}
export function AutoHeight(): React.ReactElement {
    return (
        <>
            <p>
                Введите несколько абзацев, заголовков и списков. Максимум — 240px; затем прокручивается область ввода.
            </p>
            <TextEditor
                tools={ALL_TOOLS}
                aria-label="Автовысота"
                withAutoHeight
                style={{ minHeight: 100, maxHeight: 240 }}
            />
        </>
    );
}
export function NativeForm(): React.ReactElement {
    const [submitted, setSubmitted] = useState('');
    return (
        <form
            onSubmit={event => {
                event.preventDefault();
                setSubmitted(String(new FormData(event.currentTarget).get('body')));
            }}
        >
            <TextEditor name="body" defaultValue="**Начальный текст**" aria-label="Содержимое формы" withAutoHeight />
            <button type="submit">Отправить</button>
            <button type="reset">Сбросить</button>
            <pre>{submitted}</pre>
        </form>
    );
}

export function Growing(): React.ReactElement {
    return <TextEditor tools={ALL_TOOLS} aria-label="Рост по содержимому" withAutoHeight style={{ minHeight: 100 }} />;
}
export function Debounce(): React.ReactElement {
    const [value, setValue] = useState('');
    const [saved, setSaved] = useState('');
    return (
        <>
            <TextEditor value={value} onChange={setValue} onDebouncedChange={setSaved} aria-label="Debounce" />
            <pre>Сразу: {value}</pre>
            <pre>После паузы: {saved}</pre>
        </>
    );
}
export function Throttle(): React.ReactElement {
    const [value, setValue] = useState('');
    const [saved, setSaved] = useState('');
    return (
        <>
            <TextEditor value={value} onChange={setValue} onThrottledChange={setSaved} aria-label="Throttle" />
            <pre>Сразу: {value}</pre>
            <pre>По интервалу: {saved}</pre>
        </>
    );
}
