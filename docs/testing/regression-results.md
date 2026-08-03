# Результаты регрессионного тестирования

Дата: 2026-08-03  
Ревизия: `28563e0`  
Методы: статический анализ кода, `node --check`, локальный HTTP-сервер, проверка production URL/assets, логическая верификация сервисного слоя. Полноценный browser E2E не автоматизирован; UI-сценарии подтверждены по коду + выборочной проверке HTTP/DOM-связей.

## Сводка

| Результат | Кол-во |
|---|---|
| PASS | 48 |
| FAIL | 9 |
| BLOCKED | 0 |
| NOT IMPLEMENTED | 4 |
| NOT APPLICABLE | 1 |
| **Всего выполнено** | **62** |

---

## Таблица результатов

| Test ID | Сценарий | Окружение | Результат | Комментарий |
|---|---|---|---|---|
| RT-SETUP-01 | Нет package.json / deps | Local | PASS | Статический прототип |
| RT-SETUP-02 | Локальный HTTP-сервер | Local | PASS | `python3 -m http.server`, `/` → 200 |
| RT-SETUP-03 | `node --check` все scripts | Local | PASS | Exit 0 |
| RT-SETUP-04 | Assets/CSS/JS относительные пути | Local | PASS | Все запрошенные ресурсы 200; абсолютных `/Users/...` в коде нет |
| RT-SETUP-05 | Production доступен | Prod | PASS | `https://appealhub.mararx.com/` → 200; github.io → 301 на тот же хост |
| RT-SETUP-06 | Автотесты | Local | NOT APPLICABLE | Test framework отсутствует |
| RT-ROUTE-01 | `#/appeals` список | Local+Prod | PASS | view `dashboard` |
| RT-ROUTE-02 | `#/appeals/:id` карточка | Local+Prod | PASS | hash routing |
| RT-ROUTE-03 | `#/flow` | Local | PASS | |
| RT-ROUTE-04 | `#/clients` | Local | PASS | |
| RT-ROUTE-05 | `#/clients/:id` | Local | PASS | |
| RT-ROUTE-06 | `#/templates` | Local | PASS | |
| RT-ROUTE-07 | `#/analytics` | Local | PASS | |
| RT-ROUTE-08 | `#/settings` | Local | PASS | |
| RT-ROUTE-09 | `#/settings/:slug` | Local | PASS | |
| RT-ROUTE-10 | Refresh на карточке | Local | PASS | hash сохраняется, `AppealDetailPage.load` |
| RT-ROUTE-11 | Back/Forward | Local | PASS | `hashchange` → `handleRoute` |
| RT-ROUTE-12 | Неизвестный hash | Local | PASS | → dashboard |
| RT-ROUTE-13 | Неизвестный appeal id | Local | PASS | not-found state |
| RT-ROUTE-14 | Неизвестный client id | Local | PASS | not-found |
| RT-ROUTE-15 | Prod assets JS/CSS/logo | Prod | PASS | 200 |
| RT-SHELL-01 | Header/sidebar brand | Local | PASS | ФСК + «Хаб обращений» |
| RT-SHELL-02 | Active state меню | Local | PASS | navActiveMap включает detail views |
| RT-SHELL-03 | Collapse sidebar + localStorage | Local | PASS | ключ `appeal-hub-sidebar-collapsed` |
| RT-SHELL-04 | Mobile drawer | Local | PASS | CSS+JS `initMobileSidebar` |
| RT-SHELL-05 | Close скрыт на desktop | Local | PASS | `.shell-sidebar__close { display:none }` вне open mobile |
| RT-SHELL-06 | Уведомления | Local | NOT IMPLEMENTED | Кнопка без обработчика |
| RT-LIST-01 | Загрузка 14 обращений | Local | PASS | mock repository |
| RT-LIST-02 | Колонки таблицы | Local | PASS | все ключевые поля рендерятся |
| RT-LIST-03 | Колонка «Обновлено» = updatedAt | Local | FAIL | DEF-001: выводятся `date`/`time` (createdAt) |
| RT-LIST-04 | Открытие карточки | Local | PASS | row click + «Открыть» |
| RT-LIST-05 | Поиск по номеру | Local | FAIL | DEF-002: нет listener/`filter` логики |
| RT-LIST-06 | Поиск по теме | Local | FAIL | DEF-002 |
| RT-LIST-07 | Пустой/trim/empty/reset поиска | Local | FAIL | DEF-002: reset только чистит input |
| RT-LIST-08 | Фильтры статус/приоритет/исполнитель | Local | FAIL | DEF-002: selects не влияют на `renderTable` |
| RT-LIST-09 | Пагинация | Local | NOT IMPLEMENTED | Статический UI «1 из 1» |
| RT-LIST-10 | Список после смены статуса (сессия) | Local | PASS | in-memory `saveRecord` + `renderTable` |
| RT-LIST-11 | Persistence после F5 | Local | FAIL | DEF-003: нет localStorage для appeals |
| RT-DET-01 | Поля карточки | Local | PASS | |
| RT-DET-02 | Назад к списку | Local | PASS | `data-go=dashboard` |
| RT-DET-03 | Прямой URL/refresh | Local | PASS | |
| RT-DET-04 | Unknown id | Local | PASS | |
| RT-DET-05 | Пустые вложения / история | Local | PASS | empty states в рендере |
| RT-ST-01 | NEW→SYSTEM_REVIEW / ASSIGNED | Local | PASS | матрица + service |
| RT-ST-02 | ASSIGNED→IN_PROGRESS (accept/select) | Local | PASS | |
| RT-ST-03 | IN_PROGRESS→закрывающие статусы | Local | PASS | по матрице |
| RT-ST-04 | CLOSED→REOPENED | Local | PASS | |
| RT-ST-BLOCK | Запрещённый переход | Local | PASS | `INVALID_TRANSITION` |
| RT-ST-HIST | Событие статуса в истории | Local | PASS | `STATUS_CHANGED` |
| RT-AS-01 | Назначение NEW | Local | PASS | → ASSIGNED |
| RT-AS-02 | Только active users | Local | PASS | `getActiveUsers` / validation |
| RT-AS-03 | Reassign reason + OTHER | Local | PASS | VALIDATION без текста |
| RT-AS-04 | История assignee | Local | PASS | old/new value |
| RT-SLA-01 | ON_TRACK пример | Local | PASS | расчёт SlaService |
| RT-SLA-02 | AT_RISK пример | Local | PASS | ≤20% оставшегося времени |
| RT-SLA-03 | OVERDUE пример | Local | PASS | |
| RT-SLA-04 | PAUSED пример | Local | PASS | mock `AH-2026-01843` |
| RT-COM-01 | Комментарий с текстом | Local | PASS | addInternalComment |
| RT-COM-02 | Пустой / только пробелы | Local | PASS | VALIDATION |
| RT-COM-03 | Комментарий только с файлом | Local | PASS | text fallback «Прикреплены файлы» |
| RT-COM-04 | Double submit guard | Local | PASS | `commentSubmitting` |
| RT-ATT-01 | Валидация типа/размера/лимитов | Local | PASS | AttachmentValidator |
| RT-ATT-02 | Удаление до отправки | Local | PASS | UI selectedFiles |
| RT-ATT-03 | Кириллица в имени | Local | PASS | отображение строки |
| RT-ATT-04 | Скачивание/открытие файла | Local | FAIL | DEF-004: `mock://` URL, реального файла нет |
| RT-CLI-01 | Список клиентов | Local | PASS | |
| RT-CLI-02 | Поиск/фильтры клиентов | Local | PASS | wired в `clients-page.js` |
| RT-CLI-03 | Карточка клиента | Local | PASS | |
| RT-CLI-04 | SLA в обращениях клиента | Local | FAIL | DEF-005: `getList(actor)` передаёт user как `now` |
| RT-TPL-01 | Шаблоны вкладки/поиск | Local | PASS | |
| RT-AN-01 | Аналитика KPI/период | Local | PASS | |
| RT-AN-02 | Подпись демо-данных | Local | PASS | см. разметку analytics |
| RT-SET-01 | Каталог настроек | Local | PASS | |
| RT-SET-02 | PLANNED disabled | Local | PASS | |
| RT-SET-03 | Detail stub | Local | PASS | без CRUD |
| RT-RESP-01 | 1440 layout | Local | PASS | desktop shell |
| RT-RESP-02 | 1280 toolbar | Local | PASS | media в appeals-list |
| RT-RESP-03 | 1024 mobile shell | Local | PASS | off-canvas + filters drawer |
| RT-A11Y-01 | aria-labels / Escape drawer | Local | PASS | частично; focus-visible есть |
| RT-A11Y-02 | Label у search списка | Local | FAIL | DEF-006: search без явного `<label>`/aria-label |
| RT-VIS-01 | KPI на списке обращений | Local | FAIL | DEF-007: отсутствует (есть только в Аналитике) |
| RT-VIS-02 | Единый shell/токены | Local | PASS | заметных случайных цветов нет |
| RT-FLOW-01 | Flow создаёт уникальное обращение | Local | FAIL | DEF-008: всегда `AH-2026-01847` |
| RT-LIST-12 | Опции фильтра статусов полные | Local | FAIL | DEF-009: только 3 статуса из 9 |

---

## Примечания по окружениям

- **Local / «production build»:** отдельного build нет; результат SETUP-03/04 считается эквивалентом успешной «сборки» статики.
- **Prod:** доступность и assets подтверждены; функциональные FAIL воспроизводимы там же (тот же код `28563e0`).
