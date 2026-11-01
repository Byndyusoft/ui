# `@byndyusoft-ui/use-resize-observer`

React-хук для наблюдения за размерами одного или нескольких элементов через один нативный `ResizeObserver`.

## Установка

```sh
npm install @byndyusoft-ui/use-resize-observer
```

## Использование

```tsx
import React, { useRef, useState } from 'react';
import useResizeObserver from '@byndyusoft-ui/use-resize-observer';

const Example = (): JSX.Element => {
    const firstRef = useRef<HTMLDivElement>(null);
    const secondRef = useRef<HTMLDivElement>(null);
    const [lastBatchSize, setLastBatchSize] = useState(0);

    useResizeObserver([firstRef, secondRef], entries => {
        setLastBatchSize(entries.length);

        entries.forEach(entry => {
            console.log(entry.target, entry.contentRect.width, entry.contentRect.height);
        });
    });

    return (
        <div>
            <div ref={firstRef}>Первый элемент</div>
            <div ref={secondRef}>Второй элемент</div>
            <p>Изменившихся элементов в последнем пакете: {lastBatchSize}</p>
        </div>
    );
};
```

Передавайте объектные refs из `useRef` или `createRef`. Хук читает `ref.current` внутри layout-эффекта после обновления DOM, поэтому наблюдение начинается при первом монтировании без дополнительного состояния для элементов.

Для одного элемента передайте массив из одного ref: `useResizeObserver([firstRef], onResize)`. Пустой массив отключает наблюдение.

## Параметры и результат

```ts
useResizeObserver(
    refs: ReadonlyArray<RefObject<Element | null>>,
    onResize: (entries: Array<ResizeObserverEntry>) => void
): void;
```

Хук доступен как экспорт по умолчанию и именованный экспорт. Типы `TResizeObserverRefs` и `TResizeObserverCallback` также экспортируются.

-   Один observer подписывается на все уникальные элементы в нативном режиме `content-box`.
-   Refs с `current === null` игнорируются. Повторяющиеся refs и разные refs на один элемент не создают повторных подписок. Пустой массив удаляет все подписки.
-   Добавленные элементы подписываются, удалённые отписываются. Новый массив с прежним составом и изменение порядка не повторяют подписки.
-   Обработчик получает пакет нативных записей об изменившихся элементах. Для определения элемента используется `entry.target`. Полный набор размеров всех наблюдаемых элементов не собирается.
-   Замена обработчика использует актуальную функцию без пересоздания observer.
-   В браузере обработчик обновляется, а подписки создаются и изменяются в layout-эффектах до отрисовки. При размонтировании observer отключается в layout-очистке.
-   Ожидающие записи удалённых элементов игнорируются. При размонтировании observer отключается.
-   При серверном рендере хук не обращается к DOM. Если `ResizeObserver` недоступен, подписки и вызовы обработчика отсутствуют.

После каждого обновления компонента хук сравнивает текущие DOM-элементы, даже если массив и объекты refs остались прежними. Так отслеживаются появление, замена и удаление элементов. Изменение `ref.current` само по себе не запускает рендер: если его меняет дочерний компонент без обновления владельца хука, для синхронизации нужен рендер владельца. Функции callback-ref и сами DOM-элементы в качестве аргумента не принимаются.

Для эффектов используется `@byndyusoft-ui/use-isomorphic-layout-effect`: в браузере он выбирает `useLayoutEffect`, на сервере — `useEffect`. Коллбек observer вызывается браузером при доставке записей; создание подписки не вызывает его синхронно. Если размер нужен до первой отрисовки, выполните отдельное измерение в layout-эффекте потребителя.

Фильтрация изменений только ширины, вычисления, объединение измерений через `requestAnimationFrame` и резервные подписки, например на изменение размера окна, выполняются потребителем хука.
