# Карточка клиента — визуальная проверка

## Соответствует Figma

- Page header с back link и badges
- Двухколоночный layout (main + sidebar cards)
- Tabs для обращений / документов / истории
- Data table для обращений и документов
- Timeline для истории
- Empty states для пустых блоков
- Loader для loading
- Tooltip на disabled «Редактировать» и «Просмотр»

## Отличия

- Stats row — кастомная строка метрик, не отдельный Figma-комponent
- Internal badge — текстовая пометка, без отдельного warning-banner

## Не подтверждено

- Точные spacing sidebar 320px — взято из appeal-detail pattern
- Variant tag pill — из tokens surface-muted

## Не входит в этап

- Редактирование, загрузка документов, мобильная полная адаптация (<1024 только single column)

## Breakpoints

- 1440 / 1280: две колонки — OK
- 1024: одна колонка — OK
