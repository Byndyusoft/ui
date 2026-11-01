# `@byndyusoft-ui/use-throttled-value`

React-хук для состояния с ограниченной частотой обновлений. API построен по образцу `useState` и `use-debounced-value`; управление интервалом выполняет `@byndyusoft-ui/use-throttled-callback`.

## Установка

```sh
npm install @byndyusoft-ui/use-throttled-value
```

## Использование

```tsx
import React, { useState } from 'react';
import useThrottledValue from '@byndyusoft-ui/use-throttled-value';

const Example = (): JSX.Element => {
    const [value, setValue] = useState('');
    const [savedValue, setSavedValue] = useThrottledValue('', 500);

    return (
        <div>
            <label>
                Текст
                <input
                    value={value}
                    onChange={event => {
                        const nextValue = event.target.value;

                        setValue(nextValue);
                        setSavedValue(nextValue);
                    }}
                />
            </label>
            <p>Сохранённое значение: {savedValue}</p>
            <button type="button" onClick={setSavedValue.flush}>
                Применить сейчас
            </button>
            <button type="button" onClick={setSavedValue.cancel}>
                Отменить ожидание
            </button>
        </div>
    );
};
```

## Параметры и результат

```ts
useThrottledValue<T>(
    initialValue: T | (() => T),
    delay: number,
    options?: IThrottledCallbackOptions
): [T, IThrottledCallback<[SetStateAction<T>]>];
```

-   Начальное состояние или ленивый инициализатор работают как в `useState`. Состояние доступно сразу, без таймера. Изменение начального аргумента при последующих рендерах не меняет состояние.
-   Setter принимает новое значение или функцию `(previousValue: T) => T`.
-   По умолчанию первый вызов setter применяется сразу, а последнее обновление в пределах интервала применяется после ожидания. После отложенного обновления следующий немедленный вызов также ограничен интервалом.
-   Ожидающие функции обновления не накапливаются: сохраняется только последняя. Она выполняется при применении обновления и получает актуальное состояние. Отброшенные функции не выполняются.
-   Объекты и массивы сохраняются по ссылке, без копирования.
-   Setter сохраняет ссылку при неизменных задержке и опциях. Обновление состояния не меняет setter. Кортеж сохраняет ссылку при неизменных состоянии и setter.
-   `delay` — обязательное конечное неотрицательное число миллисекунд. Изменение задержки не перезапускает текущий таймер и применяется к следующему ожиданию.
-   `options.leading` и `options.trailing` по умолчанию равны `true`. Их поведение и изменение во время ожидания совпадают с `use-throttled-callback`.
-   При `delay: 0` первое обновление с `leading: true` выполняется синхронно; отложенное обновление остаётся асинхронным.
-   При размонтировании ожидающее обновление отменяется. При серверном рендере возвращается начальное состояние без таймеров.

Хук доступен как экспорт по умолчанию и именованный экспорт `useThrottledValue`. Тип кортежа экспортируется как `TUseThrottledValueReturn<T>`.

## Ленивый инициализатор и функция обновления

```tsx
const [count, setCount] = useThrottledValue(() => 0, 500);

setCount(previousCount => previousCount + 1);
```

Для хранения самой функции в состоянии передавайте обёртку, как в `useState`:

```tsx
const [handler, setHandler] = useThrottledValue(() => initialHandler, 500);

setHandler(() => nextHandler);
```

## Опции и управление ожиданием

```tsx
const [value, setValue] = useThrottledValue('', 500, { leading: false });

setValue('новое значение');
setValue.flush();

setValue('отменённое значение');
setValue.cancel();
```

`leading: false` откладывает первое обновление на полный интервал. `trailing: false` отбрасывает промежуточные обновления. При отключении обоих режимов состояние не меняется и таймеры не создаются.

`flush()` немедленно применяет последнее ожидающее обновление один раз. При `leading: true` после него начинается новый ограничивающий интервал. Без ожидающего обновления `flush()` ничего не делает. `cancel()` отменяет обновление и сбрасывает ограничение; уже применённое состояние сохраняется. Ручные `flush()` и `cancel()` могут нарушать обычный минимальный интервал.
