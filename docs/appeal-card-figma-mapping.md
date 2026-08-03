# Сопоставление карточки обращения с Figma UI Kit

> Источник: Figma `sFtelWja1vzUGTjPMkBEQn`, `docs/list-page-figma-mapping.md`, `docs/design-tokens.md`.

| Элемент карточки | Компонент Figma | Variant | Size | State | Файл проекта |
|---|---|---|---|---|---|
| Back navigation | **Button link** / хлеб крошки (Молекулы) | Ghost link | body md | default / hover | `styles/pages/appeal-detail.css` |
| Page header | **Header FSK** (product adapt) | — | heading sm | default | `styles/pages/appeal-detail.css` |
| Status badge | **Offer** / **Pins** | theme=light | height 20px | default | `styles/components/badge.css` |
| Priority badge | **Offer** | theme=light | height 20px | default | `styles/components/badge.css` |
| SLA indicator | **Offer** (semantic) | info/warning | height 20px | default | `styles/components/badge.css`, `styles/pages/appeal-detail.css` |
| Assignee | **List items** → With ellipse | text + avatar | md 40px | default | `styles/components/avatar.css` |
| Content card | **🟢 Карточки** / panel pattern | surface | radius lg | default | `styles/components/card.css` |
| Section header | **Атомы → Типографика** Heading XS | — | 18px | default | `styles/components/card.css` |
| Description block | **Input** multiline read-only pattern | — | body md | default | `styles/pages/appeal-detail.css` |
| Client information block | **List items** key-value | — | row 44px | default | `styles/components/meta-list.css` |
| Attachments list | **List items** + file icon | — | row 56px | default / empty | `styles/pages/appeal-detail.css` |
| Timeline / history | **List items** vertical feed | — | — | default | `styles/components/timeline.css` |
| Internal comment | **Input** textarea + **Кнопки** Primary | Secondary textarea, Primary btn M | 46px / 40px | default / focus | `styles/components/input.css`, `styles/components/button.css` |
| Primary action | **Кнопки** Type=Primary | Primary | M (40px) | default / disabled | `styles/components/button.css` |
| Secondary action | **Кнопки** Type=Secondary | Secondary | M (40px) | default | `styles/components/button.css` |
| Dropdown action | **Select** (status change) | closed | 46px | default / focus | `styles/components/select.css` |
| Empty state | Custom на токенах | — | — | empty | `styles/components/states.css` |
| Loading state | **Button** State=Loading pattern | spinner | 32px | loading | `styles/components/states.css` |
| Not-found state | Custom empty + **Кнопки** Secondary | — | — | not-found | `styles/components/states.css` |

## Расхождения

- Dedicated appeal detail layout в Kit не подтверждён — двухколоночная композиция на List items + Cards pattern.
- Audit log vs timeline — упрощённая лента событий без полного audit UI.
