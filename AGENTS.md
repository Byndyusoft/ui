# AGENTS.md

## Monorepo structure

Turborepo + npm workspaces. Each component, hook, service, and style package is a separate npm package under `@byndyusoft-ui/` scope.

| Directory      | Purpose                                                       | Build tool                                |
| -------------- | ------------------------------------------------------------- | ----------------------------------------- |
| `components/*` | React UI components                                           | Rollup (`rollup --config`)                |
| `hooks/*`      | React hooks                                                   | tsc (`tsc --project tsconfig.build.json`) |
| `packages/*`   | Shared types (`@byndyusoft-ui/types`)                         | tsc                                       |
| `services/*`   | Service packages (e.g. local-storage)                         | tsc                                       |
| `styles/*`     | CSS/style utilities (reset-css, keyframes-css, css-utilities) | Rollup                                    |

Package entry point is always `src/index.ts`, built output goes to `dist/`.

## Commands

```bash
npm install                # install deps
npx postinstall            # init husky git hooks (also runs automatically on npm install)
npm run build              # clean + build all packages via turbo (must run after npm install)
npm start                  # storybook dev server on localhost:6009
npm test                   # vitest run with typecheck (all workspaces)
npm run test:watch         # vitest watch with typecheck
npm run lint:check         # eslint + stylelint + prettier check (all packages)
npm run lint:fix           # eslint + stylelint + prettier fix (all packages)
npm run prettier:check     # prettier check only
npm run prettier:fix       # prettier fix only
npm run eslint:check       # eslint only
npm run eslint:fix         # eslint fix only
npm run stylelint:check   # stylelint only
npm run stylelint:fix     # stylelint fix only
npm run set-changes        # interactive changeset creation (changeset)
npm run update-packages-versions  # apply changesets (bump versions + changelogs)
npm run publish            # changeset publish to npm
```

### Run a single package's tests

```bash
npm test -w <package-name>
# Example: npm test -w @byndyusoft-ui/use-timeout
```

The `<package-name>` is the npm `name` field from the package's `package.json`.

### CI order

lint:check → test → build → build-storybook

## Creating new entities

Use hygen templates:

```bash
npx hygen create component   # scaffolds a new component under components/
npx hygen create hook         # scaffolds a new hook under hooks/
```

Generated packages include `package.json`, `tsconfig.json`, `src/` with boilerplate, and a `rollup.config.mjs` (components) or `tsconfig.build.json` (hooks).

## Testing

-   Vitest with `globals: true` and `jsdom` environment
-   Test files use `*.tests.ts(x)` or `*.test.ts(x)` or `*.spec.ts(x)` patterns
-   Type-check test files use `*.tests-d.ts` pattern (configured in root `vitest.config.mjs`)
-   Setup: `setupTests.ts` (imports `@testing-library/jest-dom` and `vitest-localstorage-mock`)
-   Packages with local `vitest.config.mjs` use `defineProject` + `mergeConfig` from root config

## Style & formatting

-   Prettier: 4-space indent, single quotes, no trailing commas, 120 char width (2-space for JSON, double quotes for SCSS/CSS)
-   ESLint: `@byndyusoft/eslint-config/typescript` + `typescript-style-frontend` + `react` + `react-testing` presets
-   Stylelint: `@byndyusoft/stylelint-config` with SCSS extensions, `color-named` rule disabled
-   Commit messages: conventional commits (enforced by `@commitlint/config-conventional`)
-   Pre-commit hook: lint-staged runs prettier on staged files

## Publishing & releases

-   Uses Changesets: `npm run set-changes` → `npm run update-packages-versions` → `npm run publish`
-   Changesets config: `baseBranch: "master"`, `access: "public"`, `updateInternalDependencies: "patch"`
-   Packages are published to npm under `@byndyusoft-ui/` scope

## Key quirks

-   Root `lint-staged.config.js` has a typo: matches `{ts,tsx,js,jsx,json,css,scss,md}` without glob prefix — uses `prettier` command (not `prettier --write`), meaning it only checks, not fixes, on pre-commit
-   React 17 peer dependency (not React 18)
-   Node 20 required (enforced in CI and Docker build)
-   Components use CSS Modules for stories (`*.module.css`) alongside SCSS for component styles (`*.scss`)
-   Storybook runs on port **6009** (not the default 6006)
-   ESLint config path in workspace packages references `../../eslint.config.js` — shared root config
-   `eslint.config.js` overrides relax rules for test/story files (disables `no-magic-numbers`, `react/button-has-type`, `react/forbid-dom-props`, warns on `explicit-module-boundary-types`)
# Инструкции для работы с репозиторием

## Назначение и структура

Byndyusoft UI — монорепозиторий публикуемых React-компонентов, хуков, типов и стилей.
Каждая сущность — отдельный npm workspace с именем `@byndyusoft-ui/<имя>`.

-   `components/*` — React-компоненты; сборка Rollup через `rollup.base.config.mjs`.
-   `hooks/*` — React-хуки; обычно сборка TypeScript через `tsconfig.build.json`.
-   `services/local-storage` — сервис работы с localStorage; сборка TypeScript.
-   `packages/types` — общие TypeScript-типы и тесты типов.
-   `styles/css-utilities` — SCSS-утилиты, собираемые Sass в `dist/index.css`.
-   `styles/reset-css`, `styles/keyframes-css` — пакеты исходного CSS.
-   `.storybook` — общий Storybook; истории и MDX лежат рядом с исходниками пакетов.
-   `.templates/create` — шаблоны Hygen для компонентов и хуков.
-   `.changeset` — настройки Changesets и описания изменений для релизов.
-   `openspec` — конфигурация, спецификации и изменения OpenSpec.
-   `.github/workflows` — проверки CI и чек-листа PR.
-   `.helm`, `deploy`, `nginx`, `Dockerfile`, `Makefile`, `Jenkinsfile` — инфраструктура публикации Storybook.

## Скиллы репозитория

Общие для Codex и OpenCode скиллы хранятся в `.agents/skills/<имя>/SKILL.md`.
Оба инструмента обнаруживают этот каталог; отдельные копии в `.opencode/skills` не нужны.
Подключай скиллы по области задачи:

-   [fe-typescript](.agents/skills/fe-typescript/SKILL.md) — публичные типы, props, generic API,
    декларации и тесты типов пакетов.
-   [fe-component](.agents/skills/fe-component/SKILL.md) — пакеты компонентов, DOM-поведение,
    ref, стили, тесты и Storybook.
-   [fe-hook](.agents/skills/fe-hook/SKILL.md) — пакеты хуков, состояние, callback,
    подписки, таймеры и SSR.
-   [fe-naming](.agents/skills/fe-naming/SKILL.md) — имена переменных, параметров, props,
    типов, файлов и сущностей.

## Перед изменениями

1. Прочитай `package.json`, README, конфигурацию сборки, исходники и тесты целевого пакета.
2. Проверь рабочее дерево и сохрани существующие изменения пользователя.
3. Найди потребителей изменяемого API и зависимости между workspace-пакетами.
4. Выбирай команды по текущим `package.json` и конфигурациям. README и шаблоны местами устарели.
5. Ограничивай изменения задачей; исправление общей конфигурации или миграция всех пакетов — отдельная работа.

## Окружение и команды

Используй npm и корневой `package-lock.json`. В `package.json` указан `npm@10.2.4`, в CI — Node.js 20.
Установка из lock-файла: `npm ci`; корневой `postinstall` устанавливает Husky.
Для намеренного изменения зависимостей используй npm и обновляй корневой lock-файл вместе с манифестами.

Все команды ниже запускаются из корня репозитория:

| Задача                                           | Команда                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| Все тесты, включая тесты типов                   | `npm test`                                                                |
| Тесты одного пакета, пример                      | `npm test -- hooks/use-debounced-callback/src`                            |
| Тесты в режиме наблюдения                        | `npm run test:watch`                                                      |
| Общие проверки линтерами                         | `npm run lint:check`                                                      |
| Линтеры одного workspace, пример                 | `npm run lint:check --workspace=@byndyusoft-ui/text-area`                 |
| Проверка форматирования workspace, пример        | `npm run prettier:check --workspace=@byndyusoft-ui/text-area`             |
| Форматирование конкретного файла                 | `npx --no-install prettier --write <путь-к-файлу>`                        |
| Сборка всех пакетов с предварительной очисткой   | `npm run build`                                                           |
| Сборка пакета вместе с его зависимостями, пример | `npx --no-install turbo run build --filter='@byndyusoft-ui/text-area...'` |
| Сборка одного workspace без сборки зависимостей  | `npm run build --workspace=@byndyusoft-ui/text-area`                      |
| Запуск Storybook на порту 6009                   | `npm start`                                                               |
| Сборка Storybook в `storybook-static`            | `npm run build-storybook`                                                 |
| Создание changeset                               | `npm run set-changes`                                                     |

Особенности команд:

-   `npm run build` вызывает `clean`. Многие пакетные `clean` удаляют не только `dist` и `.turbo`,
    но и локальные `node_modules` и `package-lock.json` внутри пакета. Для локальной проверки сборки
    используй фильтр Turborepo, если общая очистка не нужна.
-   Зависимости workspace обычно разрешаются через `dist`, поэтому перед тестами или Storybook
    может потребоваться сборка зависимостей. Turborepo учитывает порядок через `dependsOn: ["^build"]`.
-   Не каждый пакет имеет `test`, `lint:check` или `prettier:check`. Например, у некоторых хуков и
    `services/local-storage` есть только `lint`; у `packages/types` нет скриптов линтинга.
    Проверяй доступные скрипты. Общий `lint:check` охватывает пакеты, где этот скрипт определён.
-   Для выборочных тестов используй фильтр пути через корневой `npm test`.
    Корневой Vitest не объявляет `test.projects`; наличие пакетного `vitest.config.mjs`
    само по себе не делает пакет именованным проектом для `--project`.
-   Актуальные имена команд: `lint:check`, `prettier:fix`, `build-storybook`.
    Корневых `lint`, `prettier:write`, `build:storybook` нет, хотя они упомянуты в документации.

## Код и публичный API

-   Сохраняй совместимость с React 17: корневые зависимости и типы относятся к этой версии,
    многие пакеты объявляют `react >=17`. Не вводи API более новых версий без отдельной задачи.
-   TypeScript работает в `strict`-режиме с `jsx: react`; следуй стилю соседних файлов.
-   Каталоги пакетов именуются в kebab-case, компоненты — PascalCase, хуки — `useCamelCase`.
    Публичные типы часто имеют префиксы `I` и `T` и лежат в `*.types.ts`.
-   Публичная точка входа — `src/index.ts`. Сохраняй существующие именованные экспорты,
    экспорты по умолчанию и экспорты типов при изменении реализации.
-   Между пакетами используй публичные импорты `@byndyusoft-ui/...`, а не относительные пути в чужой `src`.
    Новые межпакетные зависимости объявляй в `package.json` соответствующего workspace.
-   Общие типы ищи в `@byndyusoft-ui/types`, повторяющуюся логику — в существующих хуках и сервисах.
-   Для DOM-компонентов сохраняй корректные нативные props, передачу `ref`, события и доступность.
    Внутренние props компонента не должны попадать в DOM.
-   Для хуков учитывай актуальность callback, повторный рендер, смену подписок и очистку при размонтировании.
    Для работы с DOM проверяй SSR и отсутствие браузерных API; ориентируйся на
    `use-isomorphic-layout-effect` и существующие SSR-тесты.
-   Не унифицируй формат модулей попутно: компоненты собираются в ESM, часть хуков и localStorage — в CommonJS.
    Проверяй `tsconfig.json`, `tsconfig.build.json` и пакетный Rollup-конфиг.
-   Тесты, истории, MDX и вспомогательные файлы тестов должны исключаться из публикуемой сборки.
    При добавлении файлов проверь исключения целевого пакета, в том числе для `*.tests-d.ts`.
-   Редактируй исходники; `dist`, `lib`, `storybook-static`, `.turbo` и `coverage` — генерируемые артефакты.

## Форматирование и тесты

Prettier задаёт отступ в 4 пробела, одинарные кавычки, отсутствие завершающих запятых,
ширину строки 120; JSON форматируется с отступом в 2 пробела.
ESLint и Stylelint используют конфигурации Byndyusoft. Форматируй только затронутые файлы,
чтобы не создавать посторонние изменения.

Тестовый раннер — Vitest 3. Общий конфиг `vitest.config.mjs` включает globals и jsdom;
`setupTests.ts` подключает jest-dom и mock localStorage.

-   Runtime-тесты обычно называются `*.tests.ts` или `*.tests.tsx` и лежат рядом с реализацией
    либо в `src/__tests__`. Также поддерживаются суффиксы `.test` и `.spec`.
-   Тесты типов называются `*.tests-d.ts`, используют `expectTypeOf` и запускаются через `--typecheck`
    в корневом `npm test`. Проверяй публичную точку входа, если меняется API или вывод типов.
-   Для компонентов используй `@testing-library/react`, для хуков — `@testing-library/react-hooks`,
    как в существующих тестах. Используй `vi` для mock, spy и таймеров.
-   Для таймеров используй fake timers и восстанавливай реальные таймеры после теста.
    Восстанавливай mock и подменённые глобальные объекты, чтобы тесты не влияли друг на друга.
-   SSR-тесты используют `// @vitest-environment node` и `renderToString` из `react-dom/server`.
-   Добавляй проверки изменённого поведения и регрессий; для подписок и таймеров проверяй очистку,
    для компонентов — события, props и ref, когда они затронуты.

## Новые пакеты и документация

-   Для новой сущности ориентируйся на актуальный соседний пакет сходного назначения.
    Hygen поддерживает `npx hygen create component` и `npx hygen create hook`, но его шаблоны
    всё ещё содержат Jest-команды и `rollup.config.js`. Приводи результат к текущему Vitest
    и используемому формату `rollup.config.mjs`.
-   У нового пакета должны быть манифест, точка входа, конфигурация сборки, README и необходимые тесты.
    Для демонстрируемого поведения добавляй истории и документацию Storybook.
-   Storybook подхватывает `src/**/*.stories.*` и `src/**/*.docs.mdx` из компонентов и хуков,
    а также истории и MDX из `styles`. Старые `*.stories.mdx` не входят в текущие glob-шаблоны.
-   Для изменений публичного поведения обновляй README и соответствующие истории/MDX.
    В `.storybook/main.ts` есть временные aliases на исходники отдельных workspace-пакетов;
    учитывай их при проверке импортов и сборки.

## Проверки перед завершением

-   Для изменений кода запускай тесты затронутых пакетов, доступные линтеры и сборку с зависимостями.
    Проверяй потребителей, если меняется общий хук, тип или публичный API.
-   Для изменений UI и историй проверяй Storybook. При широких изменениях ориентируйся на набор CI:
    `npm run lint:check`, `npm test`, `npm run build`, `npm run build-storybook`.
-   Для правок только документации достаточно проверки форматирования и соответствия ссылок/команд.
-   Если проверка падает из-за существующей проблемы, укажи команду, причину и влияние на результат.
    Не скрывай ошибку отключением проверки и не исправляй посторонние пакеты без необходимости.
-   В итоговом сообщении перечисли изменения, проведённые проверки и существенные ограничения.

## Changesets, Git и OpenSpec

-   Для изменений публикуемых пакетов добавляй changeset с именами пакетов, типом версии
    (`patch`, `minor`, `major`) и понятным описанием. Изменение только корневых инструкций
    не требует повышения версии пакетов.
-   `npm run update-packages-versions` и `npm run publish` относятся к релизному процессу;
    запускай их только в рамках задачи на выпуск версии.
-   Changesets использует `master` как `baseBranch`. README также содержит старые указания
    про `next`; выбирай базу ветки по задаче и фактическому состоянию Git.
-   Сообщения коммитов проверяются Conventional Commits. При подготовке PR используй
    `.github/pull_request_template.md`; отмечай выполненные проверки достоверно,
    а неприменимые пункты поясняй. CI чек-листа отклоняет PR с оставшимися `- [ ]`.
-   Если задача использует OpenSpec, работай с соответствующим изменением в `openspec/changes`
    и навыками `.agents/skills/openspec-*`. Конфигурация использует схему `spec-driven`.
    Для обычной локальной правки наличие OpenSpec само по себе не требует создания proposal.
