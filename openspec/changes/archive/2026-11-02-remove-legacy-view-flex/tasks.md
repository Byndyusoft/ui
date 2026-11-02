# Tasks

## 1. Подготовка: вынос переиспользуемого (пакет `@byndyusoft-ui/flex`)

- [x] 1.1 Перенести модификатор-хелперы и `blockClassName` из `Flex.tsx` в новый `flexModifiers.ts`, переключить импорты `createFlex.tsx` на него; проверка: `npm test -- components/flex/src` зелёный без изменений поведения
- [x] 1.2 Очистить `Flex.types.ts` от `IFlexProps` и импорта `TSpacingUnit`, оставив типы и константы раскладки; проверка: typecheck `npm test -- components/flex/src` без ошибок

## 2. Миграция внутреннего потребителя (пакет `@byndyusoft-ui/modals-provider`)

- [x] 2.1 Перевести `ModalsProvider.stories.tsx` на `createView`/`createFlex` с сеткой, воспроизводящей токены `su025`/`su100`/`su300`; при необходимости объявить зависимости в `package.json`; проверка: история рендерится в `npm start`, lint пакета зелёный

## 3. Удаление legacy из `@byndyusoft-ui/flex`

- [x] 3.1 Удалить `Flex.tsx`, `Flex.scss`, `FlexStories.module.css`, `Flex.stories.tsx`; очистить `src/index.ts` (убрать default-экспорт) и `package.json` (убрать `@byndyusoft-ui/css-utilities`); проверка: `npm test -- components/flex/src` и сборка пакета зелёные

## 4. Удаление legacy из `@byndyusoft-ui/view`

- [x] 4.1 Удалить `View.tsx`, `View.types.ts`, `View.tests.tsx`, `View.stories.tsx`, `View.docs.mdx`; очистить `src/index.ts` (убрать default-экспорт, `sanitizeMagicUnit`, `TSpacingUnit`, `IViewProps`) и `package.json` (убрать `@byndyusoft-ui/css-utilities`); проверка: `npm test -- components/view/src` и сборка пакета зелёные

## 5. Удаление `@byndyusoft-ui/css-utilities`

- [x] 5.1 Удалить каталог `styles/css-utilities`; grep по репозиторию (включая конфиги и `.storybook`) — ссылок не осталось; проверка: `npm install` обновляет lock-файл без ошибок, workspace собирается
- [x] 5.2 Обновить README `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`: убрать разделы про сетку `su*`; проверка: в README нет упоминаний `su*`, `css-utilities`, default-импортов

## 6. Релиз и интеграционная проверка

- [x] 6.1 Добавить changeset (`major` для `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`) с описанием удалённого API и миграции на фабрики; проверка: файл в `.changeset` валиден
- [x] 6.2 Прогнать полный набор: `npm run lint:check`, `npm test`, `npm run build`, `npm run build-storybook`; проверка: все команды завершаются без ошибок (кроме известного фейла `plural` в typecheck)

## Workflow follow-up

- Архивировать change после ревью (`openspec-archive-change`).
- Проверить результат архивации: требование «Совместимость с существующим API» удалено из основной спеки `configurable-layout`.
