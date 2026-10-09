# `@byndyusoft-ui/use-debounced-value`

React-хук для состояния с отложенным обновлением. API построен по образцу `useState` и `useThrottledValue`: начальное значение и задержка на входе, состояние и setter в возвращаемом кортеже. Для управления ожиданием используется `@byndyusoft-ui/use-debounced-callback`.

## Установка

```sh
npm install @byndyusoft-ui/use-debounced-value
```

## Использование

```tsx
import React, { useState } from 'react';
import useDebouncedValue from '@byndyusoft-ui/use-debounced-value';

const Example = (): JSX.Element => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useDebouncedValue('', 500);

    return (
        <div>
            <label>
                Поиск
                <input
                    value={query}
                    onChange={event => {
                        const nextValue = event.target.value;

                        setQuery(nextValue);
                        setDebouncedQuery(nextValue);
                    }}
                />
            </label>
            <p>Значение для поиска: {debouncedQuery || '—'}</p>
        </div>
    );
};
```

Поле ввода обновляется сразу через обычное состояние, а `debouncedQuery` меняется через отложенный setter после паузы в 500 мс. Его можно использовать как зависимость эффекта, который запускает поиск.

## Параметры и результат

```ts
useDebouncedValue<T>(
    initialValue: T | (() => T),
    delay: number
): [T, IDebouncedCallback<[SetStateAction<T>]>];
```

-   `initialValue` — начальное значение или ленивый инициализатор, как в `useState`. Состояние доступно сразу, без таймера. Изменение аргумента при последующих рендерах не меняет состояние.
-   `delay` — обязательная задержка в миллисекундах, конечное неотрицательное число.
-   Каждый вызов setter заменяет ожидающее обновление и перезапускает таймер. После полной паузы применяется последнее обновление.
-   Setter принимает новое значение или функцию `(previousValue: T) => T`. Функция выполняется при применении обновления и получает актуальное состояние.
-   Ожидающие функции обновления не накапливаются: при нескольких вызовах сохраняется только последний. Например, два вызова `setValue(previous => previous + 1)` в пределах одной паузы увеличат состояние один раз.
-   Повторный рендер сам по себе не запускает и не продлевает ожидание.
-   Setter и возвращаемый кортеж сохраняют ссылку при неизменных состоянии и задержке. Обновление состояния сохраняет ссылку на setter. При изменении задержки нужно использовать setter из нового результата хука.
-   Изменение только `delay` сохраняет срок текущего таймера. Следующий вызов актуального setter использует новую задержку, как в `use-debounced-callback`.
-   Задержка `0` остаётся асинхронной.
-   Объекты и массивы сохраняются по ссылке, без копирования.
-   При размонтировании ожидающее обновление отменяется.
-   При серверном рендере возвращается начальное состояние без обращения к DOM и без таймеров.

Хук доступен как экспорт по умолчанию и именованный экспорт `useDebouncedValue`. Тип возвращаемого кортежа экспортируется как `TUseDebouncedValueReturn<T>`. Тип состояния выводится из начального значения или ленивого инициализатора.

## Ленивый инициализатор и функция обновления

```tsx
const [count, setCount] = useDebouncedValue(() => 0, 500);

setCount(previousCount => previousCount + 1);
```

Как и в `useState`, для хранения самой функции в состоянии передавайте обёртку:

```tsx
const [handler, setHandler] = useDebouncedValue(() => initialHandler, 500);

setHandler(() => nextHandler);
```

## Управление ожиданием

Setter сохраняет методы `use-debounced-callback`:

```tsx
const [value, setValue] = useDebouncedValue('', 500);

setValue('новое значение');
setValue.flush();

setValue('отменённое значение');
setValue.cancel();
```

`flush()` сразу применяет последнее ожидающее обновление и очищает таймер. Без ожидающего обновления он ничего не делает. `cancel()` отменяет обновление; состояние сохраняется, а последующий `flush()` ничего не применяет. После отмены можно запланировать новое обновление обычным вызовом setter.
