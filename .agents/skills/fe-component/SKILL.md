---
name: fe-component
description: Разработка пакетов React-компонентов Byndyusoft UI в components/*. Используй при добавлении или изменении компонента, его DOM-поведения, props и ref, стилей, тестов, Storybook и пакетной сборки. Для самостоятельных hook-пакетов используй fe-hook.
---

# Пакеты компонентов

Следуй корневому [AGENTS.md](../../../AGENTS.md). Для изменения типового контракта
используй [fe-typescript](../fe-typescript/SKILL.md), для выбора имён —
[fe-naming](../fe-naming/SKILL.md). Читай эти скиллы по необходимости.

## Устройство пакета

Пакет располагается в `components/<kebab-case>`, имя — `@byndyusoft-ui/<kebab-case>`.
Для нового пакета ориентируйся на актуальный компонент с похожей задачей:
[text-input](../../../components/text-input/package.json),
[text-area](../../../components/text-area/package.json) или
[portal](../../../components/portal/package.json).

Обычная структура:

```text
components/<имя>/
  package.json
  README.md
  tsconfig.json
  rollup.config.mjs
  src/
    index.ts
    Component.tsx
    Component.types.ts
    Component.tests.tsx
    Component.stories.tsx
    Component.docs.mdx
```

Истории и MDX также могут лежать в `src/__stories__`. Стили, внутренние `hooks/`,
`utilities` и тесты типов добавляй только по потребности компонента.
При создании пакета учитывай `files`/`.npmignore`, React peer dependency,
межпакетные зависимости и корневой lock-файл. Шаблоны Hygen устарели в части Jest
и расширения Rollup-конфига; не переноси их команды без адаптации.

## Реализация и поведение

-   Сохраняй совместимость с React 17 и существующий публичный API.
    `src/index.ts` — точка входа; не теряй именованные, default-экспорты и типы.
-   Для оболочки над DOM-элементом используй его нативные attributes и точный тип событий.
    Разбирай библиотечные props до передачи остальных в DOM.
    Например, `isDisabled` у поля преобразуется в нативный `disabled`.
-   Продумывай порядок spread и явных props: внутренний обработчик должен выполнять
    нужную логику и вызывать пользовательский callback согласно контракту.
    Сохраняй переданные `className`, `style`, `aria-*` и `data-*`, когда они поддерживаются.
-   Используй `forwardRef` для компонентов с публичным DOM-ref; задавай `displayName`.
    При совмещении внутренних и внешних ref учитывай callback-ref, object-ref,
    смену DOM-узла и сброс ссылки при размонтировании.
-   Для полей сохраняй controlled и uncontrolled режимы, если они доступны через props.
    Не смешивай `value` и `defaultValue` и не меняй смысл пользовательского `onChange`.
-   Поведение с таймерами и подписками выноси во внутренний хук, если это проясняет
    компонент. Повторно используемую межпакетную логику ищи среди `@byndyusoft-ui/use-*`.
    Не создавай новый публичный пакет только ради одноразовой детали реализации.
-   Для отложенных callback явно сохраняй или определяй контракт очистки: одни вызовы
    могут завершаться при unmount, другие отменяться. Не делай `flush` универсальным правилом.
-   DOM-измерения выполняй после появления элемента. Для SSR учитывай отсутствие `window`,
    `document` и observer API; ориентируйся на `use-isomorphic-layout-effect`.
-   Сохраняй семантику HTML, доступное имя, управление с клавиатуры и фокусом.
    Новые стили оформляй по подходу целевого пакета: здесь используются CSS, CSS Modules и SCSS.

## Документация и проверка

-   Vitest и `@testing-library/react` проверяют наблюдаемое поведение: события,
    передачу props/ref, controlled/uncontrolled режимы и очистку — по области изменения.
    Для DOM-зависимого поведения добавляй SSR-тест в node-окружении, когда это требуется контрактом.
-   При изменении props/ref и экспортов добавляй тесты типов по `fe-typescript`.
-   Обновляй README и Storybook. Истории должны попадать в `src/**/*.stories.tsx`,
    документация — в `src/**/*.docs.mdx`; текущий Storybook не подхватывает `*.stories.mdx`.
    Показывай значимые состояния и взаимодействия, а не все сочетания параметров.
-   Компоненты собираются Rollup с общим [rollup.base.config.mjs](../../../rollup.base.config.mjs).
    Проверяй пакетные исключения из сборки и выпуск `dist/index.js` и `dist/index.d.ts`.
-   Для примера `text-area` из корня:

```sh
npm test -- components/text-area/src
npm run lint:check --workspace=@byndyusoft-ui/text-area
npx --no-install turbo run build --filter='@byndyusoft-ui/text-area...'
npm run build-storybook
```

Подставляй фактическое имя пакета и проверяй наличие его скриптов.
Для изменения публикуемого пакета добавляй changeset; обновление версий и публикация
не относятся к обычной разработке компонента.
