/**
 * Mock repository — хранение обращений (in-memory, session).
 */

const AppealsRepository = (() => {
  const records = {
    'AH-2026-01847': {
      id: 'AH-2026-01847',
      title: 'Некачественное предоставление коммунальных услуг',
      category: 'ЖКХ',
      aiStatus: 'Обработано',
      priority: 'Высокий',
      statusCode: 'NEW',
      assigneeId: null,
      assigneeGroup: 'ЖКХ — 1 линия',
      createdAt: '2026-07-29T12:14:00+04:00',
      updatedAt: '2026-07-29T12:14:00+04:00',
      slaDueAt: '2026-08-10T12:14:00+04:00',
      slaState: null,
      source: 'PDF-документ',
      channel: 'Портал госуслуг',
      responseFormat: 'Email',
      region: 'г. Москва',
      initiator: 'Иванов Иван Петрович',
      description: 'Прошу рассмотреть вопрос о некачественном предоставлении коммунальных услуг по адресу проживания. С 15.03.2026 наблюдаются перебои с горячим водоснабжением — горячая вода отсутствует более 8 часов в сутки.\n\nОбращался в управляющую компанию «ЖилКомСервис» неоднократно, однако проблема не решена. Прошу провести проверку и принять меры.',
      client: { name: 'Иванов Иван Петрович', phone: '+7 (916) 123-45-67', email: 'ivanov.ip@mail.ru', type: 'Физическое лицо', appealsCount: 3 },
      attachments: [{ id: 'att-1', name: 'Обращение_№1847.pdf', type: 'PDF', size: '2,4 МБ', date: '29.07.2026', author: 'Система' }],
      history: [
        { id: 'h1', appealId: 'AH-2026-01847', type: 'CREATED', actor: 'Система', createdAt: '2026-07-29T12:12:00+04:00', description: 'Обращение создано из документа', kind: 'system' },
      ],
      isNew: true,
    },
    'AH-2026-01846': {
      id: 'AH-2026-01846',
      title: 'Жалоба на работу МФЦ',
      category: 'Госуслуги',
      aiStatus: 'Обработано',
      priority: 'Обычный',
      statusCode: 'ASSIGNED',
      assigneeId: 'user-001',
      assigneeGroup: 'Госуслуги — операторы',
      createdAt: '2026-08-02T11:02:00+04:00',
      updatedAt: '2026-08-02T11:20:00+04:00',
      slaDueAt: '2026-08-03T15:00:00+04:00',
      slaState: null,
      source: 'Веб-форма',
      channel: 'Сайт',
      responseFormat: 'Телефон',
      region: 'г. Москва',
      initiator: 'Петрова Анна Сергеевна',
      description: 'Жалоба на длительное ожидание в очереди и некорректную консультацию сотрудника МФЦ «Мои документы» на ул. Профсоюзная.',
      client: { name: 'Петрова Анна Сергеевна', phone: '+7 (903) 555-12-34', email: 'petrova.as@mail.ru', type: 'Физическое лицо' },
      attachments: [],
      history: [
        { id: 'h1', appealId: 'AH-2026-01846', type: 'CREATED', actor: 'Система', createdAt: '2026-08-02T11:02:00+04:00', description: 'Обращение создано', kind: 'system' },
        { id: 'h2', appealId: 'AH-2026-01846', type: 'ASSIGNEE_ASSIGNED', actor: 'Администратор', createdAt: '2026-08-02T11:15:00+04:00', oldValue: 'Не назначен', newValue: 'Сидорова М.В.', description: 'Назначен исполнитель', kind: 'user' },
        { id: 'h3', appealId: 'AH-2026-01846', type: 'STATUS_CHANGED', actor: 'Администратор', createdAt: '2026-08-02T11:16:00+04:00', oldValue: 'Новая', newValue: 'Назначена исполнителю', description: 'Статус изменён', kind: 'user' },
      ],
    },
    'AH-2026-01845': {
      id: 'AH-2026-01845',
      title: 'Нарушение сроков строительства',
      category: 'Строительство',
      aiStatus: 'Обработано',
      priority: 'Низкий',
      statusCode: 'CLOSED',
      assigneeId: 'user-002',
      assigneeGroup: 'Строительный надзор',
      createdAt: '2026-07-28T16:45:00+04:00',
      updatedAt: '2026-07-28T18:00:00+04:00',
      slaDueAt: '2026-08-01T16:45:00+04:00',
      slaState: null,
      source: 'Email',
      channel: 'Почта',
      responseFormat: 'Email',
      region: 'Московская область',
      description: 'Нарушение сроков строительства многоквартирного дома по адресу ул. Строителей, 5.',
      client: { name: 'Козлов Дмитрий Александрович', type: 'Физическое лицо' },
      attachments: [{ id: 'att-1', name: 'Фото_стройплощадки.jpg', type: 'JPG', size: '890 КБ', date: '28.07.2026', author: 'Козлов Д.А.' }],
      history: [
        { id: 'h1', appealId: 'AH-2026-01845', type: 'CREATED', actor: 'Система', createdAt: '2026-07-28T16:45:00+04:00', description: 'Обращение создано', kind: 'system' },
        { id: 'h2', appealId: 'AH-2026-01845', type: 'STATUS_CHANGED', actor: 'Иванова Е.К.', createdAt: '2026-07-28T18:00:00+04:00', oldValue: 'В работе', newValue: 'Закрыта', description: 'Статус изменён', kind: 'user' },
      ],
    },
    'AH-2026-01844': {
      id: 'AH-2026-01844',
      title: 'Проблема с начислением пенсии',
      category: 'Соцзащита',
      aiStatus: 'Обработано',
      priority: 'Критический',
      statusCode: 'IN_PROGRESS',
      assigneeId: 'user-003',
      assigneeGroup: 'Соцзащита',
      createdAt: '2026-07-28T14:20:00+04:00',
      updatedAt: '2026-07-28T15:30:00+04:00',
      slaDueAt: '2026-08-01T14:20:00+04:00',
      slaState: null,
      source: 'Портал',
      channel: 'Портал',
      responseFormat: 'Email',
      description: 'Проблема с начислением пенсии за июнь 2026 года.',
      client: { name: 'Смирнова Людмила Григорьевна', phone: '+7 (495) 111-22-33', type: 'Физическое лицо', appealsCount: 1 },
      attachments: [],
      history: [
        { id: 'h1', appealId: 'AH-2026-01844', type: 'CREATED', actor: 'Система', createdAt: '2026-07-28T14:20:00+04:00', description: 'Обращение создано', kind: 'system' },
      ],
    },
    'AH-2026-01843': {
      id: 'AH-2026-01843',
      title: 'Незаконная реклама на фасаде',
      category: 'Градостроительство',
      aiStatus: 'Обработка',
      priority: 'Обычный',
      statusCode: 'NEW',
      assigneeId: null,
      assigneeGroup: 'Не указано',
      createdAt: '2026-07-28T09:15:00+04:00',
      updatedAt: '2026-07-28T09:15:00+04:00',
      slaDueAt: '2026-08-05T09:15:00+04:00',
      slaState: 'PAUSED',
      source: 'Мобильное приложение',
      channel: 'Приложение',
      responseFormat: 'Не указано',
      description: 'Незаконная реклама на фасаде жилого дома.',
      client: null,
      attachments: [],
      history: [
        { id: 'h1', appealId: 'AH-2026-01843', type: 'CREATED', actor: 'Система', createdAt: '2026-07-28T09:15:00+04:00', description: 'Обращение создано', kind: 'system' },
      ],
    },
    'AH-2026-01842': {
      id: 'AH-2026-01842',
      title: 'Шум от проведения ремонтных работ',
      category: 'ЖКХ',
      aiStatus: 'Обработано',
      priority: 'Низкий',
      statusCode: 'CLOSED',
      assigneeId: 'user-001',
      assigneeGroup: 'ЖКХ — 1 линия',
      createdAt: '2026-07-27T17:30:00+04:00',
      updatedAt: '2026-07-28T10:00:00+04:00',
      slaDueAt: '2026-07-30T17:30:00+04:00',
      slaState: null,
      source: 'Телефон',
      channel: 'Кол-центр',
      responseFormat: 'Телефон',
      description: 'Шум от проведения ремонтных работ в вечернее время.',
      client: { name: 'Новикова Ольга Романовна', email: 'novikova@inbox.ru', type: 'Физическое лицо' },
      attachments: [],
      history: [
        { id: 'h1', appealId: 'AH-2026-01842', type: 'CREATED', actor: 'Система', createdAt: '2026-07-27T17:30:00+04:00', description: 'Обращение создано', kind: 'system' },
      ],
    },
  };

  function getRawById(id) {
    return records[id] ? { ...records[id], history: [...records[id].history] } : null;
  }

  function saveRecord(record) {
    records[record.id] = record;
    return record;
  }

  function touchUpdatedAt(record) {
    record.updatedAt = new Date().toISOString();
    return record;
  }

  function pushHistory(record, event) {
    record.history.unshift({
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      appealId: record.id,
      kind: event.kind || 'user',
      ...event,
    });
  }

  function getList() {
    return Object.values(records).map((r) => ({ ...r }));
  }

  function getById(id, delayMs = 200) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getRawById(id)), delayMs);
    });
  }

  function addAppealFromFlow(appealCard) {
    const id = appealCard.id;
    if (records[id]) return records[id];
    records[id] = {
      id,
      title: appealCard.title,
      category: appealCard.category,
      aiStatus: 'Обработано',
      priority: 'Высокий',
      statusCode: 'NEW',
      assigneeId: null,
      assigneeGroup: 'Не указано',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      slaState: null,
      source: appealCard.source || 'PDF-документ',
      channel: 'Портал',
      responseFormat: 'Email',
      region: appealCard.region,
      description: 'Нет данных',
      client: null,
      attachments: [],
      history: [{ id: 'h-new', appealId: id, type: 'CREATED', actor: 'Система', createdAt: new Date().toISOString(), description: 'Обращение создано из документа', kind: 'system' }],
      isNew: true,
    };
    return records[id];
  }

  return {
    getList,
    getById,
    getRawById,
    saveRecord,
    touchUpdatedAt,
    pushHistory,
    addAppealFromFlow,
  };
})();
