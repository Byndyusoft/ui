# `@byndyusoft-ui/paths-build`

## Установка

```bash
npm i @byndyusoft-ui/paths-build
```

## Основные понятия

**Route (маршрут, роут)** - конфигурация маршрута до экрана UI. Может включать в себя паф, правила перенаправления и др.

**Path (паф)** - путь, строка по которой формируется URL:

-   статический `/about`, `/tasks`
-   параметризированный `/tasks/:taskId`

Параметризированный `path` может содержать:

-   опциональные параметры `/tasts/:taskId?`
-   опциональные сегменты `/tasts/edit?`

##Доступные методы

-   `generatePath(path, params?)` - метод получает паф и параметры для заполнения. Отдает готовый урл
-   `createUrl(path, params?, options?)` - то же, что и метод `generatePath`. Можно задавать опции
-   `createUrlsByPaths(paths, options?)` - метод получает объект с ключ-значениями пафов (ключ - название пафа, значение - паф) и отдает объект с ключ-значениями урлов (ключ - название урла, значение - метод формирования урла)

```ts
options => { baseUrl?: string; }
```

## Особенности использования

1. Параметры описываются через схему: `:paramName`
2. Тип параметра - `string`, `number` и `null`
3. Если параметры не заданы, они становятся `null`:

    ````ts
    generatePath('/tasks/:taskId/', { taskId: '' }); // => /tasks/null/
    generatePath('/tasks/:taskId/', { taskId: null }); // => `/tasks/null/```
    ````

4. Если опциональные параметры не заданы, они пропускаются
    ```ts
    generatePath('/tasks/:taskId?'); // => '/tasks'
    ```
5. Опциональные сегменты остаются в url:

    ```ts
    createUrl('/tasks/edit?'); // => /tasks/edit
    ```

6. Слеш в конце пафа не вырезается, если задан:

    ```ts
    createUrl('/tasks/'); // => /tasks/
    ```

7. Константа `paths` для метода `createUrlsByPaths` обязательно должна быть создана как `as const`:

```ts
const paths = {
    users: '/users',
    userComment: '/users/:userId/comments/:commentId/'
} as const; // <= important
```

## Примеры использования

### generatePath

```ts
generatePath('/tasks'); // => '/tasks'
generatePath('/tasks/'); // => '/tasks/'
generatePath('/tasks/:taskId', { taskId: 1 }); // => '/tasks/1'
generatePath('/tasks/:taskId/comments/:commentId/', { taskId: 1, commentId: 5 }); // => '/tasks/1/comments/5/'
generatePath('/tasks/:taskId/comments/:commentId?/', { taskId: 1 }); // => '/tasks/1/comments/'
);
```

### createUrl

```ts
createUrl('/tasks'); // => '/tasks'
createUrl('/tasks/:taskId', { taskId: 1 }); // => '/tasks/1'
createUrl('/tasks/:taskId', { taskId: 1 }, { baseUrl: 'http://test.com' }); // => 'http://test.com/tasks/1'
```

### createUrlsByPaths

Пример 1:

```ts
const paths = {
    users: '/users',
    userComment: '/users/:userId/comments/:commentId'
} as const;

const urls = createUrlsByPaths(paths);

resultWithBaseUrl.users(); // => `/users`
resultWithBaseUrl.userComment({ userId: 1, commentId: 2 }); // => '/users/1/comments/2'
```

Пример 2:

```ts
const paths = {
    users: '/users',
    userComment: '/users/:userId/comments/:commentId'
} as const;

const urls = createUrlsByPaths(paths, { baseUrl: 'http://test.com' });

resultWithBaseUrl.users(); // => `http://test.com/users`
resultWithBaseUrl.userComment({ userId: 1, commentId: 2 }); // => 'http://test.com/users/1/comments/2'

resultWithBaseUrl.users({ baseUrl: 'http://another-site.com' }); // => 'http://another-site.com/users'
resultWithBaseUrl.userComment({ userId: 1, commentId: 2 }, { baseUrl: 'http://another-site.com' }); // => 'http://another-site.com/users/1/comments/2'
```
