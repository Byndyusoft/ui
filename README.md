# Byndyusoft UI Library

## Environments

-   [Test](https://storybook-test.stage.byndyusoft.com)
-   [Stage](https://storybook-preprod.stage.byndyusoft.com)
-   [Production](https://storybook.prod.byndyusoft.com)

## Development

### Installation

1. Choose main development branch - `master`
2. Install npm packages by running `npm install`
3. Initiate some tools for development by command `npx postinstall`
4. Build dependencies for packages `npm run build`
5. Launch storybook `npm start`

### [Code of conduct (see link)](./CODE_OF_CONDUCT.md)

### NPM commands

-   `build` - build production version of all entities to folder
-   `clean` - remove folder with production version of all entities
-   `lint` - check all entities files for errors by linters
-   `test` - start all entities tests
-   `postinstall` - initiate some tools for development
-   `build:storybook` - build `storybook` with all entities stories to folder
-   `prettier:check` - check all files by `prettier`
-   `prettier:write` - fix all files by `prettier`
-   `start` - start `storybook` server with all entities stories on [localhost:6009](http://localhost:6009)
-   `set-changes` - выполняет промежуточную фиксацию изменений и типа новой версии (patch/minor/major) обновленного пакета(ов) для облегчения последующей публикации
-   `update-packages-versions` - автоповышение версий в `package.json` пакетов, обновление внутренних зависимостей и генерация changelog в каждом пакете
-   `publish` - публикация обновленных пакетов в правильном порядке (сначала зависимости, потом пакеты, зависящие от них)

### Create a new entity

1. To add a new entity create a new branch `feature/new-entity-name` from branch `next`
2. By using `hygen` create a folder with files for a new entity<br>
   4.1. If you are using `hygen` at first time, you need to install (`npm install -global hygen`). [More about `hygen`](https://www.npmjs.com/package/hygen#quick-start) <br>
   4.2. To create a folder for your entity, use command `npx hygen create entity-type` (entity types: `component`, `hook`)
3. Develop new entity with tests and stories
4. Check that building production version, tests, stories and linters run without problems
5. Push your branch and create a PR on GitHub to merge it to the `next` branch

#### Npm commands provided by `hygen` entities templates

-   `build` - build production version of entity to folder
-   `clean` - remove folder with production version of entity
-   `lint` - check entity files for errors by linters
-   `test` - start tests inside entity folder

### Vitest

Vitest используется как тестовый раннер для всех пакетов, объединённых в общий workspace.

#### Vitest Workspace

Vitest Workspace позволяет писать и запускать тесты для каждого пакета изолированно, но в рамках одного общего окружения.

[Vitest Workspace docs](https://vitest.dev/guide/workspace)

There are two ways to define workspaces:

-   Inline in root `vitest.config.mts`
-   In root config with glob string and vitest.config.ts in each workspace/package. Example:

```ts
import { defineProject, mergeConfig } from 'vitest/config';
import configShared from '../../vitest.config';

/**
 * vitest.config for correct vitest workspace detection.
 * export default configShared works too.
 */
export default mergeConfig(
    configShared,
    defineProject({
        test: {
            include: ['**/*.tests.(ts|tsx)'],
            setupFiles: ['../../setupTests.ts']
        }
    })
);
```

Command for executing only one package:

`vitest run --root ../../ --project hooks"`

## Release workflow

В проекте используется Turborepo + Changesets для управления многопакетной (monorepo) React UI-библиотекой.<br/>  
Каждый компонент / хук / и т.д. — отдельный пакет.<br/>
Для согласованного версионирования и автоматической публикации используется `changesets`.

---

### Роль Turborepo

Turborepo — это инструмент для управления монорепозиторием и оптимизации сборки.
Он помогает координировать работу нескольких пакетов (компонентов, хуков и утилит) внутри одного репозитория, ускоряя сборку и упрощая разработку.

[Документация Turborepo](https://turborepo.com/docs)

---

### Роль Changesets

-   Changesets упрощает семантическое версионирование внутри монорепо.
-   Разработчик описывает изменения через `npx changeset` (создаёт небольшую markdown «записку»), указывая какие пакеты изменились, тип версии (patch/minor/major) и описание изменений.
-   При применении `npx changeset version` автоматически повышаются версии в `package.json`, обновляются внутренние зависимости и генерируется changelog для каждого пакета (файлы CHANGELOG.md).
-   При выполнении `npx changeset publish` публикуются только пакеты с изменёнными версиями в правильном порядке (сначала зависимости, потом пакеты, зависящие от них).

[Документация Changesets](https://github.com/changesets/changesets)

---

### Flow

#### 1. Develop

1. Клонировать репозиторий
2. Создать ветку и вносить изменения
3. Запустить локальные проверки (lint, test, build)
4. Создать changeset для изменённых пакетов
    - Запустить `npm run set-changes` и выбрать пакеты, тип изменения (patch/minor/major) и добавить краткое описание
5. Коммит и push
6. Создать Pull Request

#### 2. Pull Request

1. Заполнить чек-лист из PR template (см. `.github/pull_request_template.md`)
2. CI запускает проверку lint, tests, build, checklist (см. `.github/workflows/ci.yml`)
3. Код ревьюится командой Byndyusoft Frontend разработки
4. Если всё в порядке, PR мёржится

#### 3. Release (после merge в `master`)

1. [@sadcitizen](https://github.com/sadcitizen) запускает `npm run update-packages-versions` (в workflow) и коммитит изменения версий (если есть).
2. [@sadcitizen](https://github.com/sadcitizen) выполняет `npm run build`.
3. [@sadcitizen](https://github.com/sadcitizen) выполняет `npm run publish`, который публикует обновлённые пакеты в npm (в правильном порядке).
4. [@sadcitizen](https://github.com/sadcitizen) через Byndyusoft Jenkins билдит и публикует новую версию Storybook в [production окружение](https://storybook.prod.byndyusoft.com).
5. Релиз завершён — пакеты доступны в npm и залиты на [production окружение](https://storybook.prod.byndyusoft.com).
