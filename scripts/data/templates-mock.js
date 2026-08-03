const TEMPLATE_STATUSES = {
  PUBLISHED: { label: 'Опубликован', variant: 'success' },
  DRAFT: { label: 'Черновик', variant: 'warning' },
  ARCHIVED: { label: 'Архивный', variant: 'neutral' },
};

const USAGE_MODES = { AUTO: 'Автоответ', SUGGEST: 'Предложение менеджеру', MANUAL: 'Только вручную' };

const RESPONSE_TEMPLATES_MOCK = [
  { id: 'RT-001', name: 'Подтверждение регистрации обращения', topic: 'Регистрация', version: '1.2', status: 'PUBLISHED', usage: 'AUTO', updatedAt: '2026-07-15T10:00:00', author: 'Администратор' },
  { id: 'RT-002', name: 'Запрос дополнительной информации', topic: 'Уточнение', version: '2.0', status: 'PUBLISHED', usage: 'SUGGEST', updatedAt: '2026-07-20T14:30:00', author: 'Иванова А.С.' },
  { id: 'RT-003', name: 'Ответ по статусу обращения', topic: 'Статус', version: '1.0', status: 'PUBLISHED', usage: 'MANUAL', updatedAt: '2026-06-28T09:00:00', author: 'Петров Д.В.' },
  { id: 'RT-004', name: 'Уведомление об изменении срока', topic: 'SLA', version: '1.1', status: 'DRAFT', usage: 'SUGGEST', updatedAt: '2026-07-25T16:00:00', author: 'Администратор' },
  { id: 'RT-005', name: 'Ответ по типовой жалобе', topic: 'Жалобы', version: '3.1', status: 'PUBLISHED', usage: 'AUTO', updatedAt: '2026-07-10T11:45:00', author: 'Сидорова М.К.' },
  { id: 'RT-006', name: 'Информирование о передаче в работу', topic: 'Маршрутизация', version: '1.0', status: 'ARCHIVED', usage: 'MANUAL', updatedAt: '2026-03-01T08:00:00', author: 'Администратор' },
];

const DOCUMENT_TEMPLATES_MOCK = [
  { id: 'DT-001', name: 'Письменный ответ клиенту', docType: 'Письмо', topic: 'Ответы', version: '2.3', needsApproval: true, status: 'PUBLISHED', updatedAt: '2026-07-18T12:00:00' },
  { id: 'DT-002', name: 'Справка', docType: 'Справка', topic: 'Документы', version: '1.0', needsApproval: false, status: 'PUBLISHED', updatedAt: '2026-06-05T10:30:00' },
  { id: 'DT-003', name: 'Дополнительное соглашение', docType: 'Договор', topic: 'Юридические', version: '1.5', needsApproval: true, status: 'DRAFT', updatedAt: '2026-07-22T15:00:00' },
  { id: 'DT-004', name: 'Акт сверки', docType: 'Акт', topic: 'Финансы', version: '1.1', needsApproval: true, status: 'PUBLISHED', updatedAt: '2026-07-01T09:00:00' },
  { id: 'DT-005', name: 'Уведомление', docType: 'Уведомление', topic: 'Информирование', version: '1.0', needsApproval: false, status: 'PUBLISHED', updatedAt: '2026-05-15T11:00:00' },
  { id: 'DT-006', name: 'Протокол рассмотрения', docType: 'Протокол', topic: 'Внутренние', version: '1.2', needsApproval: true, status: 'ARCHIVED', updatedAt: '2026-02-10T14:00:00' },
];

const TemplatesRepository = (() => ({
  getResponseTemplates: () => RESPONSE_TEMPLATES_MOCK.map((t) => ({ ...t })),
  getDocumentTemplates: () => DOCUMENT_TEMPLATES_MOCK.map((t) => ({ ...t })),
  TEMPLATE_STATUSES,
  USAGE_MODES,
}))();
