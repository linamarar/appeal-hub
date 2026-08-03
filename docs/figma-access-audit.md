# Проверка Figma UI Kit

## Ссылка

https://www.figma.com/design/sFtelWja1vzUGTjPMkBEQn/%F0%9F%9F%A0-UI-Kit--Copy-?m=auto&t=dwdqbG1OXhKpfUnT-6

**File key:** `sFtelWja1vzUGTjPMkBEQn`  
**Название файла:** 🟠 UI Kit (Copy)

## Способ проверки

1. Figma MCP server (`plugin-figma-figma`) — первоначально требовал аутентификации (`needsAuth`), после `mcp_auth` — **ready**.
2. `get_metadata` без nodeId — получен список top-level pages.
3. `get_metadata` с nodeId — структура страниц «Атомы», «Молекулы», «Модалки», «Навигация», «Assets».
4. `get_variable_defs` — токены на конкретных nodeId (Button, Typography).
5. `get_libraries` — подключённые и доступные библиотеки.
6. `search_design_system` — поиск по query (вернул пустые результаты без scoped library keys).

## Результат доступа

**Вариант A: Figma доступна через настроенный Figma MCP.**

Доступ подтверждён: получены списки страниц, XML-структура секций, variant names компонентов, variable definitions, library info.

**Ограничения доступа:**
- `search_design_system` без `includeLibraryKeys` возвращает пустой результат — полный каталог компонентов через search недоступен напрямую.
- `get_component_metadata` — tool not found в текущей версии MCP (не удалось получить structured property definitions через этот endpoint).
- Полный export всех variables/styles одним запросом — недоступен; variables читаются точечно через `get_variable_defs` per node.

## Доступные страницы

Top-level pages (28 страниц):

| # | Page ID | Название |
|---|---|---|
| 1 | 11510:31366 | Оглавление |
| 2 | 11088:51433 | Атомы |
| 3 | 3819:198 | Молекулы |
| 4 | 11672:106012 | 🟢 Планировки |
| 5 | 11669:59509 | 🟢 Шильдик |
| 6 | 11663:82631 | 🟢 Баннеры |
| 7 | 11669:51732 | 🟢 Blocks features |
| 8 | 11672:102330 | 🟢 Blocks fullscreen pictures |
| 9 | 11691:30481 | 🟢 Blocks funсtional (flats,news,team, docs) |
| 10 | 11691:22144 | 🟢 Блоки из двух частей |
| 11 | 11669:59166 | 🟢 Карточки |
| 12 | 11663:123823 | 🟢 Комейджик |
| 13 | 12111:4598 | 🟢 Кукис / телеграм / фикс цена / фильтр |
| 14 | 11667:45073 | 🟢 FAQ |
| 15 | 11663:112317 | 🟢 Модалки |
| 16 | 11663:104390 | 🟢 Футер |
| 17 | 11672:99998 | 🟢 Галерея |
| 18 | 11659:82629 | 🟢 Таббар |
| 19 | 11659:82630 | 🟢 Навигация |
| 20 | 11669:51733 | 🟢 Ипотека |
| 21 | 14510:8968 | 🟢 Карта |
| 22 | 11746:78372 | 🟢 Восстановить поиск |
| 23 | 11663:82632 | 🟢 Сторис |
| 24 | 11669:60473 | 🟢 Таймер |
| 25 | 11358:63699 | 🟢 Список квартир |
| 26 | 14681:44568 | 🟢 Расхлоп ЖК на главной |
| 27 | 11363:2042 | Assets |
| 28 | 5702:21117 | Архив |

**Примечание:** UI Kit ориентирован на корпоративный сайт (FSK / недвижимость). Страницы «🟢 Планировки», «🟢 Ипотека», «🟢 Список квартир» — domain-specific blocks, не универсальные admin UI patterns.

## Доступные компоненты

### Страница «Атомы» (11088:51433)

| Секция | Содержимое |
|---|---|
| Типографика | h1–h5 (Desktop/Mobile), txt-xl/l/m/s, Button/Tag/Tabbar text styles |
| Цвета | Color palette |
| Скругления | Border radius scale |
| Градиенты | Gradient definitions + usage examples |
| Отступы | Spacing scale |
| Тени | Shadow definitions |

### Страница «Молекулы» (3819:198) — основные UI-компоненты

| Группа | Компоненты / секции |
|---|---|
| Кнопки | Primary/Secondary/Thirty × Size L/M/S × State Default/Hover/Disable/Loading × Icon Left/Right/No |
| Input | Text fields с states |
| Select | Dropdown select |
| Checkbox | Checkbox states |
| Radio button | Radio states |
| Toggle | Switch component |
| Upload input | File upload (Upload file, Uploading states) |
| Tooltip | Tooltip variants |
| Pagination | Pagination |
| Tabs | Tabs, Tabs with line, Tab button, Segmented control |
| Divider | Divider |
| Breadcrumbs | «хлеб крошки» section |
| Button link | Link-style button |
| Input Range | Range slider |
| Pins | Pin markers |
| List items | List item patterns |
| Header FSK | Header component (desktop/mobile variants) |
| Modal window header | desktop/mobile header for modals |

### Страница «🟢 Модалки» (11663:112317)

- Modal components + states sections

### Страница «🟢 Навигация» (11659:82630)

- Navigation patterns: основной компонент, составные части, анимация, состояния

### Страница «Assets» (11363:2042)

| Секция | Содержимое |
|---|---|
| Logos | Brand logos |
| Icons | Icon library |

### Component variants (пример: Button)

Подтверждены через `get_metadata` symbol names:
- Properties: `Type` (Primary, Secondary, Thirty), `Size` (L, M, S), `State` (Default, Hover, Disable, Loading), `Show Icon` (No, Left, Right), `Filter` (False, True)

## Variables и styles

### Variables (подтверждено через `get_variable_defs`)

**Button node (910:3640):**
- `Text/White text`: `#FFFFFF`
- `Button M`: Font(TT Firs Text Trial Variable, Medium, 16px, weight 450)
- `Accient/Cooper`: (empty value in response)
- `Button Primary`: Inner shadow effects

**Typography node (37742:98369):**
- `Desktop/Headline/H1`: Font(TT Firs Text Trial Variable, Medium, 56px, weight 500)

### Styles

Text styles и color styles **присутствуют** на странице «Атомы» (секции Типографика, Цвета, Тени). Полный programmatic export всех styles **не выполнен** — доступны через metadata и точечный `get_variable_defs`.

### Typography (из metadata страницы «Атомы»)

| Token | Desktop | Mobile |
|---|---|---|
| h1 | 56px / w500 / lh 56px | 32px / w500 / lh 34px |
| h2 | 36px / lh 40px | 26px / lh 32px |
| h3 | 28px / lh 36px | 20px / lh 24px |
| h4 | 24px / lh 30px | 19px / lh 24px |
| h5 | 18px / lh 24px | 17px / lh 22px |
| txt-xl | 36px / w450 / lh 48px | — |
| txt-l | 22px / lh 32px | — |
| txt-m | 15px / lh 22px | — |

**Font family:** TT Firs Text Trial Variable (не Inter)

## Доступность спецификаций

| Спецификация | Доступность |
|---|---|
| Размеры компонентов | ✅ Через metadata (width/height в XML) |
| Отступы | ✅ Страница «Отступы» + metadata |
| Цвета | ✅ Страница «Цвета» + variable defs |
| Typography | ✅ Страница «Типографика» + variable defs |
| Border radius | ✅ Страница «Скругления» |
| Shadows | ✅ Страница «Тени» + effect variables |
| Component properties/variants | ✅ Partial — через symbol names в metadata |
| Component property schema | ⚠️ `get_component_metadata` недоступен |

## Доступность assets

| Asset type | Доступность |
|---|---|
| SVG icons | ✅ В principle — через `download_assets` tool (не вызывался на этапе аудита, но tool доступен) |
| Icons page | ✅ Страница Assets → Icons (11737:25266) |
| Logos | ✅ Страница Assets → Logos |
| Screenshots | ✅ Через `get_screenshot` tool |
| Full icon export | ⚠️ Требует итеративных вызовов per node (cap 20 SVG per call) |

## Что невозможно получить

1. Полный автоматический каталог всех component sets одним запросом (search возвращает пусто без library scope).
2. Structured component metadata API (tool missing).
3. Code Connect mappings (не проверялось, но в прототипе нет компонентов для mapping).
4. Готовый npm-пакет или exported design tokens JSON — **не существует**.
5. Appeal Hub-specific screens — **отсутствуют** в UI Kit (Kit — generic/corporate website).

## Какие материалы нужны вручную

Несмотря на доступ через MCP, для надёжной интеграции рекомендуется дополнительно:

### Обязательные

| Материал | Зачем |
|---|---|
| Экспорт color variables (JSON/CSS) | Прототип использует другую palette |
| Typography spec (TT Firs + fallback strategy) | Прототип использует Inter |
| Spacing / radius / shadow tokens | Для CSS custom properties |
| Screenshots ключевых компонентов для Appeal Hub | Button, Input, Select, Table, Badge/Tag, Sidebar/Nav |
| Перечень variants для Button, Input, Select, Badge/Tag | Mapping states |
| Icon set export или naming convention | Прототип — inline SVG |
| Решение: какие Figma pages использовать для admin UI | Kit ориентирован на marketing site |

### Необязательные

| Материал | Зачем |
|---|---|
| Screenshots domain blocks (карточки, ипотека, карта) | Если будут переиспользованы |
| Motion/animation specs | Если нужны transitions |
| Dark mode tokens (если есть) | Не обнаружено в аудите |
| Apple/Material libraries cleanup decision | В файле подключены iOS/macOS/watchOS/visionOS kits |

## Подключённые внешние библиотеки

Через `get_libraries` обнаружены subscribed libraries (не часть UI Kit, но влияют на файл):
- iOS and iPadOS 26
- watchOS 26
- visionOS 26
- macOS 26
- macOS 27

Это **Apple Design Resources**, не компоненты Appeal Hub.
