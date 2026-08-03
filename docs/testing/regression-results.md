# Результаты регрессионного тестирования

**Дата прогона:** 03.08.2026  
**Версия:** v0.1 прототип  
**Исполнитель:** автоматизированный code review + curl + `node --check`  
**Ограничение:** браузерный UI-прогон не выполнялся; runtime-поведение выведено из кода.

---

## Сводка

| Метрика | Значение |
|---|---|
| **Всего тест-кейсов** | **78** |
| **Passed** | **68** |
| **Failed** | **5** |
| **Partial** | **0** |
| **NOT IMPLEMENTED (N/A)** | **5** |
| **Skipped** | **0** |
| **Build** | **PASS** |
| **Дефектов найдено** | **8** (P0: 0, P1: 0, P2: 3, P3: 5) |

---

## Детальные результаты

### Setup / Build

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| BLD-01 | Статический сайт без npm | File check | **PASS** | `package.json` отсутствует |
| BLD-02 | `node --check` 20 JS | Shell | **PASS** | Все файлы OK |
| BLD-03 | index.html HTTP 200 | curl localhost:8765 | **PASS** | |
| BLD-04 | CSS/JS assets | curl | **PASS** | main.css, app.js → 200 |
| BLD-05 | logo-fsk.png | curl | **PASS** | |
| BLD-06 | Нет абсолютных путей | grep | **PASS** | |

### Маршрутизация

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| RT-01 | `#/appeals` | Code | **PASS** | `parseRoute` → dashboard |
| RT-02 | Default hash | Code | **PASS** | `location.hash = '/appeals'` |
| RT-03 | Valid appeal ID | Code + data | **PASS** | AH-2026-01847 в repository |
| RT-04 | Unknown appeal ID | Code | **PASS** | `setState('not-found')` |
| RT-05 | `#/clients` | Code | **PASS** | ClientsPage.load |
| RT-06 | `#/clients/CL-001` | Code + data | **PASS** | |
| RT-07 | Unknown client | Code | **PASS** | not-found state |
| RT-08 | `#/templates` | Code | **PASS** | |
| RT-09 | `#/analytics` | Code | **PASS** | |
| RT-10 | `#/settings` | Code | **PASS** | 15 секций |
| RT-11 | `#/settings/priorities` | Code | **PASS** | loadDetail stub |
| RT-12 | Unknown settings slug | Code | **PASS** | «Раздел не найден» |
| RT-13 | `#/flow` | Code | **PASS** | Flow + draft guard |
| RT-14 | Unknown hash | Code | **PASS** | Fallback dashboard (by design) |
| RT-15 | Production smoke | curl | **PASS** | appealhub.mararx.com → 200 |

### Список обращений

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| APL-01 | 14 записей | Data count | **PASS** | appeals-repository |
| APL-02 | Поиск | Code | **PASS** | `filterAppealsList` |
| APL-03 | Фильтр статус | Code | **PASS** | resolveStatusFilterCode |
| APL-04 | Фильтр приоритет | Code | **PASS** | |
| APL-05 | «Не назначен» | Code | **PASS** | Только этот вариант assignee |
| APL-06 | Сброс | Code | **PASS** | resetAppealsFilters |
| APL-07 | Drawer | Code | **PASS** | Escape закрывает |
| APL-08 | Refresh | Code | **PASS** | loading 300ms |
| APL-09 | Row click | Code | **PASS** | navigate detail |
| APL-10 | Пагинация | Code | **N/A** | NOT IMPLEMENTED — статическая вёрстка |
| APL-11 | KPI дашборд | Code | **N/A** | NOT IMPLEMENTED |

### Карточка обращения

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| APD-01 | Поля карточки | Code | **PASS** | |
| APD-02 | Назначение | Code | **PASS** | assignAppeal |
| APD-03 | Переназначение | Code | **PASS** | reassignAppeal + reason |
| APD-04 | Принять в работу | Code | **PASS** | acceptAppeal |
| APD-05 | Смена статуса | Code | **PASS** | changeStatus |
| APD-06 | Invalid transition | Code | **PASS** | fail INVALID_TRANSITION |
| APD-07 | Комментарий | Code | **PASS** | addInternalComment |
| APD-08 | Вложения | Code | **PASS** | AttachmentValidator |
| APD-09 | Просмотр вложений | Code | **N/A** | NOT IMPLEMENTED — disabled |
| APD-10 | Not found | Code | **PASS** | |

### SLA / Статусы

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| SLA-01 | ON_TRACK | Code | **PASS** | |
| SLA-02 | AT_RISK | Code | **PASS** | 20% threshold |
| SLA-03 | OVERDUE | Code | **PASS** | |
| SLA-04 | PAUSED | Code | **PASS** | |
| SLA-05 | Матрица | Code | **PASS** | 9 статусов |

### Mock-разделы

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| MCK-01 | Clients search | Code | **PASS** | |
| MCK-02 | Type filter | Code | **PASS** | |
| MCK-03 | Client appeals tab | Code | **FAIL** | DEF-001: wrong SLA via getList(actor) |
| MCK-04 | Templates tabs | Code | **PASS** | |
| MCK-05 | Templates search | Code | **PASS** | |
| MCK-06 | Analytics periods | Code | **PASS** | |
| MCK-07 | Settings PLANNED | Code | **PASS** | disabled |
| MCK-08 | Settings detail | Code | **PASS** | stub |
| MCK-09 | Create template | Code | **PASS** | disabled by design |

### Flow

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| FLW-01 | Upload | Code | **PASS** | |
| FLW-02 | AI sim | Code | **PASS** | 2s timeout chain |
| FLW-03 | Create appeal | Code | **PASS** | dynamic ID |
| FLW-04 | Discard draft | Code | **PASS** | confirm + hash guard |
| FLW-05 | Open card btn | Code | **PASS** | updateFlowOpenCardButton |

### Shell / Responsive

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| SHL-01 | Sidebar collapse | Code + CSS | **PASS** | localStorage |
| SHL-02 | Mobile menu | Code + CSS | **PASS** | ≤1024px |
| SHL-03 | 1280px | CSS | **PASS** | appeals-list, analytics |
| SHL-04 | 1024px | CSS | **PASS** | shell, components |
| SHL-05 | 1440px | CSS | **N/A** | NOT IMPLEMENTED |
| SHL-06 | Nav active | Code | **PASS** | navActiveMap |

### Accessibility

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| A11Y-01 | Sidebar label | HTML | **PASS** | aria-label |
| A11Y-02 | Modal labelledby | HTML | **PASS** | assign-modal |
| A11Y-03 | Drawer Escape | JS | **PASS** | |
| A11Y-04 | Modal Escape | JS | **FAIL** | DEF-002: нет handler |
| A11Y-05 | Search label | HTML | **FAIL** | DEF-003: appeals-search |
| A11Y-06 | Tabs a11y | HTML | **FAIL** | DEF-004: нет aria-controls |
| A11Y-07 | Pagination label | HTML | **PASS** | |
| A11Y-08 | Modal focus trap | JS | **FAIL** | DEF-005: не реализован |

### Static analysis

| ID | Кейс | Метод | Результат | Примечание |
|---|---|---|---|---|
| STA-01 | console.error | grep | **PASS** | Не найдено |
| STA-02 | Script order | HTML | **PASS** | Globals до app.js |
| STA-03 | Asset refs | curl | **PASS** | |

---

## Build summary

| Проверка | Статус |
|---|---|
| JS syntax (`node --check`) | **PASS** |
| Static assets | **PASS** |
| Local HTTP server | **PASS** |
| Production URL (smoke) | **PASS** |
| npm build | **N/A** (нет сборки) |

---

## Ограничения прогона

1. **Браузер не использовался** — интерактивные сценарии (модалки, drag-drop, focus) проверены по коду.
2. **Нет автотестов** — framework отсутствует.
3. **Данные in-memory** — состояние сбрасывается при полной перезагрузке (кроме sidebar localStorage).

---

## Связанные артефакты

- Дефекты: [defects.md](./defects.md)
- Готовность к релизу: [release-readiness.md](./release-readiness.md)
- Охват: [current-scope.md](./current-scope.md)
