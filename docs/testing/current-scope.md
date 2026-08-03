# Текущий охват — Хаб обращений (v0.1 прототип)

**Дата инвентаризации:** 03.08.2026  
**Метод:** анализ кода, статическая проверка, локальный HTTP-сервер (curl), без изменений production-кода.

---

## Тип проекта

| Параметр | Значение |
|---|---|
| Тип | Статический SPA (HTML + CSS + JS, без сборки) |
| `package.json` | Отсутствует |
| Сборка | Не требуется — открытие `index.html` или GitHub Pages |
| CI/CD | `.github/workflows/static.yml` — деплой всего репозитория на GitHub Pages |
| Документированный URL | `README.md`: локально `index.html` |
| Production URL (проверен curl) | `https://appealhub.mararx.com/` → HTTP 200 |
| GitHub Pages (remote) | `https://github.com/linamarar/appeal-hub` → `https://linamarar.github.io/appeal-hub/` (301) |

---

## Маршрутизация (`parseRoute` в `scripts/app.js`)

| Hash-маршрут | View ID | Страница | Обработчик |
|---|---|---|---|
| `#/appeals` (default) | `dashboard` | Список обращений | `renderTable()` |
| `#/` / пустой hash | `dashboard` | → редирект на `#/appeals` при загрузке | `DOMContentLoaded` |
| `#/appeals/:id` | `appeal-detail` | Карточка обращения | `AppealDetailPage.load(id)` |
| `#/clients` | `clients` | Список клиентов | `ClientsPage.load()` |
| `#/clients/:id` | `client-detail` | Карточка клиента | `ClientDetailPage.load(id)` |
| `#/templates` | `templates` | Шаблоны | `TemplatesPage.load()` |
| `#/analytics` | `analytics` | Аналитика (mock) | `AnalyticsPage.load()` |
| `#/settings` | `settings` | Каталог настроек | `SettingsPage.load()` |
| `#/settings/:slug` | `settings-detail` | Заглушка подраздела | `SettingsPage.loadDetail(slug)` |
| `#/flow` | `flow` | Legacy: создание обращения | `initFlow()`, AI-симуляция |
| Неизвестный hash | `dashboard` | Fallback без 404-экрана | `parseRoute()` default |

---

## Views / секции в `index.html`

| View | ID | Статус |
|---|---|---|
| Список обращений | `#view-dashboard` | Реализован |
| Flow создания | `#view-flow` | Реализован (legacy) |
| Карточка обращения | `#view-appeal-detail` | Реализован |
| Клиенты | `#view-clients` | Mock |
| Карточка клиента | `#view-client-detail` | Mock |
| Шаблоны | `#view-templates` | Mock |
| Аналитика | `#view-analytics` | Mock |
| Настройки | `#view-settings` | Mock-каталог |
| Детали настроек | `#view-settings-detail` | Заглушка |

---

## Функциональные возможности

### Список обращений
- Загрузка из `AppealsRepository` (14 mock-записей)
- Поиск по номеру, теме, клиенту, исполнителю (`filterAppealsList`)
- Фильтры: статус (3 значения UI), приоритет, «Не назначен»
- Drawer фильтров (мобильный)
- Состояния: loading / empty / loaded
- Клик по строке → карточка
- **NOT IMPLEMENTED:** пагинация (статическая вёрстка)
- **NOT IMPLEMENTED:** KPI/дашборд на странице списка (README упоминает «показатели»)

### Карточка обращения (`scripts/appeal-detail.js`)
- Поля: описание, клиент, SLA, исполнитель, вложения, история
- Смена статуса (`AppealsService.changeStatus` + матрица `STATUS_TRANSITIONS`)
- Назначение / переназначение (модалка)
- Принятие в работу (`acceptAppeal`)
- Внутренние комментарии + вложения (`AttachmentValidator`)
- **NOT IMPLEMENTED:** просмотр вложений (кнопки disabled)

### SLA (`scripts/services/sla-service.js`)
- Состояния: ON_TRACK, AT_RISK (≤20% времени), OVERDUE, PAUSED
- Отображение в списке и карточке

### Права (`scripts/services/permissions.js`)
- Mock-пользователь: Администратор (`user-admin`) со всеми правами
- Проверки: accept, changeStatus, assign, reassign, comments, attachments, client.*

### Mock-разделы

| Раздел | Repository | Записей | CRUD |
|---|---|---|---|
| Клиенты | `clients-mock.js` | 9 | Read + фильтры |
| Шаблоны | `templates-mock.js` | 6+6 | Read + вкладки |
| Аналитика | `analytics-mock.js` | 3 периода | Read only |
| Настройки | `settings-mock.js` | 15 секций | Read + заглушки |

---

## Mock repositories

| Файл | Назначение |
|---|---|
| `scripts/data/appeals-repository.js` | In-memory обращения, сообщения, вложения |
| `scripts/data/clients-mock.js` | Клиенты, документы, история |
| `scripts/data/templates-mock.js` | Шаблоны ответов и документов |
| `scripts/data/analytics-mock.js` | KPI, графики (CSS bars) |
| `scripts/data/settings-mock.js` | Каталог админ-разделов |
| `scripts/data/users-mock.js` | Исполнители + CURRENT_USER |
| `scripts/data/status-catalog.js` | 9 статусов + матрица переходов |
| `scripts/data/message-constants.js` | Типы сообщений, лимиты вложений |

---

## Статусы и переходы

9 кодов: `NEW`, `SYSTEM_REVIEW`, `ASSIGNED`, `IN_PROGRESS`, `WAITING_SPECIALIST`, `WAITING_CLIENT`, `RESPONSE_SENT`, `CLOSED`, `REOPENED`.

Матрица — `STATUS_TRANSITIONS` в `status-catalog.js`. Подробнее: `docs/status-transition-matrix.md`.

---

## Shell / responsive

- Sidebar collapse (desktop, localStorage)
- Mobile sidebar overlay при `max-width: 1024px`
- Breakpoints в CSS: **1280px**, **1024px**, **768px** (1440px — **NOT IMPLEMENTED**)

---

## Ассеты

| Путь | Статус |
|---|---|
| `assets/logo-fsk.png` | OK (HTTP 200) |
| `styles/**/*.css` | OK |
| `scripts/**/*.js` | OK (`node --check` — все 20 файлов) |
| Абсолютные локальные пути | Не найдены |

---

## Автотесты

**NOT IMPLEMENTED** — test framework, spec-файлы и npm scripts отсутствуют.

---

## Ограничения прототипа (не дефекты)

- Нет backend/API
- Нет chart library (CSS bars)
- CRUD шаблонов/настроек — заглушки
- Уведомления — UI без логики
- Данные сессионные (in-memory, сброс при перезагрузке частично сохраняется через flow)
