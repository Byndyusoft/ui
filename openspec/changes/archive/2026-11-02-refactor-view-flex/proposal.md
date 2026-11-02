# Proposal

## Why

После перехода `View` и `Flex` на фабрики `createView`/`createFlex` реализация сохранила
внутренние недостатки: мутацию входных пропсов, дублирование констант и CSS-логики,
несогласованную сборку `className`, неинформативные `displayName` и неполные публичные
экспорты. Внешнее поведение при этом не меняется, но код сложнее поддерживать,
тестировать и расширять. Рефакторинг устранит эти недостатки без изменения API и
сгенерированного CSS.

## What Changes

- Убрать мутацию пропсов в `createView`: деструктурировать spacing-пропсы вместо
  `delete` в объекте `props`.
- Унифицировать сборку `className` в `View` и `Flex` на общем подходе и убрать
  дублирование `blockClassName` и связанных констант в Flex.
- Сделать `displayName` компонентов осмысленными и согласованными с публичным API.
- Дополнить публичные экспорты `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`
  build-утилитами, модификаторами, типами и константами без удаления существующих.
- Привести именование внутренних сущностей, файлов и суффиксов тестов/типов/историй
  к соглашениям `fe-component`, `fe-typescript` и `fe-naming`; проверить, что
  суффиксы `*.tests.*`, `*.tests-d.ts`, `*.ssr.tests.*`, `*.stories.*` корректно
  попадают под исключения сборки Rollup.
- Уточнить типы props/ref и покрыть регрессии тестами (иммутабельность пропсов,
  передача нативных атрибутов, стабильность экспортов).
- Обновить README/Storybook только при необходимости отразить уточнённый API.

## Capabilities

### New Capabilities

(нет — поведение компонентов не меняется)

### Modified Capabilities

(нет — требования `configurable-layout` сохраняются)

## Impact

- `components/view`: `createView.tsx`, `LayoutConfig.types.ts`, `buildSpacingCss.ts`,
  `layoutStylesRegistry.ts`, `src/index.ts`.
- `components/flex`: `createFlex.tsx`, `createFlex.types.ts`, `flexModifiers.ts`,
  `buildFlexCss.ts`, `src/index.ts`.
- Тесты обоих пакетов и тесты типов (`*.tests-d.ts`).
- Changeset: `patch` для `@byndyusoft-ui/view` и `@byndyusoft-ui/flex` при реализации.
- Совместимость с React 17 и существующими потребителями сохраняется.