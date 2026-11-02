# Design

## Context

После change `add-configurable-layout-factories` в пакетах живут два параллельных API: старые классовые `View`/`Flex` (сетка `su*`, `css-utilities`) и фабрики `createView`/`createFlex`. Проверка импортов показала: `@byndyusoft-ui/css-utilities` используется только старыми `View.tsx`/`Flex.tsx`; вне этих пакетов старый API использует единственный потребитель — `components/modals-provider/src/ModalsProvider.stories.tsx` (default-импорт `Flex`, токены `su025`/`su100`/`su300`). Новый `createFlex` переиспользует модификатор-хелперы (`getDirectionModifier` и др.) из `Flex.tsx` и типы/константы раскладки из `Flex.types.ts` — их удалять нельзя. Мотивация — см. proposal.md.

## Goals / Non-Goals

**Goals:**

- В пакетах `@byndyusoft-ui/view` и `@byndyusoft-ui/flex` остаётся один API — фабрики.
- Удалить пакет `styles/css-utilities` и классовую схему `su*` без остатка.
- Новый код (`createFlex`, типы) продолжает работать после удаления старых файлов.

**Non-Goals:**

- Изменение поведения нового API (фабрики, реестр стилей, `LayoutStyles`) — не трогаем.
- Удаление других style-пакетов (`reset-css`, `keyframes-css`) — они не связаны.
- Миграция внешних потребителей — их нет (пакеты не публиковались).

## Decisions

### 1. Переиспользуемое выносим в нейтральные модули до удаления

Порядок важен: сначала `getDirectionModifier`, `getWrapModifier`, `getAlignContentModifier`, `getAlignItemsModifier`, `getJustifyContentModifier` и `blockClassName` переезжают из `Flex.tsx` в `flexModifiers.ts`, а импорты `createFlex.tsx` переключаются на него; затем `Flex.tsx` удаляется. Типы и константы раскладки (`TFlexDirection`, `directions` и т.п.) остаются в `Flex.types.ts` — этот файл не привязан к старому компоненту, удаляются только `IFlexProps` и импорт `TSpacingUnit`.

### 2. `css-utilities` удаляется целиком, без замены

Пакет никогда не публиковался и не импортируется никем, кроме удаляемых файлов. После удаления каталога `styles/css-utilities` нужно удалить зависимости из `package.json` view и flex, обновить корневой lock-файл (`npm install`) и убедиться, что workspace-резолв (`dist/index.css`) нигде не остался в сборках.

### 3. История modals-provider мигрирует на локальную фабрику

`ModalsProvider.stories.tsx` создаёт `View`/`Flex` через фабрики прямо в файле истории с сеткой, воспроизводящей использованные токены (`{ unit: '1rem', grid: { '025': 0.25, '100': 1, '300': 3 } } as const`), — визуально история не меняется. Зависимости для историй (`@byndyusoft-ui/view`, `@byndyusoft-ui/flex`) при необходимости объявляются в `package.json` пакета (сейчас история резолвит flex через корневой node_modules без объявления).

### 4. Точки входа очищаются, имена сохраняются

`components/view/src/index.ts`: удаляются default-экспорт, `sanitizeMagicUnit`, `TSpacingUnit`, `IViewProps`; остаются `createView`, `LayoutStyles` и типы конфигурации. `components/flex/src/index.ts`: default-экспорт заменяется экспортами `createFlex` и типов. Пакеты продолжают собираться Rollup; удаление файлов не должно сломать `dist`-декларации.

## Risks / Trade-offs

- [Скрытые импортеры старого API вне `src` (истории, MDX, доки)] → полный grep по репозиторию в задачах; проверка `npm run build-storybook` в конце.
- [Остаточные ссылки на `css-utilities` в конфигах сборки или Storybook] → grep по конфигам; сборка пакетов и Storybook после удаления.
- [Lock-файл и workspace-ссылки рассинхронизируются после удаления пакета] → `npm install` для обновления lock-файла и `npm ci`-совместимая проверка сборки.
- [Потребитель читал README со старой сеткой] → разделы про `su*` удаляются из README в том же change, changeset `major` честно маркирует ломку.

## Migration Plan

Миграция внутри репозитория входит в задачи change (modals-provider stories). Внешняя миграция не требуется: пакеты не опубликованы. Откат — revert change; артефакты удаления восстанавливаются из git.
