# Tasks

## 1. Рефакторинг пакета view

- [x] 1.1 Переписать маппинг spacing-пропсов в `createView.tsx` без мутации `props` и проверить тесты `createView.tests.tsx`.
- [x] 1.2 Заменить сборку `className` через `join` на `classnames` и проверить exact-классы в тестах.
- [x] 1.3 Установить `displayName = 'View'` и проверить отображение в тестах/Storybook.
- [x] 1.4 Расширить `src/index.ts` экспортом build-утилит и проверить импорты в тестах типов.

## 2. Рефакторинг пакета flex

- [x] 2.1 Убрать дублирование `blockClassName`, импортировать из `flexModifiers.ts` и проверить `createFlex.tests.tsx`.
- [x] 2.2 Привести сборку `className` к общему подходу с `view` и проверить exact-классы.
- [x] 2.3 Установить `displayName = 'Flex'` и проверить тесты рендера.
- [x] 2.4 Расширить `src/index.ts` экспортом модификаторов и типов и проверить импорты.

## 3. Проверка и документация

- [x] 3.1 Проверить имена файлов и суффиксы тестов/типов/историй в обоих пакетах, а также исключения Rollup.
- [x] 3.2 Добавить тесты на иммутабельность пропсов и регрессию экспортов в обоих пакетах.
- [x] 3.3 Обновить README при необходимости и проверить форматирование.
- [x] 3.4 Запустить `npm test -- components/view/src`, `npm test -- components/flex/src`, линтеры и сборку пакетов с зависимостями.
- [x] 3.5 Добавить changeset `patch` для обоих пакетов.

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- Verify the archived result.
