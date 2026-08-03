/**
 * Mock clients — расширенная модель и связанные данные.
 */

const CLIENT_STATUSES = {
  ACTIVE: { label: 'Активный', variant: 'success' },
  ATTENTION: { label: 'Требует внимания', variant: 'warning' },
  NO_OPEN: { label: 'Нет открытых обращений', variant: 'neutral' },
};

const CLIENTS_MOCK = [
  {
    id: 'CL-001', name: 'Соколова Марина Алексеевна', clientType: 'Физическое лицо', status: 'ATTENTION',
    phone: '+7 (495) 123-45-67', email: 'sokolova.ma@example.ru', preferredContactChannel: 'Email',
    objectOrContract: 'Договор №ДГ-2024-1182 · ЖК «Северный»',
    relatedObjects: [{ id: 'OBJ-001', name: 'Кв. 42, ЖК «Северный»', type: 'Квартира', linkStatus: 'Активна' }],
    relatedContracts: [{ id: 'CTR-001', number: 'ДГ-2024-1182', type: 'Договор обслуживания', date: '2024-03-15', status: 'Действует' }],
    totalAppeals: 5, openAppeals: 2, lastActivityAt: '2026-07-28T14:30:00', createdAt: '2024-03-15T10:00:00',
    importantNote: 'Клиент неоднократно обращался по теме ГВС. Рекомендуется приоритетная обработка.',
    tags: ['ЖКХ', 'Повторное обращение'], importantNoteUpdatedAt: '2026-07-20T11:00:00',
  },
  {
    id: 'CL-002', name: 'ООО «СтройКомфорт»', clientType: 'Юридическое лицо', status: 'ACTIVE',
    phone: '+7 (812) 987-65-43', email: 'info@stroykomfort-demo.ru', preferredContactChannel: 'Телефон',
    objectOrContract: 'Договор №ЮЛ-2023-0456 · БЦ «Горизонт»',
    relatedObjects: [{ id: 'OBJ-002', name: 'БЦ «Горизонт», офис 512', type: 'Коммерческая недвижимость', linkStatus: 'Активна' }],
    relatedContracts: [{ id: 'CTR-002', number: 'ЮЛ-2023-0456', type: 'Договор сопровождения', date: '2023-06-01', status: 'Действует' }],
    totalAppeals: 12, openAppeals: 1, lastActivityAt: '2026-07-30T09:15:00', createdAt: '2023-06-01T09:00:00',
    importantNote: 'Крупный корпоративный клиент. Контактное лицо — бухгалтерия.',
    tags: ['B2B', 'Договор'], importantNoteUpdatedAt: '2026-05-10T14:00:00',
  },
  {
    id: 'CL-003', name: 'Кузнецов Дмитрий Сергеевич', clientType: 'Физическое лицо', status: 'NO_OPEN',
    phone: '+7 (916) 555-12-34', email: 'kuznetsov.ds@example.ru', preferredContactChannel: 'Email',
    objectOrContract: 'Кв. 87 · ЖК «Речной»',
    relatedObjects: [{ id: 'OBJ-003', name: 'Кв. 87, ЖК «Речной»', type: 'Квартира', linkStatus: 'Активна' }],
    relatedContracts: [{ id: 'CTR-003', number: 'ДГ-2023-0890', type: 'Договор обслуживания', date: '2023-09-01', status: 'Закрыт' }],
    totalAppeals: 3, openAppeals: 0, lastActivityAt: '2026-06-15T11:00:00', createdAt: '2023-09-01T12:00:00',
    importantNote: null, tags: [], importantNoteUpdatedAt: null,
  },
  {
    id: 'CL-004', name: 'УК «ДомСервис Плюс»', clientType: 'Управляющая компания', status: 'ATTENTION',
    phone: '+7 (495) 777-88-99', email: 'support@domservice-demo.ru', preferredContactChannel: 'Email',
    objectOrContract: 'Сервисный договор №УК-2025-003',
    relatedObjects: [
      { id: 'OBJ-004a', name: 'ЖК «Парковый»', type: 'МКД', linkStatus: 'Активна' },
      { id: 'OBJ-004b', name: 'ЖК «Солнечный»', type: 'МКД', linkStatus: 'Активна' },
    ],
    relatedContracts: [{ id: 'CTR-004', number: 'УК-2025-003', type: 'Сервисный договор', date: '2025-01-10', status: 'Действует' }],
    totalAppeals: 28, openAppeals: 4, lastActivityAt: '2026-08-01T16:45:00', createdAt: '2025-01-10T08:00:00',
    importantNote: 'Партнёрская УК. Эскалация — через менеджера партнёрских программ.',
    tags: ['Партнёр', 'УК'], importantNoteUpdatedAt: '2026-07-01T10:00:00',
  },
  {
    id: 'CL-005', name: 'Волкова Елена Игоревна', clientType: 'Физическое лицо', status: 'ACTIVE',
    phone: '+7 (903) 234-56-78', email: 'volkova.ei@example.ru', preferredContactChannel: 'Телефон',
    objectOrContract: 'Договор №ДГ-2025-0891 · ЖК «Парковый»',
    relatedObjects: [{ id: 'OBJ-005', name: 'Кв. 15, ЖК «Парковый»', type: 'Квартира', linkStatus: 'Активна' }],
    relatedContracts: [{ id: 'CTR-005', number: 'ДГ-2025-0891', type: 'Договор обслуживания', date: '2025-04-01', status: 'Действует' }],
    totalAppeals: 1, openAppeals: 1, lastActivityAt: '2026-07-29T10:20:00', createdAt: '2025-04-01T11:00:00',
    importantNote: null, tags: ['Новый клиент'], importantNoteUpdatedAt: null,
  },
  {
    id: 'CL-006', name: 'АО «ТехноСтрой»', clientType: 'Юридическое лицо', status: 'NO_OPEN',
    phone: '+7 (495) 333-22-11', email: 'appeals@technostroy-demo.ru', preferredContactChannel: 'Email',
    objectOrContract: 'Объект «Склад-7» · договор сопровождения',
    relatedObjects: [{ id: 'OBJ-006', name: 'Склад-7, промзона', type: 'Склад', linkStatus: 'Активна' }],
    relatedContracts: [{ id: 'CTR-006', number: 'ЮЛ-2024-0777', type: 'Договор сопровождения', date: '2024-02-20', status: 'Действует' }],
    totalAppeals: 7, openAppeals: 0, lastActivityAt: '2026-05-20T08:30:00', createdAt: '2024-02-20T10:00:00',
    importantNote: 'Все обращения закрыты. Следующий плановый аудит — Q4 2026.',
    tags: ['B2B'], importantNoteUpdatedAt: '2026-05-20T08:30:00',
  },
  {
    id: 'CL-007', name: 'Морозов Павел Викторович', clientType: 'Физическое лицо', status: 'ATTENTION',
    phone: '+7 (926) 888-77-66', email: 'morozov.pv@example.ru', preferredContactChannel: 'Телефон',
    objectOrContract: 'Кв. 12 · ЖК «Солнечный»',
    relatedObjects: [{ id: 'OBJ-007', name: 'Кв. 12, ЖК «Солнечный»', type: 'Квартира', linkStatus: 'Активна' }],
    relatedContracts: [{ id: 'CTR-007', number: 'ДГ-2024-0333', type: 'Договор обслуживания', date: '2024-08-01', status: 'Действует' }],
    totalAppeals: 9, openAppeals: 3, lastActivityAt: '2026-08-02T13:10:00', createdAt: '2024-08-01T09:00:00',
    importantNote: 'Чувствителен к срокам ответа. Предыдущее обращение было просрочено.',
    tags: ['ЖКХ', 'SLA'], importantNoteUpdatedAt: '2026-08-01T16:00:00',
  },
  {
    id: 'CL-008', name: 'ИП Романова Ольга Петровна', clientType: 'Физическое лицо', status: 'NO_OPEN',
    phone: '+7 (903) 111-22-33', email: 'romanova.op@example.ru', preferredContactChannel: 'Email',
    objectOrContract: 'Договор №ДГ-2024-2207 · апартаменты',
    relatedObjects: [], relatedContracts: [],
    totalAppeals: 0, openAppeals: 0, lastActivityAt: '2026-04-10T15:00:00', createdAt: '2026-04-10T15:00:00',
    importantNote: null, tags: [], importantNoteUpdatedAt: null,
  },
  {
    id: 'CL-009', name: 'ООО «ГарантСтрой»', clientType: 'Юридическое лицо', status: 'ACTIVE',
    phone: '+7 (495) 444-55-66', email: 'office@garantstroy-demo.ru', preferredContactChannel: 'Email',
    objectOrContract: 'Договор №ЮЛ-2024-1120 · ТЦ «Центральный»',
    relatedObjects: [{ id: 'OBJ-009', name: 'ТЦ «Центральный»', type: 'Торговый центр', linkStatus: 'Активна' }],
    relatedContracts: [{ id: 'CTR-009', number: 'ЮЛ-2024-1120', type: 'Договор сопровождения', date: '2024-11-01', status: 'Действует' }],
    totalAppeals: 15, openAppeals: 2, lastActivityAt: '2026-07-31T17:30:00', createdAt: '2024-11-01T10:00:00',
    importantNote: 'Требуется согласование ответов с юридическим отделом клиента.',
    tags: ['B2B', 'Юридический'], importantNoteUpdatedAt: '2026-06-15T12:00:00',
  },
];

const CLIENT_DOCUMENTS_MOCK = [
  { id: 'CD-001', clientId: 'CL-001', name: 'Письменный ответ по ГВС', documentType: 'Письменный ответ', createdAt: '2026-07-25T10:00:00', source: 'Исходящий', relatedAppealId: 'AH-2026-C001-01', status: 'Отправлен', mockUrl: null },
  { id: 'CD-002', clientId: 'CL-001', name: 'Справка о регистрации обращения', documentType: 'Справка', createdAt: '2026-07-20T09:00:00', source: 'Система', relatedAppealId: 'AH-2026-C001-02', status: 'Готов', mockUrl: 'mock://doc-cd-002' },
  { id: 'CD-003', clientId: 'CL-002', name: 'Акт сверки Q2 2026', documentType: 'Акт сверки', createdAt: '2026-07-15T14:00:00', source: 'Исходящий', relatedAppealId: null, status: 'Отправлен', mockUrl: null },
  { id: 'CD-004', clientId: 'CL-007', name: 'Вложение клиента — фото счётчика', documentType: 'Вложение клиента', createdAt: '2026-08-01T11:00:00', source: 'Входящий', relatedAppealId: 'AH-2026-C007-01', status: 'Получен', mockUrl: 'mock://doc-cd-004' },
  { id: 'CD-005', clientId: 'CL-007', name: 'Дополнительное соглашение', documentType: 'Дополнительное соглашение', createdAt: '2026-07-28T16:00:00', source: 'Исходящий', relatedAppealId: 'AH-2026-C007-02', status: 'На согласовании', mockUrl: null },
];

const CLIENT_HISTORY_MOCK = [
  { id: 'CH-001', clientId: 'CL-001', type: 'CLIENT_CREATED', createdAt: '2024-03-15T10:00:00', author: 'Система', description: 'Клиент создан в системе', appealId: null },
  { id: 'CH-002', clientId: 'CL-001', type: 'APPEAL_REGISTERED', createdAt: '2026-07-20T09:00:00', author: 'Система', description: 'Зарегистрировано обращение AH-2026-C001-02', appealId: 'AH-2026-C001-02' },
  { id: 'CH-003', clientId: 'CL-001', type: 'CLIENT_MESSAGE', createdAt: '2026-07-22T11:30:00', author: 'Соколова М.А.', description: 'Клиент оставил сообщение по обращению', appealId: 'AH-2026-C001-01' },
  { id: 'CH-004', clientId: 'CL-001', type: 'STAFF_REPLY', createdAt: '2026-07-23T15:00:00', author: 'Иванова Е.К.', description: 'Сотрудник отправил ответ клиенту', appealId: 'AH-2026-C001-01' },
  { id: 'CH-005', clientId: 'CL-001', type: 'DOCUMENT_SENT', createdAt: '2026-07-25T10:00:00', author: 'Система', description: 'Отправлен документ «Письменный ответ по ГВС»', appealId: 'AH-2026-C001-01' },
  { id: 'CH-006', clientId: 'CL-001', type: 'STATUS_CHANGED', createdAt: '2026-07-26T09:00:00', author: 'Система', description: 'Статус обращения изменён: В работе → На согласовании', appealId: 'AH-2026-C001-01' },
  { id: 'CH-007', clientId: 'CL-007', type: 'CLIENT_CREATED', createdAt: '2024-08-01T09:00:00', author: 'Система', description: 'Клиент создан в системе', appealId: null },
  { id: 'CH-008', clientId: 'CL-007', type: 'APPEAL_REGISTERED', createdAt: '2026-07-30T10:00:00', author: 'Система', description: 'Зарегистрировано обращение AH-2026-C007-01', appealId: 'AH-2026-C007-01' },
  { id: 'CH-009', clientId: 'CL-007', type: 'RATING', createdAt: '2026-06-10T18:00:00', author: 'Морозов П.В.', description: 'Клиент оценил ответ: 3 из 5', appealId: 'AH-2026-C007-03' },
  { id: 'CH-010', clientId: 'CL-005', type: 'APPEAL_REGISTERED', createdAt: '2026-07-29T10:20:00', author: 'Система', description: 'Зарегистрировано первое обращение клиента', appealId: 'AH-2026-C005-01' },
  { id: 'CH-011', clientId: 'CL-008', type: 'CLIENT_CREATED', createdAt: '2026-04-10T15:00:00', author: 'Система', description: 'Клиент создан в системе', appealId: null },
];

const CLIENT_HISTORY_LABELS = {
  CLIENT_CREATED: 'Клиент создан',
  APPEAL_REGISTERED: 'Обращение зарегистрировано',
  CLIENT_MESSAGE: 'Сообщение клиента',
  STAFF_REPLY: 'Ответ сотрудника',
  DOCUMENT_SENT: 'Документ отправлен',
  STATUS_CHANGED: 'Изменение статуса',
  RATING: 'Оценка ответа',
};

const ClientsRepository = (() => {
  function getAll() { return CLIENTS_MOCK.map((c) => ({ ...c })); }
  function getById(id) {
    const c = CLIENTS_MOCK.find((x) => x.id === id);
    return c ? { ...c, relatedObjects: [...(c.relatedObjects || [])], relatedContracts: [...(c.relatedContracts || [])], tags: [...(c.tags || [])] } : null;
  }
  function getDocuments(clientId) {
    return CLIENT_DOCUMENTS_MOCK.filter((d) => d.clientId === clientId).map((d) => ({ ...d }));
  }
  function getHistory(clientId) {
    return CLIENT_HISTORY_MOCK.filter((h) => h.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((h) => ({ ...h, typeLabel: CLIENT_HISTORY_LABELS[h.type] || h.type }));
  }
  return { getAll, getById, getDocuments, getHistory, CLIENT_STATUSES, CLIENT_HISTORY_LABELS };
})();
