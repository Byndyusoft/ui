# `@byndyusoft-ui/plural`

---

> Компонент выбирает правильную форму множественного числа для переданного количества и локали.
> Внутри используется `Intl.PluralRules`, а формы строго типизируются для поддерживаемых локалей.

## Установка

```sh
npm i @byndyusoft-ui/plural
# or
yarn add @byndyusoft-ui/plural
```

## Использование

```tsx
import Plural from '@byndyusoft-ui/plural';

<Plural
    count={count}
    locale="ru"
    forms={{
        one: 'проект',
        few: 'проекта',
        many: 'проектов',
        other: 'проекта'
    }}
/>;
```

Компонент рендерит только выбранную форму. Число можно вывести рядом отдельно, чтобы его форматировать, округлять или отображать по правилам конкретного интерфейса.

`locale` можно не передавать. По умолчанию используется `ru`, поэтому без `locale` нужно передать формы для русского языка:

```tsx
<Plural
    count={count}
    forms={{
        one: 'проект',
        few: 'проекта',
        many: 'проектов',
        other: 'проекта'
    }}
/>;
```

Для `ru` нужно передать формы `one`, `few`, `many` и `other`.
`other` нужен для дробных значений: например, `new Intl.PluralRules('ru').select(1.5)` возвращает `other`.

Для `en` нужно передать формы `one` и `other`.

Если `locale` определяется динамически, например через `Math.random()` или пользовательские настройки, нужно передавать формы, связанные с конкретной веткой локали:

```tsx
const locale = Math.random() > 0.5 ? 'ru' : 'en';

return locale === 'ru' ? (
    <Plural
        count={count}
        locale="ru"
        forms={{
            one: 'проект',
            few: 'проекта',
            many: 'проектов',
            other: 'проекта'
        }}
    />
) : (
    <Plural
        count={count}
        locale="en"
        forms={{
            one: 'project',
            other: 'projects'
        }}
    />
);
```

## Разметка в формах

В `forms` можно передавать не только строки, но и любую React-разметку:

```tsx
<Plural
    count={count}
    locale="en"
    forms={{
        one: <strong>project</strong>,
        other: <span className="muted">projects</span>
    }}
/>;
```

## Категории форм

Точные категории для локали можно узнать через утилиту `getPluralCategories`:

```ts
import { getPluralCategories } from '@byndyusoft-ui/plural';

getPluralCategories('ru');
// ['few', 'many', 'one', 'other']

getPluralCategories('en');
// ['one', 'other']
```
