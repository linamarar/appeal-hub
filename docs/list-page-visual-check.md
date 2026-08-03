# Визуальная проверка: shell + список обращений

> Дата: 2026-08-03. Сравнение локального стенда с Figma UI Kit `sFtelWja1vzUGTjPMkBEQn`.

## Совпадает

- **Sidebar**: тёмный фон (`--color-background-tabbar`), ширина 260px, nav item 44px, active/hover на `--color-grey-jet`.
- **Кнопки**: Primary/Secondary/Ghost — высоты L/M/S 48/40/32px, radius `--radius-control`, primary shadow из токенов.
- **Input / Search**: высота 46px, border/focus ring из semantic tokens.
- **Select**: высота 46px, native select со стилизацией Kit-паттерна.
- **Badges**: высота 20px, pill radius, семантические цвета status/priority.
- **Table**: header 44px, row 56px, muted header text, hover row, horizontal scroll wrapper.
- **Pagination**: декоративный блок 32px controls (1 страница mock).
- **Typography**: heading sm 24px для заголовка страницы, body md 15px в таблице.
- **Spacing**: page padding `--spacing-8`, gaps через `--spacing-*`.

## Отличается

| Элемент | Отличие | Причина |
|---|---|---|
| Header shell | Упрощён vs Header FSK | Product admin shell без marketing-блоков FSK (решение `technical-decisions.md`) |
| Sidebar compact @1024px | Icon-only без подтверждённого Figma variant | Адаптивность этапа; compact sidebar не верифицирован в Kit |
| Empty state | Custom layout, не компонент Kit | Dedicated EmptyState в Figma не подтверждён |
| Loading spinner | Custom 32px ring | Skeleton/Loader variant в Kit не извлечён (rate limit MCP) |
| Table sort icons | Отсутствуют | Сортировка не реализована в прототипе |
| Row selection / checkboxes | Отсутствуют | Массовый выбор не реализован |
| Tooltip | CSS-only, не используется на экране | Нет триггеров в текущем сценарии |
| Приоритет в таблице | Циклический demo-label | В mock нет поля priority — только визуальный placeholder |
| Клиент / исполнитель / SLA | «—» | Поля отсутствуют в mock-модели |

## Недоступные параметры Figma

- Точные padding/gap **Pagination** component (использован audit + tokens).
- **Empty state** component structure.
- **Tooltip** positioning spec (dark bubble на tokens inverse).
- **Focus ring** exact color — использован `--color-focus-ring` (info, unconfirmed в tokens).
- **Admin data table** as dedicated component — собран из List items pattern.
- Badge background alpha values — derived 8–10% от semantic colors.

## Следующий этап

- Верификация параметров через Figma MCP без rate limit.
- Расширение status model в данных + все 9 labels.
- Real pagination / sort / filter logic.
- Карточка обращения и форма создания.
- Custom Select dropdown (если требует Kit).

## Проверка стенда

| Проверка | Результат |
|---|---|
| Приложение открывается | ✅ `index.html` + static server |
| Список обращений | ✅ таблица + badges |
| Фильтры (сброс UI) | ✅ reset без изменения данных |
| Переход в карточку | ✅ row click / «Открыть» |
| Flow «Создать обращение» | ✅ `data-go="flow"` |
| Legacy flow/detail | ✅ `view--legacy` + `main.css` |
| Build | ✅ нет сборщика; статический проект |
| Тесты | ✅ отсутствуют в репозитории |
| Новые dependencies | ✅ не добавлены |
| Font files | ✅ не добавлены |
