# Конвенции при разработке ui-библиотеки

## Структура документации

1. Описание компонента или хука
2. Установка
3. Использование (с примерами кода)
4. Лицензия

[Пример документации хука](#use-hook-namereadmemd)

## Нейминг

### Именование коммитов

Именуем согласно [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary)

Структура коммита:

`<тип коммита>(область коммита): <описание>`

Типы коммитов:

`feat, fix, style, test, story, docs, refactor, chore, ci и др.`

Примеры:

-   `fix(Button): remove useless styles`
-   `feat(Anchore): add “some feature”`
-   `chore(Input): merge package.json with "master" branch`
-   `chore: update version in package.json`
-   `refactor(resetCss/Input): simplify styles`

Если изменён объект внутри компонента, к примеру. То можно использовать такую форму записи:

`fix(Dropdown/Item): change styles names`



## Компонент

### Структура компонента

```
component-name // Название компонента в kebab case
├── src
|   ├── partials
|   |   └── partial-name
|   |       ├── PartialName.ts
|   |       ├── PartialName.module.css
|   |       └── index.ts
|   ├── hooks // хуки компонента
|   ├── ComponentName.ts
|   ├── ComponentName.module.css
|   ├── ComponentName.utilities.ts // логика и методы компонента
|   ├── ComponentName.types.ts
|   ├── ComponentName.tests.tsx
|   ├── ComponentName.stories.tsx
|   ├── ComponentName.stories.css // стили историй
|   ├── ComponentName.docs.mdx // документация компонента
|   └── index.ts
├── README.md
├── package.json
├── .npmignore
├── rollup.config.js
└── tsconfig.json
```

## Хук

### Структура хука

```
use-hook-name // Название хука в kebab case
├── src
|   ├── index.ts
|   ├── useHookName.ts
|   ├── useHookName.utilities.ts // логика и методы хука
|   ├── useHookName.tests.ts
|   ├── useHookName.stories.tsx
|   ├── useHookName.stories.css
|   └── useHookName.docs.mdx // документация хука
├── README.md
├── package.json
├── .npmignore
├── tsconfig.build.json
└── tsconfig.json
```

#### use-hook-name/README.md

````markdown
# `@byndyusoft-ui/use-hook-name`

A React hook that uses hook name. // hook description

### Installation

```sh
npm i @byndyusoft-ui/use-hook-name
# or
yarn add @byndyusoft-ui/use-hook-name
```

### Usage

```ts
// Usage examples
```

### License

Apache-2.0

### Author

Name Surname
````

#### use-hook-name/package.json

```json
{
    "name": "@byndyusoft-ui/use-hook-name",
    "version": "0.1.0",
    "description": "Byndyusoft UI React Hook",
    "keywords": ["byndyusoft", "byndyusoft-ui", "react", "hook", "hook-name"],
    "author": "Ivan Frontendov <frontendov@byndyusoft.com>",
    "homepage": "https://github.com/Byndyusoft/ui/tree/master/hooks/use-hook-name#readme",
    "license": "Apache-2.0",
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "repository": {
        "type": "git",
        "url": "git+https://github.com/Byndyusoft/ui.git"
    },
    "scripts": {
        "build": "tsc --project tsconfig.build.json",
        "clean": "rimraf dist",
        "lint": "eslint src --config ../../eslint.config.js",
        "test": "jest --config ../../jest.config.js --roots hooks/use-hook-name/src"
    },
    "bugs": {
        "url": "https://github.com/Byndyusoft/ui/issues"
    },
    "publishConfig": {
        "access": "public"
    }
}
```

#### use-hook-name/.npmignore

```
src
```

#### use-hook-name/tsconfig.build.json

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["src/*.tests.ts", "src/*.stories.tsx"]
}
```

#### use-hook-name/tsconfig.json

```json
{
    "extends": "../../tsconfig.json",
    "compilerOptions": {
        "declaration": true,
        "declarationDir": "dist",
        "outDir": "dist",
        "module": "commonjs",
        "target": "es6"
    },
    "include": ["src"]
}
```

### Возвращаемые значения хука

Результат работы хука - состояние и мутирующие его функции не имеющие возвращаемых значений. Таким образом состояние является единственным источником данных.

```javascript
const { state, mutateFn1, mutateFn2 } = useHookName();

// Можно вернуть как кортеж [state, commands]:

const [state, { mutateFn1, mutateFn2 }] = useHookName();
```

### Установка пакетов

Если пакет будет использоваться только в тестах или историях, то устанавливаем в package.json **проекта** в раздел **devDependencies**.\
Если пакет нужен в самом компоненте, то устанавливаем в package.json **компонента** в раздел **peerDependencies**.
