# Proposal

## Why

Фабрики `createView`/`createFlex` (change `add-configurable-layout-factories`) полностью замещают старые классовые `View`/`Flex`: новый API не зависит от них и покрывает их сценарии с типизируемой проектной сеткой вместо фиксированной `su*`. Пакеты никогда не публиковались в npm, внешних потребителей нет — окно для дешёвого удаления legacy открыто. Удержание двух параллельных API удваивает документацию, Storybook и стоимость поддержки (включая пакет `css-utilities`, чья сетка продублирована в четырёх местах и уже давала рассинхроны).

## What Changes

- **BREAKING**: удалить старые `View` и `Flex` (default-экспорты), типы `TSpacingUnit`, `IViewProps`, `IViewSpacings`, `IFlexProps` и экспорт `sanitizeMagicUnit` из `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`.
- **BREAKING**: удалить классовую схему `su*` и связанные стили: `Flex.scss`, `FlexStories.module.css`, зависимость на `@byndyusoft-ui/css-utilities` в обоих пакетах.
- **BREAKING**: удалить пакет `styles/css-utilities` целиком (никогда не публиковался, импортируется только удаляемыми компонентами).
- Сохранить переиспользуемое новым API: модификатор-хелперы и типы раскладки из `Flex.tsx`/`Flex.types.ts` вынести в нейтральный модуль без привязки к старому компоненту.
- Мигрировать историю `ModalsProvider.stories.tsx` (единственный внутренний потребитель) на `createFlex`.
- Обновить README обоих пакетов: убрать разделы про сетку `su*`.
- Changesets: `major` для `@byndyusoft-ui/view` и `@byndyusoft-ui/flex`.

## Capabilities

### New Capabilities

(пусто)

### Modified Capabilities

- `configurable-layout`: снимается требование «Совместимость с существующим API» — legacy API удаляется, сосуществование старой и новой схем больше не гарантируется и не поддерживается.

## Impact

- `components/view`: удаление `View.tsx`, `View.types.ts`, `View.tests.tsx`, `View.stories.tsx`, `View.docs.mdx`; очистка `src/index.ts`; удаление зависимости `@byndyusoft-ui/css-utilities` из `package.json`.
- `components/flex`: удаление `Flex.tsx`, `Flex.scss`, `FlexStories.module.css`, `Flex.stories.tsx`; перенос модификатор-хелперов и типов раскладки в отдельный модуль; очистка `src/index.ts` и `package.json`.
- `components/modals-provider`: миграция историй на `createFlex`; при необходимости объявить зависимость для stories.
- `styles/css-utilities`: удаление пакета из workspace.
- Storybook: исчезают истории старых компонентов; проверка `build-storybook`.
- Обратная несовместимость принята осознанно: пакеты не опубликованы, потребителей вне репозитория нет.
