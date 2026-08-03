# Фактически реализованный scope

Дата инвентаризации: 2026-08-03  
Ревизия: `28563e0` (`master` / `origin/master`)  
Опубликованный URL: https://appealhub.mararx.com/ (редирект с `https://linamarar.github.io/appeal-hub/`)

## Маршруты

Hash-routing (`location.hash`). Базовый fallback при пустом hash: `#/appeals`.

| Hash | View ID | Описание |
|---|---|---|
| `#/appeals`, `#/`, неизвестный hash | `dashboard` | Список обращений |
| `#/appeals/:id` | `appeal-detail` | Карточка обращения |
| `#/flow` | `flow` | Создание обращения (upload → AI mock → карточка) |
| `#/clients` | `clients` | Список клиентов (mock) |
| `#/clients/:id` | `client-detail` | Карточка клиента (mock) |
| `#/templates` | `templates` | Шаблоны (mock) |
| `#/analytics` | `analytics` | Аналитика KPI/графики (mock) |
| `#/settings` | `settings` | Каталог настроек (mock) |
| `#/settings/:slug` | `settings-detail` | Заглушка раздела настроек |

Неизвестный hash открывает список обращений (не отдельный 404).  
Неизвестный `:id` обращения/клиента — состояние not-found на странице детали.

## Страницы

- Application shell: sidebar, header (hamburger ≤1024px, уведомления-кнопка, профиль «Администратор»)
- Список обращений (таблица, toolbar, loading/empty)
- Карточка обращения (статус, назначение, SLA, история, комментарии, вложения)
- Flow «Новое обращение»
- Клиенты / карточка клиента
- Шаблоны / Аналитика / Настройки

## Функции

**Реализовано и доступно для проверки**

- Навигация shell + active state
- Collapse sidebar (desktop) + mobile off-canvas drawer
- Список обращений: загрузка mock, колонки, открытие по клику/кнопке
- Refresh списка (имитация loading)
- Карточка обращения: fetch mock, not-found, back
- Статусы: матрица `STATUS_TRANSITIONS`, UI select доступных переходов
- Назначение / переназначение / принять в работу (с правами и валидацией причины)
- SLA: ON_TRACK / AT_RISK / OVERDUE / PAUSED
- Внутренние комментарии + вложения (валидация типа/размера/количества)
- История/лента сообщений (INTERNAL visibility + права)
- Mock-разделы: клиенты (поиск/фильтры), шаблоны (вкладки/поиск), аналитика (период/KPI), настройки (каталог readiness)
- Deploy: GitHub Pages workflow `.github/workflows/static.yml`

**Частично / UI без логики**

- Поиск и фильтры на списке обращений — элементы есть, фильтрация таблицы не подключена
- Пагинация списка — статическая разметка «Страница 1 из 1»
- Кнопка уведомлений — без обработчика
- Persistence изменений — только in-memory на сессию (без `localStorage` для appeals)

**Не реализовано на списке обращений**

- KPI/дашборд-карточки количества обращений над таблицей (есть только в разделе «Аналитика»; README упоминает дашборд на списке)

## Mock repositories

| Модуль | Файл |
|---|---|
| AppealsRepository | `scripts/data/appeals-repository.js` (~14 обращений) |
| Users / current user | `scripts/data/users-mock.js` |
| Status catalog | `scripts/data/status-catalog.js` |
| Message/attachment constants | `scripts/data/message-constants.js` |
| ClientsRepository | `scripts/data/clients-mock.js` |
| TemplatesRepository | `scripts/data/templates-mock.js` |
| AnalyticsRepository | `scripts/data/analytics-mock.js` |
| SettingsRepository | `scripts/data/settings-mock.js` |

Сервисы: `AppealsService`, `SlaService`, `Permissions`, `ClientsService`.

## Реализованные права

Текущий пользователь: администратор с полным набором permissions, включая:

- `appeal.accept`, `appeal.changeStatus`, `appeal.assign`, `appeal.reassign`
- `appeal.addInternalComment`, `appeal.addAttachment`, `appeal.viewInternalComments`
- `client.view`, `client.viewAppeals`, `client.viewDocuments`, `client.viewInternalInfo`

Переключение ролей в UI отсутствует (проверка недостаточных прав — только через подмену actor в коде).

## Реализованные состояния

**Статусы обращения:** NEW, SYSTEM_REVIEW, ASSIGNED, IN_PROGRESS, WAITING_SPECIALIST, WAITING_CLIENT, RESPONSE_SENT, CLOSED, REOPENED.

**SLA:** ON_TRACK, AT_RISK, OVERDUE, PAUSED.

**UI states:** loading / empty / loaded / not-found (appeals list, appeal detail, client detail и mock-страницы через `PageUtils`).

## Не реализовано

- `package.json`, npm/build pipeline, unit/e2e test framework
- Backend API, реальная загрузка/скачивание файлов
- Полноценная пагинация и рабочий поиск/фильтры списка обращений
- KPI-дашборд на странице «Обращения»
- CRUD в настройках
- Переключение пользователя/ролей в UI
- Автотесты

## Запуск

- Зависимостей нет (статический прототип)
- Локально: открыть `index.html` или `python3 -m http.server` из корня
- Build: отсутствует (артефакт = корень репозитория)
- Deploy: push в `master`/`main` → GitHub Pages
