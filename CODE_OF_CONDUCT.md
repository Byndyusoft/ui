# Конвенции при разработке ui-библиотеки

## Нейминг

### Именование коммитов

Именуем согласно Conventional Commits

Если изменён объект внутри компонента, к примеру. То можно использовать такую форму записи: ``fix(Dropdown/Item): change styles names``

Примеры:

* ``fix(Button): remove useless styles``
* ``feat(Anchore): add “some feature”``
* ``chore(Input): merge package.json with "master" branch``
* ``chore: update version in package.json``
* ``refactor(resetCss/Input): simplify styles``


## Структура компонента

```
component-name // Название компонента в kebab case
├── src
|   ├── partials
|   ├── hooks // хуки компонента
|   ├── ComponentName.ts
|   ├── ComponentName.module.css
|   ├── ComponentName.types.ts
|   ├── ComponentName.tests.ts
|   ├── ComponentName.stories.ts
|   └── index.ts
├── README.md
├── package.json
└── .npmignore
```


## Структура хука

```
use-hook-name // Название хука в kebab case
├── src
|   ├── index.ts
|   ├── useHookName.ts
|   ├── useHookName.tests.ts
|   └── useHookName.stories.tsx
├── README.md
├── package.json
└── .npmignore
```

### use-hook-name/README.md

```
@byndyusoft-ui/use-hook-name

A React hook that uses hook name. // hook description
```

### Installation

```
npm i @byndyusoft-ui/use-hook-name
# or
yarn add @byndyusoft-ui/use-hook-name
```

### use-hook-name/package.json

```
"name": "@byndyusoft-ui/use-hook-name",
"version": "0.1.0",
"description": "Byndyusoft UI React Hook",
"keywords": [
"byndyusoft",
"byndyusoft-ui",
"react",
"hook",
"hook-name"
],
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
"build": "tsc",
"clean": "rimraf dist",
"lint": "eslint src --config ../../eslint.config.js",
"test": "jest --config ../../jest.config.js --roots hooks/use-hook-name/src"
},
"bugs": {
"url": "https://github.com/Byndyusoft/ui/issues"
},
"publishConfig": {
"access": "public"
},

	...

}
```

### use-hook-name/.npmignore

```
src
```

### Возвращаемые значения

Результат работы хука - состояние и мутирующие его функции не имеющие возвращаемых значений. Таким образом состояние является единственным источником данных.

```javascript
const { state, mutateFn1, mutateFn2 } = useHookName();

// Можно вернуть как кортеж [state, commands]:

const [state, { mutateFn1, mutateFn2 }] = useHookName();
```

### Структура документации

**@byndyusoft-ui/component-name**
```
Description

1. Описание компонента или хука
2. Использование (с примерами кода)

Installation

npm i @byndyusoft-ui/component-name
# or
yarn add @byndyusoft-ui/component-name

License

MIT License

Author

Name Surname
```
