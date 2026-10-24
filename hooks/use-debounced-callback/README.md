# `@byndyusoft-ui/use-debounced-callback`

React-хук для вызова функции после паузы с последними аргументами и актуальным обработчиком.

## Установка

```sh
npm install @byndyusoft-ui/use-debounced-callback
```

## Использование

```tsx
import React, { useState } from 'react';
import useDebouncedCallback from '@byndyusoft-ui/use-debounced-callback';

const Example = (): JSX.Element => {
    const [value, setValue] = useState('');
    const [savedValue, setSavedValue] = useState('');
    const save = useDebouncedCallback(setSavedValue, 500);

    return (
        <div>
            <label>
                Текст
                <input
                    value={value}
                    onChange={event => {
                        const nextValue = event.target.value;
                        setValue(nextValue);
                        save(nextValue);
                    }}
                />
            </label>
            <p>Сохранённое значение: {savedValue}</p>
            <button type="button" onClick={save.flush}>
                Сохранить сейчас
            </button>
            <button type="button" onClick={save.cancel}>
                Отменить сохранение
            </button>
        </div>
    );
};
```

## Параметры и результат

`useDebouncedCallback(callback, delay)` возвращает вызываемую функцию с методами `cancel()` и `flush()`. Типы аргументов выводятся из `callback`, включая необязательные и остальные аргументы. Хук доступен как экспорт по умолчанию и именованный экспорт; тип результата описан в `IDebouncedCallback`.

-   Каждый вызов заменяет ожидающие аргументы и перезапускает таймер.
-   Обработчик выполняется один раз после полной паузы. Его возвращаемое значение не используется.
-   Замена обработчика использует актуальную функцию без перезапуска таймера.
-   Изменение `delay` сохраняет срок текущего таймера. Следующий вызов использует новую задержку.
-   `delay` обязателен и должен быть конечным неотрицательным числом миллисекунд. Задержка `0` остаётся асинхронной.
-   `cancel()` очищает таймер и ожидающие аргументы. Последующий `flush()` ничего не вызывает.
-   `flush()` немедленно выполняет ожидающий обработчик один раз и отменяет его таймер. Если ожидания нет, ничего не делает.
-   При размонтировании ожидание отменяется. Автоматического вызова обработчика нет.

Аргументы сохраняются по ссылке. При передаче React-события `event.target.value` отражает текущее значение DOM в момент вызова; после завершения синхронного обработчика `event.currentTarget` становится `null`. Чтобы сохранить значение именно на момент ввода, передайте скопированную строку.

## Выполнение при размонтировании

Компонент, которому нужен последний ожидающий вызов, может выполнить `flush()` в layout-очистке, до пассивной отмены внутри хука:

```tsx
const save = useDebouncedCallback(onSave, delay);
useLayoutEffect(() => save.flush, [save.flush]);
```

При серверном рендере используйте изоморфный layout-эффект, например `@byndyusoft-ui/use-isomorphic-layout-effect`.
