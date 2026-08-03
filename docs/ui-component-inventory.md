# UI-компоненты тестовой версии

> **Важно:** в прототипе **нет отдельных component-файлов**. Все UI-элементы реализованы как CSS-классы в `styles/main.css` и HTML-разметка в `index.html`. JS-генерация — через template strings в `scripts/app.js`.

## Сводная таблица по чеклисту

| Компонент | Найден | Путь / класс | Рекомендация |
|---|---|---|---|
| Button | ✅ | `.btn`, `.btn--primary`, `.btn--secondary` | Заменить |
| Input | ✅ Partial | `.search input` | Заменить |
| Textarea | ❌ | — | — |
| Select | ✅ | `.select` | Заменить |
| Checkbox | ❌ | — | — |
| Radio | ❌ | — | — |
| Switch | ❌ | — | — |
| Badge | ✅ | `.badge`, `.badge--*` | Переработать |
| Tag | ❌ | — | — |
| Status | ✅ Partial | Badge используется как status | Переработать |
| Table | ✅ | `.table`, `.table-wrap` | Переработать |
| Tabs | ❌ | — | — |
| Modal | ❌ | — | — |
| Drawer | ❌ | — | — |
| Tooltip | ❌ | — | — |
| Dropdown | ❌ | — | — |
| DatePicker | ❌ | — | — |
| FileUploader | ✅ Partial | `.upload-zone`, `#file-input` | Переработать |
| Avatar | ❌ | — | — |
| Card | ✅ Partial | `.stat-card`, `.appeal-card`, `.panel` | Переработать |
| Alert | ✅ Partial | `.success-banner` | Переработать |
| Toast | ❌ | — | — |
| Pagination | ❌ | — | — |
| Breadcrumbs | ❌ | — | — |
| Sidebar | ✅ | `.sidebar`, `.nav-item` | Заменить |
| Header | ✅ | `.page-header` | Переработать |
| EmptyState | ❌ | — | — |
| Skeleton | ❌ | — | — |
| Loader | ✅ Partial | `.ai-log__spinner` | Заменить |

---

## Button

- **Путь:** `styles/main.css` (`.btn`, `.btn--primary`, `.btn--secondary`); `index.html` (multiple instances)
- **Варианты:** primary (dark bg), secondary (white bg + border)
- **Места использования:** dashboard CTA, flow actions, appeal detail actions, upload, table links (`.table__link` — отдельный pattern)
- **Зависимости:** inline SVG icons в HTML
- **Проблемы:** нет states (disabled, loading, hover only via CSS); нет size variants; нет icon-only; hardcoded colors
- **Адаптация под Figma:** низкая — Figma Button имеет Type×Size×State×Icon matrix
- **Рекомендация:** **Заменить**

## Input

- **Путь:** `styles/main.css` (`.search input`); `index.html` (dashboard search)
- **Варианты:** один — text input внутри `.search` wrapper с icon
- **Места использования:** dashboard panel header
- **Зависимости:** `.search` wrapper
- **Проблемы:** не переиспользуемый standalone input; нет label, error, disabled states; search не functional
- **Адаптация под Figma:** низкая
- **Рекомендация:** **Заменить**

## Select

- **Путь:** `styles/main.css` (`.select`); `index.html` (dashboard)
- **Варианты:** native `<select>` с 4 options
- **Места использования:** dashboard filter
- **Зависимости:** none
- **Проблемы:** native styling only; no custom dropdown; filter non-functional
- **Адаптация под Figma:** низкая — Figma имеет custom Select component
- **Рекомендация:** **Заменить**

## Badge / Status

- **Путь:** `styles/main.css` (`.badge`, `.badge--success`, `.badge--warning`, `.badge--neutral`, `.badge--ai`); `scripts/app.js` (`getStatusBadge`, `getAiBadge`)
- **Варианты:** success (green), warning (amber), neutral (gray), ai (blue)
- **Места использования:** table (status + AI status), appeal card, detail sidebar
- **Зависимости:** JS mapping functions
- **Проблемы:** pill shape hardcoded; colors не из design tokens; нет всех status types
- **Адаптация под Figma:** partial — концепция совпадает, стили — нет
- **Рекомендация:** **Переработать**

## Table

- **Путь:** `styles/main.css` (`.table`, `.table-wrap`, `.table__id`, `.table__link`); `scripts/app.js` (`renderTable`)
- **Варианты:** single style, hover on rows
- **Места использования:** dashboard
- **Зависимости:** `renderTable()`, `appeals` data
- **Проблемы:** no sorting, pagination, selection, empty state; click handler на `<tr>` без data binding
- **Адаптация под Figma:** partial — Figma Kit не имеет dedicated admin Table (domain-specific lists exist)
- **Рекомендация:** **Переработать**

## Sidebar

- **Путь:** `styles/main.css` (`.sidebar`, `.nav-item`, `.sidebar__brand`, etc.); `index.html`
- **Варианты:** active/inactive nav item; footer indicator
- **Места использования:** global layout
- **Зависимости:** `switchView()`, `data-view` attributes
- **Проблемы:** hidden on mobile without alternative; hardcoded 260px width; custom logo «AH»
- **Адаптация под Figma:** низкая — использовать Figma «Навигация» / «Таббар»
- **Рекомендация:** **Заменить**

## Header (Page Header)

- **Путь:** `styles/main.css` (`.page-header`, `.page-header__desc`, `.page-header__actions`, `.back-link`)
- **Варианты:** with/without back link; with action buttons
- **Места использования:** all 3 views
- **Зависимости:** none
- **Проблемы:** not reusable component; hardcoded titles
- **Адаптация под Figma:** partial — Figma «Header FSK» exists but domain-branded
- **Рекомендация:** **Переработать**

## Card (composite)

### stat-card
- **Путь:** `styles/main.css` (`.stat-card`); `index.html` (dashboard, 4 cards)
- **Варианты:** with change indicator (`.stat-card__change--up`)
- **Места использования:** dashboard stats grid
- **Проблемы:** static values; not data-driven
- **Рекомендация:** **Переработать**

### appeal-card
- **Путь:** `styles/main.css` (`.appeal-card`); `scripts/app.js` (`renderAppealCard`)
- **Варианты:** default, `--full` modifier
- **Места использования:** flow step 3, appeal detail
- **Проблемы:** innerHTML rendering; always same data
- **Рекомендация:** **Переработать**

### panel
- **Путь:** `styles/main.css` (`.panel`, `.panel__header`, `.panel__actions`)
- **Варианты:** container with header + body
- **Места использования:** dashboard table wrapper, appeal text, AI sidebar, history
- **Рекомендация:** **Сохранить** concept, **переработать** styling

## FileUploader (Upload Zone)

- **Путь:** `styles/main.css` (`.upload-zone`, `.upload-zone--dragover`, `.incoming-preview`); `scripts/app.js` (`initFlow`)
- **Варианты:** empty zone, dragover state, file preview
- **Места использования:** flow step 1
- **Зависимости:** `#file-input`, drag events
- **Проблемы:** file content not read; always shows same mock document
- **Адаптация под Figma:** partial — Figma «Upload input» component exists
- **Рекомендация:** **Переработать**

## Alert (Success Banner)

- **Путь:** `styles/main.css` (`.success-banner`); `index.html` (flow step 3)
- **Варианты:** success only
- **Места использования:** flow completion
- **Проблемы:** no error/warning/info variants; not dismissible
- **Рекомендация:** **Переработать**

## Loader (Spinner)

- **Путь:** `styles/main.css` (`.ai-log__spinner`, `@keyframes spin`); used in AI log
- **Варианты:** CSS spinner only
- **Места использования:** AI processing log
- **Проблемы:** not reusable; no size variants; Figma Button has Loading state with own indicator
- **Рекомендация:** **Заменить**

## Flow Steps (Stepper)

- **Путь:** `styles/main.css` (`.flow-steps`, `.flow-step`, `.flow-step--done`, `.flow-step--active`); `scripts/app.js` (`setFlowStep`)
- **Варианты:** pending, active, done
- **Места использования:** flow view
- **Проблемы:** custom component, no Figma direct match
- **Рекомендация:** **Переработать** (возможно custom on Figma tokens)

## Timeline

- **Путь:** `styles/main.css` (`.timeline`, `.timeline__item`); `index.html` (appeal detail sidebar)
- **Варианты:** static list
- **Места использования:** history panel
- **Проблемы:** hardcoded 3 events; not dynamic
- **Рекомендация:** **Переработать**

## AI-specific components

### ai-badge
- **Путь:** `.ai-badge`, `.ai-badge__pulse`
- **Места использования:** AI processing header
- **Рекомендация:** **Переработать** (domain-specific, нет в Figma Kit)

### ai-log
- **Путь:** `.ai-log`, `.ai-log__item`, `.ai-log__check`
- **Места использования:** AI processing step
- **Рекомендация:** **Сохранить** concept, **переработать** styling

### doc-preview
- **Путь:** `.doc-preview`, `.pii`, `.redacted`
- **Места использования:** flow steps 1-2
- **Рекомендация:** **Сохранить** concept (Appeal Hub specific)

## Meta List

- **Путь:** `.meta-list`, `.meta-list__item`, `.meta-list__label`
- **Места использования:** AI processing sidebar on detail page
- **Рекомендация:** **Переработать**

## Domain-specific / Layout helpers

| Pattern | Классы | Рекомендация |
|---|---|---|
| Stats grid | `.stats-grid` | Переработать |
| Detail grid | `.detail-grid`, `.detail-sidebar` | Сохранить layout concept |
| Processing grid | `.processing-grid` | Сохранить (Appeal Hub specific) |
| Flow actions | `.flow-actions` | Переработать |
| Flow indicator | `.flow-indicator` (sidebar footer) | Переработать |

## Отсутствующие компоненты (не реализованы в прототипе)

Textarea, Checkbox, Radio, Switch, Tag, Tabs, Modal, Drawer, Tooltip, Dropdown, DatePicker, Avatar, Toast, Pagination, Breadcrumbs, EmptyState, Skeleton — **отсутствуют**, потребуется реализация из Figma Kit при разработке полного продукта.
