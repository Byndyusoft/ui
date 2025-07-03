# Конвенции при разработке ui-библиотеки

## Структура документации

1. Нейминг
2. Описание компонента
3. Описание хука
4. Общие рекомендации

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

Шаблон файлов можно посмотреть в hygen-шаблоне компонента: `[rootDir]/.templates/create/component`

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

Шаблон файлов можно посмотреть в hygen-шаблоне хука: `[rootDir]/.templates/create/hook`

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

## Общие рекомендации

1. [Создавайте новые хуки и компоненты по hygen-шаблону](./README.md#create-a-new-entity)
2. Библиотеки стилей следует импортировать в ts файл, а не в css/scss. Это необходимо, чтобы сборщик не положил их в бандл, и чтобы их импорт корректно сохранился в бандле
3. Не забывайте указывать все зависимости пакета, в том числе и пакеты из этого репозитория, в package.json в peerDependencies и dependencies
