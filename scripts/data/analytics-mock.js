/** Mock analytics — демонстрационные данные */
const ANALYTICS_MOCK = {
  '7d': {
    kpis: { total: 42, new: 8, inProgress: 14, closed: 20, slaCompliance: 87, avgProcessingHours: 18, overdue: 3, autoProcessed: 12 },
    byStatus: [{ label: 'Новые', value: 8, pct: 19 }, { label: 'В работе', value: 14, pct: 33 }, { label: 'На согласовании', value: 5, pct: 12 }, { label: 'Закрыты', value: 15, pct: 36 }],
    byTopic: [{ label: 'ЖКХ', value: 12 }, { label: 'Договор', value: 9 }, { label: 'Качество работ', value: 7 }, { label: 'Сроки', value: 6 }, { label: 'Прочее', value: 8 }],
    bySource: [{ label: 'Портал', value: 18 }, { label: 'Email', value: 10 }, { label: 'Телефон', value: 8 }, { label: 'Документ', value: 6 }],
    slaBreakdown: [{ label: 'В срок', pct: 87 }, { label: 'На грани', pct: 8 }, { label: 'Просрочено', pct: 5 }],
    assigneeLoad: [{ name: 'Иванова А.С.', count: 8 }, { name: 'Петров Д.В.', count: 6 }, { name: 'Сидорова М.К.', count: 5 }, { name: 'Не назначен', count: 3 }],
    dynamics: [{ day: 'Пн', value: 5 }, { day: 'Вт', value: 7 }, { day: 'Ср', value: 6 }, { day: 'Чт', value: 9 }, { day: 'Пт', value: 8 }, { day: 'Сб', value: 4 }, { day: 'Вс', value: 3 }],
  },
  '30d': {
    kpis: { total: 186, new: 34, inProgress: 52, closed: 100, slaCompliance: 82, avgProcessingHours: 22, overdue: 14, autoProcessed: 48 },
    byStatus: [{ label: 'Новые', value: 34, pct: 18 }, { label: 'В работе', value: 52, pct: 28 }, { label: 'На согласовании', value: 18, pct: 10 }, { label: 'Закрыты', value: 82, pct: 44 }],
    byTopic: [{ label: 'ЖКХ', value: 48 }, { label: 'Договор', value: 38 }, { label: 'Качество работ', value: 32 }, { label: 'Сроки', value: 28 }, { label: 'Прочее', value: 40 }],
    bySource: [{ label: 'Портал', value: 72 }, { label: 'Email', value: 45 }, { label: 'Телефон', value: 38 }, { label: 'Документ', value: 31 }],
    slaBreakdown: [{ label: 'В срок', pct: 82 }, { label: 'На грани', pct: 11 }, { label: 'Просрочено', pct: 7 }],
    assigneeLoad: [{ name: 'Иванова А.С.', count: 32 }, { name: 'Петров Д.В.', count: 28 }, { name: 'Сидорова М.К.', count: 24 }, { name: 'Не назначен', count: 12 }],
    dynamics: [{ day: 'Нед 1', value: 42 }, { day: 'Нед 2', value: 48 }, { day: 'Нед 3', value: 51 }, { day: 'Нед 4', value: 45 }],
  },
  quarter: {
    kpis: { total: 542, new: 98, inProgress: 156, closed: 288, slaCompliance: 79, avgProcessingHours: 26, overdue: 42, autoProcessed: 134 },
    byStatus: [{ label: 'Новые', value: 98, pct: 18 }, { label: 'В работе', value: 156, pct: 29 }, { label: 'На согласовании', value: 52, pct: 10 }, { label: 'Закрыты', value: 236, pct: 43 }],
    byTopic: [{ label: 'ЖКХ', value: 142 }, { label: 'Договор', value: 118 }, { label: 'Качество работ', value: 96 }, { label: 'Сроки', value: 84 }, { label: 'Прочее', value: 102 }],
    bySource: [{ label: 'Портал', value: 210 }, { label: 'Email', value: 138 }, { label: 'Телефон', value: 112 }, { label: 'Документ', value: 82 }],
    slaBreakdown: [{ label: 'В срок', pct: 79 }, { label: 'На грани', pct: 14 }, { label: 'Просрочено', pct: 7 }],
    assigneeLoad: [{ name: 'Иванова А.С.', count: 92 }, { name: 'Петров Д.В.', count: 78 }, { name: 'Сидорова М.К.', count: 68 }, { name: 'Не назначен', count: 38 }],
    dynamics: [{ day: 'Апр', value: 168 }, { day: 'Май', value: 182 }, { day: 'Июн', value: 192 }],
  },
};

const AnalyticsRepository = (() => ({
  getData: (period = '30d') => ANALYTICS_MOCK[period] || ANALYTICS_MOCK['30d'],
  ANALYTICS_MOCK,
}))();
