const SETTINGS_READINESS = {
  AVAILABLE: { label: 'Доступно', variant: 'success' },
  MOCK: { label: 'Mock', variant: 'info' },
  PLANNED: { label: 'Запланировано', variant: 'neutral' },
};

const SETTINGS_SECTIONS_MOCK = [
  { slug: 'users', name: 'Пользователи', description: 'Учётные записи сотрудников и доступ к системе', readiness: 'MOCK', icon: 'users' },
  { slug: 'roles', name: 'Роли и права', description: 'Матрица ролей и разрешений для операций', readiness: 'PLANNED', icon: 'shield' },
  { slug: 'sources', name: 'Источники обращений', description: 'Каналы поступления обращений в систему', readiness: 'MOCK', icon: 'inbox' },
  { slug: 'channels', name: 'Каналы', description: 'Настройка каналов коммуникации с клиентами', readiness: 'PLANNED', icon: 'channel' },
  { slug: 'topics', name: 'Тематики', description: 'Справочник тематик и категорий обращений', readiness: 'MOCK', icon: 'tag' },
  { slug: 'priorities', name: 'Приоритеты', description: 'Уровни приоритета и правила назначения', readiness: 'AVAILABLE', icon: 'priority' },
  { slug: 'sla', name: 'SLA', description: 'Нормативы обработки и контроль сроков', readiness: 'AVAILABLE', icon: 'clock' },
  { slug: 'routing', name: 'Маршрутизация', description: 'Правила автоматического назначения исполнителей', readiness: 'PLANNED', icon: 'route' },
  { slug: 'substitutions', name: 'Замещения', description: 'Временная замена исполнителей и делегирование', readiness: 'PLANNED', icon: 'swap' },
  { slug: 'response-templates', name: 'Шаблоны ответов', description: 'Справочник текстовых шаблонов для ответов', readiness: 'MOCK', icon: 'template' },
  { slug: 'document-templates', name: 'Шаблоны документов', description: 'Шаблоны исходящих документов и писем', readiness: 'MOCK', icon: 'document' },
  { slug: 'auto-replies', name: 'Автоответы', description: 'Автоматические ответы при регистрации обращений', readiness: 'PLANNED', icon: 'auto' },
  { slug: 'notifications', name: 'Уведомления', description: 'Правила email и push-уведомлений', readiness: 'PLANNED', icon: 'bell' },
  { slug: 'integrations', name: 'Интеграции', description: 'Подключение внешних систем и API', readiness: 'PLANNED', icon: 'plug' },
  { slug: 'audit', name: 'Аудит', description: 'Журнал действий пользователей в системе', readiness: 'MOCK', icon: 'audit' },
];

const SettingsRepository = (() => ({
  getAll: () => SETTINGS_SECTIONS_MOCK.map((s) => ({ ...s })),
  getBySlug: (slug) => SETTINGS_SECTIONS_MOCK.find((s) => s.slug === slug) || null,
  SETTINGS_READINESS,
}))();
