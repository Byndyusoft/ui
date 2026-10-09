# @byndyusoft-ui/http-client

HTTP-клиент с неизменяемым builder, адаптерами Fetch и XMLHttpRequest, типизированными ответами, hooks, отменой и таймаутами.

## Установка

```bash
npm install @byndyusoft-ui/http-client
```

Пакет требует Node.js 20 или новее для сборки и серверного выполнения. Браузерные приложения получают ESM-вход, CommonJS-потребители используют отдельную CJS-сборку.

```ts
import { HttpClient } from '@byndyusoft-ui/http-client';
```

```js
const { HttpClient } = require('@byndyusoft-ui/http-client');
```

Публичный API доступен только из корня пакета. Импорты внутренних путей `dist/*` не входят в контракт. Пакет помечен как не имеющий побочных эффектов при импорте, поэтому глобальную регистрацию обработчиков и полифиллов следует выполнять в коде приложения.

### Поддерживаемые окружения

-   `FetchAdapter` использует глобальные `fetch`, `Headers`, `AbortController` и другие стандартные Fetch API. Они доступны в современных браузерах и Node.js 20.
-   `XhrAdapter` предназначен для браузерного окружения и требует `XMLHttpRequest`. Для серверного выполнения нужен совместимый полифилл.
-   `asStream()` требует `ReadableStream`; XHR-вариант также использует `TextEncoder`.
-   Пакет не устанавливает полифиллы и не изменяет глобальное окружение.

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

Вызов без селектора допустим и возвращает `IHttpResponse<unknown>`. `FetchAdapter` и `XhrAdapter` без собственного `responseType` разбирают такое тело как JSON; настройка `XhrAdapter.responseType` может изменить формат по умолчанию. Generic `asJson<T>()` описывает ожидаемую схему и не проверяет данные во время выполнения.

Каждый выполненный запрос возвращает `IHttpResponse<T>`:

| Поле         | Тип                      | Описание                                                                 |
| ------------ | ------------------------ | ------------------------------------------------------------------------ |
| `data`       | `T \| undefined`         | декодированное тело; отсутствует для пустого ответа                      |
| `status`     | `number`                 | HTTP-статус                                                              |
| `statusText` | `string`                 | текст HTTP-статуса                                                       |
| `headers`    | `Record<string, string>` | заголовки ответа; стандартные адаптеры приводят имена к нижнему регистру |
| `config`     | `IHttpRequestConfig`     | фактическая конфигурация, переданная адаптеру                            |

## Настройка клиента

Конструктор принимает `IHttpClientOptions`. Пустой объект создаёт клиент с `FetchAdapter` и без общих настроек:

```ts
const httpClient = new HttpClient({
    baseUrl: 'https://api.example.com/v1',
    headers: { Accept: 'application/json' },
    params: { locale: 'ru' },
    timeout: 10_000,
    validateStatus: status => status >= 200 && status < 400,
    withCredentials: true
});
```

| Настройка         | Назначение                                           | Значение по умолчанию |
| ----------------- | ---------------------------------------------------- | --------------------- |
| `adapter`         | транспорт, реализующий `IHttpClientAdapter`          | новый `FetchAdapter`  |
| `baseUrl`         | базовая часть относительных URL                      | отсутствует           |
| `headers`         | заголовки всех запросов                              | отсутствуют           |
| `params`          | query-параметры всех запросов                        | отсутствуют           |
| `timeout`         | таймаут в миллисекундах                              | не задан на клиенте   |
| `validateStatus`  | определяет успешность HTTP-статуса                   | статусы `200–299`     |
| `withCredentials` | отправка credentials                                 | зависит от адаптера   |
| `onRequest`       | преобразование итоговой конфигурации перед адаптером | отсутствует           |
| `onRequestError`  | восстановление после ошибки request-hook             | отсутствует           |
| `onResponse`      | преобразование успешного ответа                      | отсутствует           |
| `onResponseError` | обработка или восстановление после ошибки ответа     | отсутствует           |

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

| Метод builder                     | Назначение                                                   |
| --------------------------------- | ------------------------------------------------------------ |
| `baseUrl(value)`                  | переопределяет базовый URL                                   |
| `header(name, value)`             | добавляет или заменяет один заголовок без учёта регистра     |
| `headers(values)`                 | объединяет несколько заголовков                              |
| `param(name, value)`              | добавляет, заменяет или удаляет один query-параметр          |
| `params(values)`                  | объединяет несколько query-параметров                        |
| `body(data)`                      | задаёт тело запроса                                          |
| `signal(signal)`                  | привязывает пользовательский `AbortSignal`                   |
| `timeout(milliseconds)`           | задаёт таймаут; `0` отключает также унаследованный таймаут   |
| `validateStatus(predicate)`       | определяет успешность статуса конкретного ответа             |
| `withCredentials(value)`          | управляет credentials конкретного запроса                    |
| `bearer(token)`                   | устанавливает `Authorization: Bearer <token>`                |
| `asJson<T>()` и остальные `as*()` | выбирают формат чтения и тип успешного ответа                |
| `build()`                         | возвращает независимый снимок `Readonly<IHttpRequestConfig>` |
| `execute()`                       | проверяет конфигурацию и выполняет запрос                    |

## URL, заголовки и query-параметры

Относительный URL объединяется с `baseUrl` как путь: завершающий slash базового URL и начальный slash запроса не дублируются. Абсолютный URL запроса используется без `baseUrl`. Query-параметры базового URL и запроса сохраняются, а fragment берётся из URL запроса.

```ts
const response = await httpClient
    .get('/users?sort=name#list')
    .params({ page: 2, active: true, role: ['admin', 'editor'] })
    .execute();
```

Значения query-параметров могут быть строками, числами, boolean или массивами этих значений. Массив сериализуется повторяющимися ключами. `null` и `undefined` удаляют ранее накопленный ключ в одной карте или цепочке builder, а такие элементы массива пропускаются. Непустые параметры запроса имеют приоритет над параметрами клиента. Значение `null` или `undefined` из запроса нормализуется до объединения и поэтому не удаляет одноимённый параметр, заданный в `HttpClient`.

Заголовки также объединяются слева направо, но их имена сравниваются без учёта регистра. Последнее значение заменяет предыдущее и сохраняет написание последнего имени.

## Тело запроса

`body()` принимает JSON-совместимые значения и готовые транспортные тела:

| Значение                                   | Преобразование и `Content-Type`                                                       |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| объект, массив, number, boolean или `null` | JSON; при отсутствии заголовка добавляется `application/json`                         |
| string                                     | отправляется без изменений; заголовок автоматически не добавляется                    |
| `URLSearchParams`                          | строка form-urlencoded; добавляется `application/x-www-form-urlencoded;charset=UTF-8` |
| `FormData`                                 | отправляется без изменений; boundary формирует транспорт                              |
| `Blob`, `ArrayBuffer`, `ArrayBufferView`   | отправляется без изменений                                                            |

Пользовательский `Content-Type` никогда не заменяется автоматически. Для `FormData` его не следует устанавливать вручную, иначе в заголовке может отсутствовать корректный boundary.

`body(undefined)` синхронно выбрасывает `RequestBuilderError`. Тело также запрещено для `GET` и `HEAD`. Ошибка `JSON.stringify`, например циклическая ссылка или несериализуемое значение, преобразуется адаптером в `RequestPreparationError` с исходной причиной в `cause`.

## Проверка HTTP-статуса

По умолчанию Fetch- и XHR-адаптеры считают успешными статусы от `200` до `299`. Настройка `validateStatus` позволяет изменить это правило для всего клиента или одного запроса:

```ts
const httpClient = new HttpClient({
    baseUrl: 'https://api.example.com',
    validateStatus: status => status >= 200 && status < 400
});

const response = await httpClient
    .get('/users/42')
    .validateStatus(status => status === 200 || status === 404)
    .asJson<IUser | null>()
    .execute();
```

Предикат запроса заменяет предикат клиента. Чтобы для отдельного запроса вернуть стандартное поведение поверх клиентской настройки, его нужно задать явно:

```ts
const response = await httpClient
    .get('/health')
    .validateStatus(status => status >= 200 && status < 300)
    .execute();
```

Предикат вызывается один раз с числовым статусом ответа. Если он возвращает `true`, тело разбирается в выбранном через `as*()` формате и ответ проходит через `onResponse`. Если он возвращает `false`, адаптер создаёт `HttpResponseError`, а тело ошибки пытается разобрать как JSON или текст. Исключение из предиката передаётся без замены в `onResponseError` и вызывающему коду.

## Отмена и таймауты

```ts
import { isAbortError } from '@byndyusoft-ui/http-client';

const controller = new AbortController();
const request = httpClient.get('/report').signal(controller.signal).timeout(5_000).asBlob().execute();

controller.abort('Navigation changed');

try {
    await request;
} catch (error) {
    if (!isAbortError(error)) {
        throw error;
    }
}
```

`timeout()` принимает конечное неотрицательное число миллисекунд. Значение `0` отключает таймаут, включая заданный в `HttpClient` или `XhrAdapter`. Пользовательская отмена приводит к `AbortError`, истечение таймаута — к `TimeoutError` с фактическим значением в поле `timeout`.

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

Fetch-специфичные параметры задаются в конструкторе адаптера:

| Настройка        | Назначение                                        |
| ---------------- | ------------------------------------------------- |
| `cache`          | режим браузерного HTTP-кэша                       |
| `credentials`    | базовый режим `omit`, `same-origin` или `include` |
| `integrity`      | Subresource Integrity                             |
| `keepalive`      | разрешает запросу пережить закрытие страницы      |
| `mode`           | `cors`, `no-cors` или `same-origin`               |
| `redirect`       | `follow`, `error` или `manual`                    |
| `referrer`       | значение referrer                                 |
| `referrerPolicy` | политика передачи referrer                        |

`mode: 'navigate'` запрещён для программного Fetch. `cache: 'only-if-cached'` допустим только вместе с `mode: 'same-origin'`. При `redirect: 'manual'` браузер может вернуть `opaque-redirect` со статусом `0`; продолжить такой редирект вручную нельзя.

### XMLHttpRequest

```ts
import { HttpClient, XhrAdapter } from '@byndyusoft-ui/http-client';

const httpClient = new HttpClient({
    adapter: new XhrAdapter({
        mimeType: 'application/json',
        timeout: 10_000,
        withCredentials: true,
        onDownloadProgress: (event, config) => {
            console.log(config.url, event.loaded, event.total);
        }
    })
});
```

XHR полезен для сценариев, которым нужны возможности `XMLHttpRequest`. `onDownloadProgress` и `onUploadProgress` получают нативный `ProgressEvent` и итоговую конфигурацию запроса. События передаются без throttling; если `lengthComputable === false`, значение `total` нельзя считать достоверным.

| Настройка            | Назначение                                          |
| -------------------- | --------------------------------------------------- |
| `mimeType`           | переопределяет MIME type через `overrideMimeType()` |
| `responseType`       | формат ответа по умолчанию для запросов без `as*()` |
| `timeout`            | таймаут по умолчанию                                |
| `withCredentials`    | credentials по умолчанию                            |
| `onDownloadProgress` | события загрузки ответа                             |
| `onUploadProgress`   | события отправки тела                               |

Обработчики задаются на весь экземпляр адаптера. Для изолированной загрузки можно создать scoped-клиент:

```ts
interface IUploadResult {
    id: string;
}

const uploadClient = httpClient.withAdapter(
    new XhrAdapter({
        onUploadProgress: (event, config) => {
            if (event.lengthComputable) {
                console.log(config.url, event.loaded / event.total);
            }
        }
    })
);

await uploadClient.post('/files').body(file).asJson<IUploadResult>().execute();
```

`withAdapter()` возвращает новый клиент со снимком текущих defaults и hooks. Исходный клиент и его адаптер не изменяются; последующая замена hooks в одном клиенте не влияет на другой.

Обработчик upload подключается только при наличии `onUploadProgress` и фактического тела запроса. Для cross-origin запроса такая подписка принудительно включает CORS preflight согласно [спецификации XMLHttpRequest](<https://xhr.spec.whatwg.org/#the-send()-method>), поэтому сервер должен корректно обрабатывать `OPTIONS`. `FetchAdapter` не предоставляет стандартный upload progress.

Текущий `asStream()` для XHR не является настоящим сетевым стримом: полученный текст накапливается в памяти. Прогресс загрузки и stream могут использоваться одновременно.

### Пользовательский адаптер

Транспорт можно реализовать самостоятельно через `IHttpClientAdapter`. Адаптер получает полностью объединённый `IHttpRequestConfig` и должен вернуть `IHttpResponse<T>` либо выбросить подходящую ошибку:

```ts
import {
    FetchAdapter,
    HttpClient,
    type IHttpClientAdapter,
    type IHttpRequestConfig,
    type IHttpResponse
} from '@byndyusoft-ui/http-client';

class LoggingAdapter implements IHttpClientAdapter {
    public constructor(private readonly inner = new FetchAdapter()) {}

    public request<T>(config: IHttpRequestConfig): Promise<IHttpResponse<T>> {
        console.log(config.method, config.url);

        return this.inner.request<T>(config);
    }
}

const httpClient = new HttpClient({ adapter: new LoggingAdapter() });
```

`validateStatus` входит в конфигурацию запроса и исполняется транспортом. Пользовательский адаптер, который не делегирует выполнение Fetch- или XHR-адаптеру, должен самостоятельно применить предикат и сформировать `HttpResponseError` для отклонённого статуса.

## Приоритет конфигурации

Общие настройки разрешаются в следующем порядке:

1. Настройки конкретного запроса в builder.
2. Настройки `HttpClient`.
3. Значения по умолчанию адаптера.

Предикат `validateStatus` запроса имеет приоритет над предикатом клиента; при отсутствии обоих используется диапазон `200–299`. Для XHR общий порядок применяется также к `timeout`, `responseType` и `withCredentials`. Заголовки, params и `baseUrl` не имеют значений по умолчанию на уровне адаптера. Специфичные для Fetch и XHR параметры задаются только в конструкторах соответствующих адаптеров.

## Credentials и CORS

```ts
const response = await httpClient.get('/profile').withCredentials(true).asJson<IUser>().execute();
```

Для Fetch `withCredentials` преобразуется в `credentials`:

-   `true` → `include`;
-   `false` → `same-origin`;
-   отсутствие значения → `credentials` адаптера или `same-origin`.

Для XHR `true` устанавливает `xhr.withCredentials = true`, а `false` — `false`. При отсутствии значения используется настройка `XhrAdapter` или `false`.

Клиент не может самостоятельно разрешить CORS. Сервер должен возвращать подходящие `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` и, для credentialed-запросов, `Access-Control-Allow-Credentials: true`. Cookie также подчиняются правилам `SameSite` и `Secure` браузера.

## Ошибки

Все ошибки пакета наследуются от `HttpClientError`. Базовый класс содержит `message`, стандартное поле `cause` и, если запрос уже был сформирован, `config`.

| Ошибка                    | Причина                                    | Дополнительные поля                       |
| ------------------------- | ------------------------------------------ | ----------------------------------------- |
| `RequestBuilderError`     | некорректные настройки builder             | `code`                                    |
| `RequestPreparationError` | не удалось подготовить транспортный запрос | `cause`, `config`                         |
| `HttpResponseError`       | статус отклонён функцией `validateStatus`  | `status`, `statusText`, `headers`, `data` |
| `ParseError`              | не удалось декодировать успешный ответ     | `responseType`, `raw`, `cause`, `config`  |
| `NetworkError`            | сетевая ошибка                             | `cause`, `config`                         |
| `AbortError`              | запрос отменён через `AbortSignal`         | `cause`, `config`                         |
| `TimeoutError`            | истёк таймаут                              | `timeout`, `cause`, `config`              |

Для каждого класса экспортируется guard: `isHttpClientError`, `isRequestBuilderError`, `isRequestPreparationError`, `isHttpResponseError`, `isParseError`, `isNetworkError`, `isAbortError` и `isTimeoutError`. Они используют `instanceof`; `isHttpClientError()` позволяет одним условием обработать любую ошибку пакета.

Коды ошибок builder экспортируются в `REQUEST_BUILDER_ERROR_CODES` и доступны через `RequestBuilderError.code`.

При отклонённом статусе адаптер пытается разобрать тело как JSON, затем как текст. Пустое или недоступное тело даёт `data === undefined`. Тип данных ошибки не связан с типом успешного ответа и проверяется отдельно:

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

    if (
        typeof candidate.message !== 'string' ||
        typeof candidate.errors !== 'object' ||
        candidate.errors === null ||
        Array.isArray(candidate.errors)
    ) {
        return false;
    }

    return Object.values(candidate.errors).every(
        value => Array.isArray(value) && value.every(item => typeof item === 'string')
    );
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

Hooks можно передать в конструктор или назначить методами клиента. Цепочка выполняется в следующем порядке:

1. Настройки клиента и builder объединяются.
2. `onRequest` получает итоговую конфигурацию и обязан вернуть конфигурацию для продолжения.
3. Если `onRequest` выбрасывает ошибку или возвращает невалидную конфигурацию, вызывается `onRequestError`. Возвращённая конфигурация восстанавливает запрос; `undefined` повторно выбрасывает исходную ошибку.
4. Адаптер выполняет запрос.
5. Успешный ответ проходит через `onResponse`, а его возвращаемое значение передаётся вызывающему коду.
6. Ошибка адаптера или `onResponse` передаётся в `onResponseError`. Возвращённый ответ восстанавливает выполнение; `undefined` повторно выбрасывает исходную ошибку. Восстановленный ответ повторно через `onResponse` не проходит.

Request-ошибки, возникшие до вызова адаптера, не передаются в response hooks.

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

```ts
httpClient
    .onRequest(addAuthorization)
    .onRequestError(recoverRequest)
    .onResponse(normalizeResponse)
    .onResponseError(recoverResponse);
```

Методы возвращают тот же клиент для построения цепочки вызовов. `withAdapter()` копирует ссылки на текущие hooks в новый клиент; последующая замена hook в одном экземпляре не влияет на другой.

## Публичные типы и константы

Основные типы доступны из корня пакета: `IHttpClientOptions`, `IHttpClientAdapter`, `IHttpRequestConfig`, `IHttpResponse`, `IFetchAdapterOptions`, `IXhrAdapterOptions`, `THttpHeaders`, `THttpParams`, `THttpRequestBody`, `THttpMethod`, `THttpResponseType`, `TValidateStatus`, типы hooks и опций ошибок.

Также экспортируются `HTTP_METHODS`, `HTTP_STATUS_CODES`, `HTTP_RESPONSE_TYPES` и `REQUEST_BUILDER_ERROR_CODES`. Внутренние asserts и utilities не входят в корневой публичный API.

## Ограничения текущей версии

-   Встроенных повторных запросов нет; retry должен выполняться отдельным слоем оркестрации.
-   Для каждой фазы хранится только один hook, а повторное назначение заменяет предыдущий.
-   `asJson<T>()` задаёт ожидаемый TypeScript-тип, но не проверяет схему данных во время выполнения.
-   Формат ответа `FormData` не поддерживается; `FormData` можно использовать только как тело запроса.
-   Fetch stream является нативным потоком. После возврата `ReadableStream` таймаут Fetch больше не контролирует его чтение.
-   XHR stream формируется из накопленного `responseText`, поэтому весь текст остаётся в памяти. Promise успешного stream-запроса может разрешиться после получения заголовков, а последующая сетевая ошибка, abort или timeout передаётся через ошибку самого потока. Этот пограничный сценарий пока считается экспериментальным и может быть уточнён до стабильной версии.
-   Поведение CORS с credentials, cookies, redirects и `keepalive` зависит от браузера и должно проверяться интеграционно в целевом окружении.
