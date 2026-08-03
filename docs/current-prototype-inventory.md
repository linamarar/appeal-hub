# Инвентаризация тестовой версии

## Реализованные маршруты

Маршрутизация **не URL-based**. Переключение через `switchView(viewId)`:

| View ID | Способ доступа | Аналог маршрута |
|---|---|---|
| `dashboard` | Sidebar «Дашборд», кнопки «Назад», «Перейти на дашборд» | `/` (условно) |
| `flow` | Sidebar «Новое обращение», кнопка «Загрузить обращение» | `/appeals/new` (условно) |
| `appeal-detail` | Sidebar «Карточка обращения», клик по строке таблицы, «Открыть карточку» | `/appeals/:id` (условно) |

History API, hash routing, query params — **не используются**.

## Реализованные экраны

### 1. Дашборд

| Параметр | Значение |
|---|---|
| View ID | `dashboard` |
| Основной компонент | `<section id="view-dashboard">` в `index.html` |
| Дочерние блоки | `.page-header`, `.stats-grid` (4× `.stat-card`), `.panel` с `.search`, `.select`, `.table` |
| Источник данных | Mock: массив `appeals` в `app.js`; статистика — захардкожена в HTML |
| Действия пользователя | Перейти к созданию обращения; клик по строке → карточка; клик «Открыть» → карточка |
| Реализованные состояния | Таблица с данными; hover на строках |
| Отсутствующие состояния | Empty state; loading; error; pagination; работающий поиск; работающий фильтр; сортировка |
| Готовность | **Partial** |
| Проблемы | Статистика не связана с данными; поиск/фильтр декоративны; всегда 6 строк (+1 после flow) |

### 2. Новое обращение (Flow)

| Параметр | Значение |
|---|---|
| View ID | `flow` |
| Основной компонент | `<section id="view-flow">` |
| Дочерние блоки | `.flow-steps`, 3× `.flow-panel` (upload, AI processing, success) |
| Источник данных | Статический HTML для preview документа; `appealCardData` для финальной карточки |
| Действия | Выбор файла (click/drag-drop) → preview → «Передать на AI-обработку» → auto steps → навигация |
| Реализованные состояния | Step 1 (upload zone / file preview); Step 2 (AI processing animation); Step 3 (success + card) |
| Отсутствующие состояния | Error upload; invalid file type feedback; cancel; re-upload; real OCR |
| Готовность | **Partial** (основной happy-path работает) |
| Проблемы | Файл не читается — всегда один mock PDF; drag-drop не проверяет тип; AI — setTimeout simulation |

### 3. Карточка обращения

| Параметр | Значение |
|---|---|
| View ID | `appeal-detail` |
| Основной компонент | `<section id="view-appeal-detail">` |
| Дочерние блоки | `.page-header` (back link, actions), `.detail-grid` (`.appeal-card--full`, `.panel` с текстом, sidebar: AI meta + timeline) |
| Источник данных | Всегда `appealCardData` (AH-2026-01847); текст обращения — static HTML |
| Действия | «Назад к дашборду»; «Экспорт» и «Назначить ответственного» — без handlers |
| Реализованные состояния | Static detail view |
| Отсутствующие состояния | Dynamic по ID; edit; comments; attachments; status change; assignee; loading/error |
| Готовность | **Prototype** |
| Проблемы | Не реагирует на выбранную строку таблицы; action buttons — заглушки |

## Реализованные сценарии

| Сценарий | Статус | Детали |
|---|---|---|
| Просмотр списка обращений | ✅ Работает | `renderTable()` при DOMContentLoaded |
| Переход между экранами | ✅ Работает | `switchView()` + nav handlers |
| Загрузка документа (UI) | ✅ Partial | Показывает preview, но не читает файл |
| AI-обработка документа | ⚠️ Имитация | `simulateAIProcessing()` — таймеры + DOM updates |
| Создание карточки из документа | ⚠️ Имитация | Рендер `appealCardData`, добавление в таблицу (1 раз) |
| Просмотр карточки обращения | ⚠️ Partial | Только одно фиксированное обращение |
| Поиск обращений | ❌ Не работает | Input без event listener |
| Фильтрация по статусу | ❌ Не работает | Select без event listener |
| Назначение ответственного | ❌ Не работает | Кнопка без handler |
| Экспорт | ❌ Не работает | Кнопка без handler |

## Реализованные сущности

| Сущность | Реализовано | Где |
|---|---|---|
| Обращение (Appeal) | ✅ Partial | `appeals[]`, `appealCardData` — поля: id, date, time, title, category, aiStatus, status, priority, source, region |
| Клиент | ❌ | Перс. данные только в static HTML preview документа, не как сущность |
| Исполнитель | ❌ | Кнопка «Назначить ответственного» без логики |
| Документ/вложение | ⚠️ UI only | Upload zone + static preview |
| AI-обработка | ⚠️ Simulation | Log items + PII masking visualization |

## Реализованная бизнес-логика

| Функция | Статус |
|---|---|
| Сущность обращения | ✅ Реализовано (mock schema) |
| Сущность клиента | ❌ Отсутствует |
| Статусы обращения | ✅ Имитация (Новое, В работе, Закрыто — только display) |
| Переходы между статусами | ❌ Отсутствует |
| Назначение исполнителя | ❌ Отсутствует (UI button only) |
| Переназначение | ❌ Отсутствует |
| Делегирование | ❌ Отсутствует |
| SLA | ❌ Отсутствует |
| Приоритеты | ⚠️ Только display в карточке (`priority: 'Средний'`) |
| Комментарии | ❌ Отсутствует |
| Вложения | ⚠️ Только upload UI, без хранения |
| История действий | ⚠️ Static timeline (3 hardcoded events) |
| Шаблоны ответов | ❌ Отсутствует |
| Отправка ответа | ❌ Отсутствует |
| Клиентская обратная связь | ❌ Отсутствует |
| Повторное открытие | ❌ Отсутствует |
| Автоматическое закрытие | ❌ Отсутствует |
| Роли | ❌ Отсутствует |
| Права доступа | ❌ Отсутствует |
| Аудит | ❌ Отсутствует |
| Аналитические события | ❌ Отсутствует |
| AI PII masking | ⚠️ Только визуальная имитация в flow step 2 |
| AI OCR/extraction | ⚠️ Только имитация через setTimeout |

## Mock-данные

**Файл:** `scripts/app.js`

**`appeals`** — 6 записей с полями: `id`, `date`, `time`, `title`, `category`, `aiStatus`, `status`, optional `isNew`.

**`appealCardData`** — одна запись AH-2026-01847 с расширенными полями: `priority`, `source`, `region`.

**Hardcoded в HTML:**
- Dashboard stats: 247, 231, 1.8 мин, 100%
- Document preview content (ФИО, адрес, телефон, email, паспорт)
- Appeal text на странице detail
- Timeline events (12:14, 12:13, 12:12)
- AI metadata (1 мин 24 сек, 97.3% confidence)

## Проверка целевых разделов продукта

| Раздел | Статус |
|---|---|
| Дашборд | ✅ Есть (Partial) |
| Список обращений | ✅ Есть (таблица на дашборде) |
| Карточка обращения | ✅ Есть (Prototype) |
| Создание обращения | ✅ Есть (flow, Partial) |
| Карточка клиента | ❌ Отсутствует |
| Клиентский кабинет | ❌ Отсутствует |
| Административные разделы | ❌ Отсутствует |
| Аналитика | ⚠️ Только 4 stat cards (static) |
| Шаблоны ответов | ❌ Отсутствует |
| Шаблоны документов | ❌ Отсутствует |
| Уведомления | ❌ Отсутствует |
| Настройки пользователей и ролей | ❌ Отсутствует |

## Неработающие или неполные части

1. Поиск и фильтр на дашборде.
2. Кнопки «Экспорт», «Назначить ответственного».
3. Dynamic binding карточки к выбранному обращению.
4. Чтение и валидация загружаемого файла.
5. Реальная AI-обработка.
6. Sidebar navigation на mobile (sidebar скрыт, нет hamburger menu).
7. Dashboard statistics vs table data inconsistency.
8. Повторное прохождение flow (reset работает частично — `isNew` flag блокирует повторное добавление).

## Что можно сохранить

| Элемент | Причина |
|---|---|
| User flow: upload → AI → card → dashboard | Хорошо проработанный UX-сценарий для demo |
| Data schema обращения | Поля пригодны как основа API contract |
| Mock-данные `appeals` | Seed data для dev/staging |
| Screen structure (3 экрана) | Каркас IA продукта |
| AI processing visualization | Концепция PII masking UI (переработать под Figma) |
| Responsive breakpoints logic | Базовая идея адаптива (пересмотреть mobile nav) |
| `simulateAIProcessing` step machine | Паттерн multi-step flow (переписать на framework) |

## Что требует переработки

| Элемент | Причина |
|---|---|
| Весь CSS (`main.css`) | Другой шрифт, palette, component specs vs Figma Kit |
| HTML structure | Monolith → component-based architecture |
| `app.js` | Monolith → modules/services/stores |
| View switching | → proper routing with URL params |
| Table + search + filter | → data-driven components from Figma Kit |
| Upload/File handling | → real file API + validation + Figma Upload input |
| Appeal detail | → dynamic, editable, with full entity relations |
| Icons | Inline SVG → Figma icon set from Assets page |
| Badge/Status system | → Figma component variants |
| Sidebar/Navigation | → Figma «Навигация» / «Таббар» components |
