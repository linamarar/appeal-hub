# План регрессионного тестирования — Хаб обращений

**Версия:** v0.1 прототип  
**Дата:** 03.08.2026  
**Ограничение:** без изменений production-кода; документирование дефектов only.

---

## 1. Цели

- Подтвердить работоспособность hash-маршрутизации и основных user flows
- Проверить mock-разделы на соответствие коду
- Выявить регрессии в списке обращений, карточке, SLA, назначениях
- Оценить готовность к демо (GitHub Pages / custom domain)

---

## 2. Область тестирования

| In scope | Out of scope |
|---|---|
| Статический фронтенд | Backend, API, БД |
| Hash routes | E2E в CI |
| Mock data / repositories | Установка npm-зависимостей |
| A11y (HTML + JS handlers) | Полный аудит WCAG |
| Responsive (CSS review) | Visual pixel-perfect vs Figma |
| `node --check` всех JS | Исправление найденных багов |

---

## 3. Окружение

| Параметр | Значение |
|---|---|
| Локально | `python3 -m http.server 8765` из корня репозитория |
| Браузер | Не использовался автоматически; curl + code review |
| Production smoke | `curl` → `https://appealhub.mararx.com/` |
| Node | `node --check scripts/**/*.js` |

---

## 4. Критерии приоритетов дефектов

| Приоритет | Описание |
|---|---|
| **P0** | Блокер: приложение не загружается, критический маршрут недоступен |
| **P1** | Основной flow сломан (список, карточка, навигация) |
| **P2** | Функция частично работает или данные некорректны |
| **P3** | UX, a11y, документация, косметика |

---

## 5. Тест-кейсы

### 5.1 Setup / Build (BLD)

| ID | Кейс | Ожидание |
|---|---|---|
| BLD-01 | Отсутствие `package.json` | Статический сайт, без сборки |
| BLD-02 | `node --check` всех JS | Exit 0, синтаксис OK |
| BLD-03 | `index.html` загружается | HTTP 200 |
| BLD-04 | CSS/JS пути относительные | HTTP 200 для `styles/main.css`, `scripts/app.js` |
| BLD-05 | `assets/logo-fsk.png` | HTTP 200 |
| BLD-06 | Нет абсолютных локальных путей | grep — пусто |

### 5.2 Маршрутизация (RT)

| ID | Кейс | Ожидание |
|---|---|---|
| RT-01 | `#/appeals` | View dashboard, таблица |
| RT-02 | `#/` / пустой hash | → `#/appeals` |
| RT-03 | `#/appeals/AH-2026-01847` | Карточка загружена |
| RT-04 | `#/appeals/UNKNOWN` | Empty state «не найдено» |
| RT-05 | `#/clients` | Список 9 клиентов |
| RT-06 | `#/clients/CL-001` | Карточка клиента |
| RT-07 | `#/clients/UNKNOWN` | Not found |
| RT-08 | `#/templates` | Таблица шаблонов |
| RT-09 | `#/analytics` | KPI mock |
| RT-10 | `#/settings` | Каталог 15 секций |
| RT-11 | `#/settings/priorities` | Заглушка detail |
| RT-12 | `#/settings/unknown-slug` | «Раздел не найден» |
| RT-13 | `#/flow` | Flow создания |
| RT-14 | `#/unknown-path` | Fallback → dashboard |
| RT-15 | Production URL | HTTP 200 |

### 5.3 Список обращений (APL)

| ID | Кейс | Ожидание |
|---|---|---|
| APL-01 | Загрузка списка | 14 записей в repository |
| APL-02 | Поиск по ID | Фильтрация |
| APL-03 | Фильтр статус «Новая» | Только NEW |
| APL-04 | Фильтр приоритет | По exact match |
| APL-05 | Фильтр «Не назначен» | Без assigneeId |
| APL-06 | Сброс фильтров | Полный список |
| APL-07 | Drawer фильтров | Sync + close Escape |
| APL-08 | Refresh | Loading → reload |
| APL-09 | Клик строки | Navigate detail |
| APL-10 | Пагинация | NOT IMPLEMENTED — статика |
| APL-11 | KPI дашборд | NOT IMPLEMENTED |

### 5.4 Карточка обращения (APD)

| ID | Кейс | Ожидание |
|---|---|---|
| APD-01 | Отображение полей | title, client, SLA, history |
| APD-02 | Назначение исполнителя | NEW → ASSIGNED |
| APD-03 | Переназначение + причина | History event |
| APD-04 | Принять в работу | ASSIGNED → IN_PROGRESS |
| APD-05 | Смена статуса | По матрице |
| APD-06 | Недопустимый переход | Error message |
| APD-07 | Комментарий | Timeline update |
| APD-08 | Вложение в комментарии | Validation limits |
| APD-09 | Просмотр вложений | NOT IMPLEMENTED (disabled) |
| APD-10 | Not found ID | Empty state |

### 5.5 SLA / Статусы (SLA)

| ID | Кейс | Ожидание |
|---|---|---|
| SLA-01 | ON_TRACK | label «В срок» |
| SLA-02 | AT_RISK | ≤20% оставшегося времени |
| SLA-03 | OVERDUE | dueAt < now |
| SLA-04 | PAUSED | slaState === PAUSED |
| SLA-05 | Матрица переходов | Соответствует status-catalog |

### 5.6 Mock-разделы (MCK)

| ID | Кейс | Ожидание |
|---|---|---|
| MCK-01 | Clients search | Фильтрация |
| MCK-02 | Clients type filter | По clientType |
| MCK-03 | Client detail tabs | appeals/docs/history |
| MCK-04 | Templates tabs | responses/documents |
| MCK-05 | Templates search | Filter by name |
| MCK-06 | Analytics periods | 7d/30d/quarter |
| MCK-07 | Settings PLANNED | disabled |
| MCK-08 | Settings MOCK/AVAILABLE | Navigate detail stub |
| MCK-09 | Create template btn | disabled + tooltip |

### 5.7 Flow (FLW)

| ID | Кейс | Ожидание |
|---|---|---|
| FLW-01 | Upload file | Preview step |
| FLW-02 | AI simulation | Step 2 → 3 |
| FLW-03 | Create appeal | addAppealFromFlow |
| FLW-04 | Discard draft | confirm on navigate away |
| FLW-05 | Open created card | Dynamic appeal ID |

### 5.8 Shell / Responsive (SHL)

| ID | Кейс | Ожидание |
|---|---|---|
| SHL-01 | Sidebar collapse desktop | localStorage |
| SHL-02 | Mobile menu ≤1024px | Overlay + Escape |
| SHL-03 | Breakpoint 1280px | appeals-list.css |
| SHL-04 | Breakpoint 1024px | shell.css |
| SHL-05 | Breakpoint 1440px | NOT IMPLEMENTED |
| SHL-06 | Nav active states | Correct highlight |

### 5.9 Accessibility (A11Y)

| ID | Кейс | Ожидание |
|---|---|---|
| A11Y-01 | Sidebar aria-label | Present |
| A11Y-02 | Modal aria-labelledby | assign-modal |
| A11Y-03 | Drawer Escape | Closes |
| A11Y-04 | Modal Escape | Expected close |
| A11Y-05 | Search aria-label | appeals-search |
| A11Y-06 | Tabs aria-selected | templates |
| A11Y-07 | Pagination aria-label | Present |
| A11Y-08 | Focus trap in modal | Expected trap |

### 5.10 Static analysis (STA)

| ID | Кейс | Ожидание |
|---|---|---|
| STA-01 | console.error в scripts | Не найдено |
| STA-02 | Undefined globals | Script order OK (no modules) |
| STA-03 | 404-prone assets | Все ссылки в index.html OK |

---

## 6. Критерии входа / выхода

**Вход:** актуальная ветка master, docs/testing/ пустая или обновляемая.

**Выход:**
- Все P0/P1 задокументированы
- regression-results.md заполнен
- release-readiness.md с вердиктом

---

## 7. Роли и метод

| Активность | Метод |
|---|---|
| Маршруты | Code analysis + curl index |
| UI flows | Code analysis (browser N/A в автоматическом прогоне) |
| A11y | HTML/JS grep |
| Responsive | CSS @media review |

**Ограничение:** без headless browser — runtime UI не верифицирован визуально; отмечено в results.
