# @byndyusoft-ui/http-client

HTTP-клиент с неизменяемым builder, адаптерами Fetch и XMLHttpRequest, типизированными ответами, hooks, отменой и таймаутами.

## Установка

```bash
npm install @byndyusoft-ui/http-client
```

## Быстрый старт

По умолчанию используется `FetchAdapter`:

```ts
import { HttpClient } from '@byndyusoft-ui/http-client';

interface IUser {
    id: number;
    name: string;
}

const httpClient = new HttpClient({
    baseUrl: 'https://api.example.com'
});

const response = await httpClient.get('/users/1').asJson<IUser>().execute();
const user = response.data;
```

Формат ответа выбирается до выполнения запроса. `execute()` не принимает generic.

| Метод             | Тип `data`                                | Когда использовать                 |
| ----------------- | ----------------------------------------- | ---------------------------------- |
| `asJson<T>()`     | `T \| undefined`                          | JSON API                           |
| `asText()`        | `string \| undefined`                     | текст, HTML, CSV                   |
| `asBlob()`        | `Blob \| undefined`                       | файлы и бинарные данные в браузере |
| `asArrayBuffer()` | `ArrayBuffer \| undefined`                | низкоуровневая бинарная обработка  |
| `asStream()`      | `ReadableStream<Uint8Array> \| undefined` | потоковое чтение ответа            |

Вызов без селектора допустим и возвращает `IHttpResponse<unknown>`. Generic `asJson<T>()` описывает ожидаемую схему и не проверяет данные во время выполнения.

## Построение запроса

Builder неизменяемый: каждый метод возвращает новый экземпляр.

```ts
const request = httpClient
    .post('/users')
    .header('X-Request-Id', requestId)
    .param('source', 'admin')
    .body({ name: 'Jane' })
    .timeout(5_000)
    .asJson<IUser>();

const response = await request.execute();
```

Поддерживаются методы `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `OPTIONS` и `PATCH`. Для `GET` и `HEAD` тело запрещено.

## Тело запроса

`body()` принимает JSON-совместимые значения, строку, `FormData`, `URLSearchParams`, `Blob`, `ArrayBuffer` и `ArrayBufferView`.

-   Обычный объект автоматически сериализуется в JSON; при отсутствии заголовка добавляется `Content-Type: application/json`.
-   `body(null)` отправляет JSON `null`.
-   `body(undefined)` синхронно выбрасывает `RequestBuilderError`.
-   При передаче `FormData` заголовок `Content-Type` вручную задавать не следует: браузер добавит boundary.

## Адаптеры

### Fetch

```ts
import { FetchAdapter, HttpClient } from '@byndyusoft-ui/http-client';

const httpClient = new HttpClient({
    adapter: new FetchAdapter({
        cache: 'no-store',
        mode: 'cors',
        redirect: 'follow'
    })
});
```

Fetch-специфичные параметры задаются в конструкторе адаптера. При `redirect: 'manual'` браузер может вернуть `opaque-redirect` со статусом `0`; продолжить такой редирект вручную нельзя.

### XMLHttpRequest

```ts
import { HttpClient, XhrAdapter } from '@byndyusoft-ui/http-client';

const httpClient = new HttpClient({
    adapter: new XhrAdapter({
        mimeType: 'application/json',
        timeout: 10_000,
        withCredentials: true
    })
});
```

XHR полезен для сценариев, которым нужны возможности `XMLHttpRequest`. Текущий `asStream()` для XHR не является настоящим сетевым стримом: полученный текст накапливается в памяти.

## Приоритет конфигурации

Общие настройки разрешаются в следующем порядке:

1. Настройки конкретного запроса в builder.
2. Настройки `HttpClient`.
3. Значения по умолчанию адаптера.

Специфичные для Fetch и XHR параметры задаются только в конструкторах соответствующих адаптеров.

## Credentials и CORS

```ts
const response = await httpClient.get('/profile').withCredentials(true).asJson<IUser>().execute();
```

Для Fetch `withCredentials` преобразуется в `credentials`:

-   `true` → `include`;
-   `false` → `same-origin`;
-   отсутствие значения → `credentials` адаптера или `same-origin`.

Клиент не может самостоятельно разрешить CORS. Сервер должен возвращать подходящие `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` и, для credentialed-запросов, `Access-Control-Allow-Credentials: true`. Cookie также подчиняются правилам `SameSite` и `Secure` браузера.

## Ошибки

| Ошибка                    | Причина                                    |
| ------------------------- | ------------------------------------------ |
| `RequestBuilderError`     | Некорректные настройки builder             |
| `RequestPreparationError` | Не удалось подготовить транспортный запрос |
| `HttpResponseError`       | HTTP-статус вне диапазона 2xx              |
| `ParseError`              | Не удалось декодировать успешный ответ     |
| `NetworkError`            | Сетевая ошибка                             |
| `AbortError`              | Запрос отменён через `AbortSignal`         |
| `TimeoutError`            | Истёк таймаут                              |

```ts
import { isHttpResponseError } from '@byndyusoft-ui/http-client';

interface IValidationError {
    message: string;
    errors: Record<string, string[]>;
}

function isValidationError(data: unknown): data is IValidationError {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    const candidate = data as Partial<IValidationError>;

    return typeof candidate.message === 'string' && typeof candidate.errors === 'object';
}

try {
    await httpClient.get('/users/1').asJson<IUser>().execute();
} catch (error) {
    if (isHttpResponseError(error) && isValidationError(error.data) && (error.status === 400 || error.status === 422)) {
        console.error(error.data.message, error.data.errors);
    }
}
```

`isHttpResponseError(error)` проверяет класс ошибки и открывает доступ к `data` типа `unknown`. Схема тела принадлежит конкретному API, поэтому проверяется отдельным пользовательским type guard. После обеих проверок `error.data` имеет точный тип `IValidationError` без `undefined`.

## Hooks

Hooks можно передать в конструктор или назначить методами клиента:

```ts
const httpClient = new HttpClient({
    onRequest: config => ({
        ...config,
        headers: { ...config.headers, Authorization: `Bearer ${token}` }
    }),
    onResponse: response => response,
    onResponseError: error => {
        throw error;
    }
});
```

Поддерживаются `onRequest`, `onRequestError`, `onResponse` и `onResponseError`. Повторное назначение hook заменяет предыдущее значение.
