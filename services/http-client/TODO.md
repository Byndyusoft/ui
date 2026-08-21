# TODO — @byndyusoft-ui/http-client

Связанные архитектурные решения зафиксированы в [DECISIONS.md](./DECISIONS.md).

## P0

### P0-1 — Релизная гигиена: README + changeset + версия

`homepage` в package.json указывает на несуществующий `#readme`, `.changeset/` пуст, версия `0.0.1` → `0.1.0` при первом publish. Нужны README с примерами (настройка Fetch/XHR, приоритеты конфигурации client → builder → adapter, `withCredentials`, ограничения CORS, таблица ошибок, hooks) и changeset перед паблишем. В README отдельно зафиксировать: маппинг `withCredentials` → fetch `credentials` (`true` → `include`, `false` → `same-origin`, `undefined` → `credentials` адаптера ?? `same-origin`) согласно D-001; контракт `body()` (допустимые типы, автосериализация объектов в JSON с авто-`Content-Type`); ограничение `redirect: 'manual'` (opaque-redirect приходит как `HttpResponseError` со статусом `0`, продолжить редирект вручную нельзя).

## P1

### P1-1 — Типизировать тело HTTP-ошибки

`HttpResponseError<T>` уже параметризован, но адаптеры создают его с `unknown`, а guard не позволяет вызывающему коду указать ожидаемый тип. Нужен явный сценарий для `400` и `422`, например `isHttpResponseError<ValidationError>(error)`, плюс type-tests.

### P1-2 — Вывод типа данных ответа из `responseType`

`responseType('blob').execute()` возвращает `unknown` — каждый вызов требует явного дженерика, а рассинхрон `responseType('blob')` + `execute<string>()` не ловится компилятором. Нужен `THttpResponseData<TResponseType, TJson>` + дженерик-builder (`HttpRequestBuilder<TResponseType>`), покрыть type-тестами. Сделать до README, чтобы документировать финальный API.

### P1-3 — Выровнять parity Fetch ↔ XHR

XHR не учитывает `Content-Length: 0` (Fetch уже учитывает). `getErrorData` читает тело ошибки только при `responseType === 'text'`, поэтому 4xx/5xx при `blob`/`formData` почти всегда без `data`. Выровнять семантику empty body и error body + тесты на оба адаптера. Смежное ограничение XHR: парсинг `formData` построен на глобальном `Response` — в окружениях без fetch-API падает без fail-fast; нужен guard с `RequestPreparationError` или явная документация.

## P2

### P2-1 — Модернизация package.json

Сборка только CJS: нет `exports`-map (dual ESM/CJS для Vite-потребителей), `sideEffects: false`, `engines` (Node 20). Без ESM-входа недоступен tree-shaking.

### P2-2 — Добавить progress API для XHR

Выделить публичный контракт для `onDownloadProgress` и `onUploadProgress`. Нужно документировать, что upload-progress является преимуществом XHR и не имеет стандартного аналога в Fetch.

### P2-3 — Добавить `validateStatus`

Сейчас любой статус вне 2xx → `HttpResponseError`. Нужна опция `validateStatus?: (status) => boolean` (client/request), чтобы 404/304 и т.п. можно было считать успехом.

### P2-4 — Спроектировать opt-in retry

Добавить повторы для временных сетевых сбоев, `408`, `429` и части `5xx`: с лимитом попыток, exponential backoff, поддержкой `Retry-After`, отменой через `AbortSignal` и безопасным поведением для мутаций. Предпочтительно middleware/hook, а не жёсткая логика в core.

### P2-5 — Юнит-тесты утилит

Изолированно покрыть `buildUrl`, `mergeHeaders`, `mergeParams`, `prepareRequestBody` (включая FormData без Content-Type, URLSearchParams, circular JSON). Заодно зафиксировать контракт `prepareRequestBody`, который мутирует переданный `headers` (JSDoc или возврат пары значений), и поведение `body(undefined)`: ключ `data` в config создаётся, но адаптеры тело не отправляют.

### P2-6 — Зафиксировать edge-cases XHR stream

Поведение abort/timeout после resolve stream и 4xx при `responseType: 'stream'` должно быть явным контрактом (reject promise vs `stream.error`) с тестами. Смежное: расходящаяся семантика timeout для STREAM — fetch-таймер живёт до получения заголовков, `xhr.timeout` покрывает всю загрузку; задокументировать или унифицировать. Также задокументировать, что XHR-stream не настоящий стрим: ответ целиком накапливается в `responseText`, что ограничивает размер стриминговых ответов по памяти.

### P2-7 — Добавить браузерные интеграционные тесты

Проверить в настоящих браузерах credentialed CORS, preflight, cookies с `SameSite`/`Secure`, redirects и `keepalive`. Тесты jsdom и mock-адаптеров не воспроизводят эти особенности платформы. Актуально после появления реальных пользователей credentials-API.

## P3

### P3-1 — Развить hooks до композиционного pipeline

Сейчас на каждую фазу можно назначить лишь один хук, а следующий вызов заменяет предыдущий. При совместном использовании auth, tracing и логирования потребуется композиция хуков с предсказуемым порядком и правилами восстановления.

### P3-2 — Не класть пустой объект `params` в merged config

`mergeParams` всегда возвращает `{}`. Если источников нет или после merge ключей не осталось — лучше `undefined`, чтобы не шуметь в config/логах.

### P3-3 — Convenience-методы builder

Опциональный сахар: `json()`, `acceptJson()`, `multipart()` поверх headers.

### P3-4 — Чистка конфигурации

`.npmignore` избыточен при `files: ["dist"]` — удалить. Поправить команду запуска тестов пакета в корневом AGENTS.md (`vitest run --root ../../ --project <name>` не работает; рабочий вариант — `npm test -w @byndyusoft-ui/http-client`).

## Рекомендуемый порядок

1. P0: README + changeset (после P1 «вывод типа данных ответа», чтобы документировать финальный API)
2. P1: typed errors + adapter parity
3. P2: package.json модернизация вместе с релизной подготовкой
4. P2: retry / progress / validateStatus по продуктовым нуждам
5. P2–P3: DX и полировка фоном

## Закрыто

1. Модель ошибок + guards (`HttpResponseError`, `ParseError`, `cause`/`config`)
2. `TimeoutError.timeout`, `ParseError.responseType` / `raw`
3. Body: FormData / URLSearchParams / Blob / ArrayBufferView (`prepareRequestBody`)
4. Default `params`, number/boolean params, null-skip
5. Options/config validation, `RequestPreparationError`
6. formData / stream response types
7. `FetchAdapter`: `ParseError`, если streaming body отсутствует (`response.body === null`)
8. `HttpResponseError` передаёт `config` в базовый `HttpClientError`
9. Default `FetchAdapter`, `withCredentials` (client / builder / оба адаптера)
10. Adapter options (`FetchAdapterOptions`, `XhrAdapterOptions`)
11. Удалены устаревшие закомментированные методы из `HttpRequestBuilder`
12. Publish hygiene: `files: ["dist"]`, `.npmignore`
13. Default `headers` клонируются в конструкторе `HttpClient`.
14. Языковое соглашение: комментарии и JSDoc исходников — английский; пользовательские документы пакета — русский (D-002).
15. Валидация `FetchAdapter`: исключён `mode: 'navigate'`; `cache: 'only-if-cached'` требует `mode: 'same-origin'`.
