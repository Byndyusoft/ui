# Tasks

## 1. API и нормализация spacing-пропсов View

- [x] 1.1 Согласовать ссылки View с текущими именами `buildCss` и `registerStyles`, добавить типизированные короткие aliases для всех margin/padding props и обновить mapping префиксов; проверить тесты View и допустимые/недопустимые токены в `types.tests-d.ts`.
- [x] 1.2 Нормализовать полные и короткие записи по порядку ключей итогового props-объекта и вычислять эффективные стороны с приоритетом общего, затем осевого, затем физического prop; проверить оба порядка aliases, `undefined` и конфликты сторон тестами `createView.tests.tsx`.
- [x] 1.3 Формировать минимальный непересекающийся набор классов по точному совпадению токенов; проверить общий класс для четырёх сторон, осевые классы, одиночные стороны, aliases с одинаковыми множителями и отсутствие spacing props в DOM.
- [x] 1.4 Обновить Storybook и README View с короткими aliases, правилами приоритета и примерами compact-классов; проверить форматирование workspace.

## 2. Пропсы и документация Flex

- [x] 2.1 Проверить, что `ICreatedFlexProps` наследует типы aliases и что Flex передаёт их в View без попадания в DOM; покрыть корректные и недопустимые значения type/runtime тестами Flex.
- [x] 2.2 Обновить Storybook и README Flex примерами коротких отступов; проверить форматирование workspace.

## 3. Релизная и интеграционная проверка

- [x] 3.1 Добавить changesets `minor` для `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`; проверить имена пакетов и версии в frontmatter.
- [x] 3.2 Запустить тесты и линтеры обоих workspace, сборку `npx --no-install turbo run build --filter='@byndyusoft-ui/flex...'` и Storybook; проверить декларации пакетов и записать причину, если Storybook блокируется существующей ошибкой вне View/Flex. Storybook build блокируется несвязанной ошибкой: TextArea импортирует default из `@byndyusoft-ui/use-isomorphic-layout-effect`, который не экспортируется.

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- Verify the archived result.
