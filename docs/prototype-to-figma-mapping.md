# Сопоставление прототипа с Figma UI Kit

> Figma UI Kit доступен через MCP. Сопоставление основано на фактически полученной структуре файла `sFtelWja1vzUGTjPMkBEQn`.

| Компонент проекта | Путь | Компонент Figma | Статус | Что сохраняем | Что меняем | Риск |
|---|---|---|---|---|---|---|
| Button (primary) | `styles/main.css` `.btn--primary` | Кнопки → Type=Primary (Молекулы) | Partial match | Semantics (primary action) | Colors, font (Inter→TT Firs), sizes L/M/S, states Loading/Disable, inner shadows | Средний |
| Button (secondary) | `styles/main.css` `.btn--secondary` | Кнопки → Type=Secondary | Partial match | Semantics (secondary action) | Border, hover, all variant matrix | Средний |
| Table link | `styles/main.css` `.table__link` | Button link (Молекулы) | Partial match | Link-style action in table | Styling, component API | Низкий |
| Input (search) | `styles/main.css` `.search input` | Input (Молекулы) | Partial match | Search use case | Wrapper, label, states, Figma Input spec | Средний |
| Select | `styles/main.css` `.select` | Select (Молекулы) | Partial match | Filter use case | Native → custom Select component | Средний |
| Badge (status) | `styles/main.css` `.badge--*` | Pins / Offer (Молекулы) | Requires clarification | Status display concept | Exact Figma component TBD — may be Tag/Pin, not Badge | Высокий |
| Badge (AI status) | `styles/main.css` `.badge--ai` | — | No match | AI-specific status concept | Custom component needed | Высокий |
| Table | `styles/main.css` `.table` | List items (Молекулы) | Partial match | Tabular data layout | Full table component not in Kit; may need custom | Высокий |
| Sidebar | `styles/main.css` `.sidebar` | 🟢 Навигация / 🟢 Таббар | Partial match | Side navigation pattern | Structure, mobile behavior, FSK branding | Средний |
| Page Header | `styles/main.css` `.page-header` | Header FSK (Молекулы) | Partial match | Title + description + actions layout | Remove FSK branding, adapt for admin | Средний |
| Back link | `styles/main.css` `.back-link` | Button link | Partial match | Back navigation | Icon, styling | Низкий |
| stat-card | `styles/main.css` `.stat-card` | 🟢 Карточки | Requires clarification | Dashboard metric card concept | Map to appropriate card variant | Средний |
| appeal-card | `styles/main.css` `.appeal-card` | 🟢 Карточки | Requires clarification | Entity card layout | Custom fields for appeal entity | Средний |
| panel | `styles/main.css` `.panel` | Blocks (various 🟢 pages) | Partial match | Section container pattern | Border, radius, header styling | Низкий |
| Upload zone | `styles/main.css` `.upload-zone` | Upload input (Молекулы) | Partial match | Drag-drop upload UX | Component structure, states (Uploading) | Средний |
| Success banner | `styles/main.css` `.success-banner` | — | No match | Success feedback concept | Need Alert/Notification pattern from Kit | Средний |
| Spinner | `styles/main.css` `.ai-log__spinner` | Button State=Loading | Partial match | Loading indication | Use Figma loading state pattern | Низкий |
| Flow stepper | `styles/main.css` `.flow-steps` | — | No match | Multi-step flow UX | Custom component on Figma tokens | Средний |
| Timeline | `styles/main.css` `.timeline` | — | No match | History/audit log concept | Custom component | Средний |
| AI log | `styles/main.css` `.ai-log` | — | No match | AI processing feed | Appeal Hub-specific, custom | Высокий |
| Doc preview | `styles/main.css` `.doc-preview` | — | No match | Document preview + PII masking | Appeal Hub-specific, custom | Высокий |
| Meta list | `styles/main.css` `.meta-list` | List items | Partial match | Key-value metadata display | Styling | Низкий |
| Nav item | `styles/main.css` `.nav-item` | 🟢 Навигация items | Partial match | Navigation item with icon | Active state, icon set | Средний |
| Inline SVG icons | `index.html` (multiple) | Assets → Icons | Partial match | Icon usage points | Replace all with Figma icon set | Средний |
| Typography | `styles/main.css` + Inter | Атомы → Типографика | No match | Heading hierarchy concept | Font family, all sizes/weights | Высокий |
| Color tokens | `styles/main.css` `:root` | Атомы → Цвета | No match | Semantic color usage | Full palette replacement | Высокий |
| Spacing | ad-hoc in CSS | Атомы → Отступы | Requires clarification | — | Systematic spacing scale | Средний |
| Border radius | `--radius`, `--radius-lg` | Атомы → Скругления | Requires clarification | — | Match Figma radius scale | Низкий |
| Shadows | `--shadow`, `--shadow-sm` | Атомы → Тени | Requires clarification | — | Match Figma shadow tokens | Низкий |
| Textarea | — | Input (multiline?) | Project component missing | — | Implement from Figma | Низкий |
| Checkbox | — | Checkbox (Молекулы) | Project component missing | — | Implement from Figma | Низкий |
| Radio | — | Radio button (Молекулы) | Project component missing | — | Implement from Figma | Низкий |
| Switch/Toggle | — | Toggle (Молекулы) | Project component missing | — | Implement from Figma | Низкий |
| Tabs | — | Tabs / Segmented control | Project component missing | — | Implement from Figma | Низкий |
| Modal | — | 🟢 Модалки | Project component missing | — | Implement from Figma | Низкий |
| Tooltip | — | Tooltip (Молекулы) | Project component missing | — | Implement from Figma | Низкий |
| Pagination | — | Pagination (Молекулы) | Project component missing | — | Implement from Figma | Низкий |
| Breadcrumbs | — | хлеб крошки (Молекулы) | Project component missing | — | Implement from Figma | Низкий |
| Toast | — | — | Figma component missing | — | Need clarification or custom | Средний |
| Drawer | — | — | Figma component missing | — | Need clarification or custom | Средний |
| EmptyState | — | — | Figma component missing | — | Custom component | Средний |
| Skeleton | — | — | Figma component missing | — | Custom component | Низкий |
| Avatar | — | — | Figma component missing | — | Custom or from Assets | Низкий |
| DatePicker | — | — | Figma component missing | — | Custom or third-party | Средний |
| Dropdown (menu) | — | — | Requires clarification | — | May exist in Navigation/Menu patterns | Средний |

## Сводка по статусам

| Статус | Количество |
|---|---|
| Partial match | 18 |
| No match | 7 |
| Requires clarification | 6 |
| Project component missing | 10 |
| Figma component missing | 5 |

## Ключевые выводы

1. **Базовые form controls** (Button, Input, Select, Checkbox, Radio, Toggle) — есть в Figma, но прототип использует упрощённые CSS-версии → **замена**.
2. **Admin-specific patterns** (Table, EmptyState, Toast, Drawer) — **отсутствуют** или неочевидны в Figma Kit → потребуется custom design или расширение Kit.
3. **Appeal Hub-specific** (AI log, doc preview, PII masking) — **нет в Figma** → custom components на Figma tokens.
4. **Design tokens** (font, colors) — **полное несовпадение** → migration обязательна.
5. Figma Kit **domain-specific** (FSK, недвижимость) — Header, Cards, Blocks могут потребовать **адаптации** для admin/product UI.
