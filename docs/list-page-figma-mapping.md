# Сопоставление страницы списка обращений с Figma UI Kit

> Источник параметров: Figma file `sFtelWja1vzUGTjPMkBEQn`, `docs/design-tokens.md`, `docs/figma-access-audit.md`, metadata MCP (при rate limit — кэш аудита).

| Элемент стенда | Компонент Figma | Variant | Size | State | Файл проекта |
|---|---|---|---|---|---|
| Header (shell) | Custom product shell на базе **Header FSK** (Молекулы) | — | height ~72px | default | `styles/layout/shell.css`, `index.html` |
| Sidebar | **🟢 Навигация** / **🟢 Таббар** | dark sidebar | width 260px / 72px compact | default | `styles/layout/shell.css`, `index.html` |
| Navigation item | **🟢 Навигация** → page item | — | min-height 44px | default / hover / active / focus / disabled | `styles/layout/shell.css` |
| Page title | **Атомы → Типографика** → Heading SM | — | 24px / lh 30 | default | `styles/pages/appeals-list.css` |
| Primary button | **Кнопки** → Type=Primary | Primary | M (40px) | default / hover / focus / disabled | `styles/components/button.css`, `index.html` |
| Secondary button | **Кнопки** → Type=Secondary | Secondary | M (40px) | default / hover / focus / disabled | `styles/components/button.css` |
| Icon button | **Кнопки** → Icon-only (Secondary pattern) | Secondary | S (32px) | default / hover / focus | `styles/components/button.css` |
| Search input | **Input** → Config=Icon + text | compact toolbar | 46px height | default / focus | `styles/components/input.css` |
| Select | **Select** (Молекулы) | closed | 46px height | default / focus / disabled | `styles/components/select.css` |
| Status badge | **Offer** / **Pins** → theme=light | semantic mapping | height 20px | default | `styles/components/badge.css` |
| Priority badge | **Offer** → theme=light | semantic mapping | height 20px | default | `styles/components/badge.css` |
| Table header | **List items** (admin table pattern) | header row | height 44px | default | `styles/components/table.css` |
| Table row | **List items** | data row | height 56px | default / hover | `styles/components/table.css` |
| Pagination | **Pagination** (Молекулы) | — | btn 32px | default / active / disabled | `styles/components/pagination.css` |
| Avatar | **List items** → With ellipse | circle | sm 32px | default | `styles/components/avatar.css` |
| Tooltip | **Tooltip** (Молекулы) | — | — | hover / focus-within | `styles/components/states.css` |
| Empty state | Custom на токенах (компонент в Kit не подтверждён) | — | — | default | `styles/components/states.css`, `index.html` |
| Loading state | **Button** → State=Loading (spinner pattern) | — | 32px | loading | `styles/components/states.css` |

## Примечания

- Dedicated **admin Data Table** в Kit не подтверждён — использован паттерн **List items** + product layout.
- **Header FSK** не применён as-is (marketing/branded) — адаптирован product shell «Хаб обращений».
- Tooltip на странице не используется в разметке списка (компонент подготовлен для shell/header).
