# Proposal

## Why

Компоненты, созданные `createView` и `createFlex`, рендерят HTML-элемент, но сейчас не принимают `ref`. Потребителям нужно получать ссылку на этот DOM-узел для фокуса, измерений и интеграции с формами без доступа к внутреннему компоненту или фабричному объекту.

## What Changes

-   Добавить поддержку object и callback refs для компонентов, возвращаемых `createView` и `createFlex`.
-   Направлять ref на фактически отрендеренный HTML-элемент, включая тег, заданный через `as`; Flex передаёт ref через созданный View.
-   Типизировать ref как `HTMLElement`, сохраняя React 17 и текущую типизацию `as` без перехода к полиморфным tag-specific props.
-   Документировать DOM-ref и добавить runtime/type-тесты для обоих фабричных компонентов.

## Capabilities

### New Capabilities

### Modified Capabilities

-   `configurable-layout`: созданные View и Flex принимают ref на итоговый DOM-элемент.

## Impact

-   Типы, реализации, публичные README и истории `components/view` и `components/flex`.
-   Новый контракт не добавляет runtime-зависимостей; ref не предоставляет API внутреннего компонента или конфигурации фабрики.
-   Changeset для пакетов `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`.
