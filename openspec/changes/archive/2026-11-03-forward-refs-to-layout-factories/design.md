# Design

## Context

См. `proposal.md` — Why. `createView` и `createFlex` сейчас возвращают `FC` и реализуют рендер непосредственно в функции компонента. View выбирает host tag через `as?: keyof ReactHTML`; Flex рендерит созданный View и передаёт ему props. `ICreatedView` и `ICreatedFlex` также типизированы как `FC` и несут `config` через `Object.assign`.

Пакеты поддерживают React 17 и TypeScript 4.9. Их публичные точки входа экспортируют созданные типы, фабрики и runtime-компоненты; public component API не раскрывает никакого instance API. См. delta `configurable-layout` для нового контракта ref.

## Goals / Non-Goals

**Goals:**

-   Принимать object/callback refs у фабричных View и Flex и связывать их с тем же host element, на который применяются props и классы.
-   Сохранить существующие generic-токены конфигурации, `as`, дополнительные DOM-props, `className` и `config` на созданном компоненте.
-   Использовать только API, совместимый с React 17 и текущими декларациями типов.

**Non-Goals:**

-   Добавлять instance API фабричным компонентам или менять состав `config`.
-   Выводить точный тип DOM-элемента из значения `as` либо вводить полиморфные element-specific props.
-   Менять поведение props, классов, CSS, SSR или регистрации стилей.

## Decisions

### ForwardRef на конечный HTMLElement

`createView` оборачивает созданный renderer в `React.forwardRef<HTMLElement, ICreatedViewProps<TGrid>>`, передавая полученный ref непосредственно в `createElement(as, ...)`. Ref компонента указывает на тег, выбранный через `as`, а не на внутреннюю обёртку.

Публичный `ICreatedView<TGrid>` описывается как `ForwardRefExoticComponent<ICreatedViewProps<TGrid> & RefAttributes<HTMLElement>>` с сохранённым свойством `config`. `ICreatedViewProps` остаётся props-интерфейсом без ручного `ref` и не допускает попадания ref в DOM-spread.

Альтернатива — оставить `FC` и объявить `ref` обычным prop. React 17 не передаёт специальный JSX `ref` в function component, поэтому такой вариант не соединяет JSX ref с DOM-узлом.

### Flex пересылает ref через созданный View

`createFlex` также становится `forwardRef<HTMLElement, ICreatedFlexProps<TValues>>`. Он принимает ref отдельным параметром и передаёт его созданному View вместе с собранными классами и native props. `ICreatedFlex<TValues>` использует соответствующий `ForwardRefExoticComponent`-тип и сохраняет `config`.

Альтернатива — рендерить отдельный DOM-узел в Flex. Это дублировало бы host-rendering View и могло бы разойтись по тегу, props и spacing-классам.

### Общий тип ref не выводится из `as`

Ref публично типизируется как `HTMLElement` для всех допустимых `as`. Текущий API принимает `as` отдельно от generic-параметра типов и не моделирует props конкретного HTML-тега; tag-specific ref потребовал бы отдельной миграции polymorphic props API. В React runtime ref всё равно получает фактический специализированный DOM-элемент.

Для библиотечного вызова используется `forwardRef` из React 17. `useImperativeHandle` не нужен: компонент предоставляет сам DOM-узел, а не собственный imperative API.

## Risks / Trade-offs

-   [Изменение типа созданного компонента с `FC` на forward-ref exotic component может выявить потребителей, явно аннотировавших результат как `FC`] → Сохранить совместимый JSX-вызов и generic токены, закрепить публичный тип тестами и документировать новый `ref` contract.
-   [При `as` точный тип будет `HTMLElement`, а не тип конкретного тега] → Явно закрепить это ограничение в типах и README; tag-specific polymorphic typing оставить отдельной задачей.
-   [Flex может случайно передать ref как обычный DOM-prop или потерять его при проксировании] → Деструктурировать ref аргументом `forwardRef` и проверять его на фактическом узле в runtime-тестах.

## Migration Plan

1. Перевести `createView` на forwardRef и обновить `ICreatedView`, сохранив `config` и прежние props.
2. Перевести `createFlex` на forwardRef и переслать ref через созданный View; обновить соответствующий публичный тип.
3. Дополнить runtime/type tests и README/Storybook обоих пакетов; запустить пакетные lint, tests и сборку с зависимостями.
4. Добавить minor changeset для `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`. Откат — вернуть функции фабрик и типы к `FC`; существующие вызовы без ref остаются прежними.
