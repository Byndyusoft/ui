# TODO — @byndyusoft-ui/http-client

## P0

Нет критичных доработок, блокирующих использование пакета.

## P1

### Типизировать тело HTTP-ошибки

`HttpResponseError<T>` уже параметризован, но адаптеры создают его с `unknown`, а guard не позволяет вызывающему коду указать ожидаемый тип. Нужен явный сценарий для `400` и `422`, например `isHttpResponseError<ValidationError>(error)`, плюс type-tests.

### Уточнить валидацию опций `FetchAdapter`

Нужно отклонять значения и сочетания, которые Fetch не поддерживает при программном запросе: например, `mode: 'navigate'` и `cache: 'only-if-cached'` без `mode: 'same-origin'`. Ошибка должна возникать при создании адаптера, а не во время отправки запроса. Нужны также тесты на эти комбинации.

### Добавить и закрепить документацию пакета

Нужны README и примеры: настройка Fetch/XHR, приоритеты конфигурации (client → builder → adapter), `withCredentials`, ограничения CORS, таблица ошибок и hooks. Без этого публичный API плохо discoverable.

### Добавить браузерные интеграционные тесты

Проверить в настоящих браузерах credentialed CORS, preflight, cookies с `SameSite`/`Secure`, redirects и `keepalive`. Тесты jsdom и mock-адаптеров не воспроизводят эти особенности платформы.

### Выровнять parity Fetch ↔ XHR

XHR не учитывает `Content-Length: 0` (Fetch уже учитывает). `getErrorData` читает тело ошибки только при `responseType === 'text'`, поэтому 4xx/5xx при `blob`/`formData` почти всегда без `data`. Выровнять семантику empty body и error body + тесты на оба адаптера.

### Клонировать default `headers` в конструкторе клиента

`params` копируются через `mergeParams`, а `headers` сохраняются по ссылке — внешняя мутация объекта влияет на клиент. Нужно `headers: mergeHeaders(options.headers)` (или аналог) и тест на иммутабельность.

## P2

### Спроектировать opt-in retry

Добавить повторы для временных сетевых сбоев, `408`, `429` и части `5xx`: с лимитом попыток, exponential backoff, поддержкой `Retry-After`, отменой через `AbortSignal` и безопасным поведением для мутаций. Предпочтительно middleware/hook, а не жёсткая логика в core.

### Добавить progress API для XHR

Выделить публичный контракт для `onDownloadProgress` и `onUploadProgress`. Нужно документировать, что upload-progress является преимуществом XHR и не имеет стандартного аналога в Fetch.

### Добавить `validateStatus`

Сейчас любой статус вне 2xx → `HttpResponseError`. Нужна опция `validateStatus?: (status) => boolean` (client/request), чтобы 404/304 и т.п. можно было считать успехом.

### Не класть пустой объект `params` в merged config

`mergeParams` всегда возвращает `{}`. Если источников нет или после merge ключей не осталось — лучше `undefined`, чтобы не шуметь в config/логах.

### Юнит-тесты утилит

Изолированно покрыть `buildUrl`, `mergeHeaders`, `mergeParams`, `prepareRequestBody` (включая FormData без Content-Type, URLSearchParams, circular JSON).

### Зафиксировать edge-cases XHR stream

Поведение abort/timeout после resolve stream и 4xx при `responseType: 'stream'` должно быть явным контрактом (reject promise vs `stream.error`) с тестами.

### Единый язык public surface

Свести JSDoc и сообщения ошибок к одному языку (EN для npm API); убрать RU/EN mix во внутренних комментариях публичных модулей.

## P3

### Развить hooks до композиционного pipeline

Сейчас на каждую фазу можно назначить лишь один хук, а следующий вызов заменяет предыдущий. При совместном использовании auth, tracing и логирования потребуется композиция хуков с предсказуемым порядком и правилами восстановления.

### Convenience-методы builder

Опциональный сахар: `json()`, `acceptJson()`, `multipart()` поверх headers.

### Release hygiene

CHANGELOG, examples, полный JSDoc на public exports; semver `0.0.1` → `0.1.0` при первом publish; поле `exports` в `package.json`.

## Рекомендуемый порядок

1. P1: typed errors + Fetch options validation + README
2. P1: adapter parity + headers clone
3. P1: browser e2e
4. P2: retry / progress по продуктовым нуждам
5. P2–P3: DX и полировка

## Закрыто

- Модель ошибок + guards (`HttpResponseError`, `ParseError`, `cause`/`config`)
- `TimeoutError.timeout`, `ParseError.responseType` / `raw`
- Body: FormData / URLSearchParams / Blob / ArrayBufferView (`prepareRequestBody`)
- Default `params`, number/boolean params, null-skip
- Options/config validation, `RequestPreparationError`
- formData / stream response types
- `FetchAdapter`: `ParseError`, если streaming body отсутствует (`response.body === null`)
- `HttpResponseError` передаёт `config` в базовый `HttpClientError`
- Default `FetchAdapter`, `withCredentials` (client / builder / оба адаптера)
- Adapter options (`FetchAdapterOptions`, `XhrAdapterOptions`)
- Удалены устаревшие закомментированные методы из `HttpRequestBuilder`
- Publish hygiene: `files: ["dist"]`, `.npmignore`
