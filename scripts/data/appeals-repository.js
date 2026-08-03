/**
 * Mock repository — хранение обращений (in-memory, session).
 */

const AppealsRepository = (() => {
  function createInitialAttachment(appealId, legacy) {
    const ext = getFileExtension(legacy.name);
    return {
      id: legacy.id || generateAttachmentId(),
      appealId,
      messageId: null,
      name: legacy.name,
      mimeType: EXTENSION_MIME_MAP[ext] || 'application/octet-stream',
      size: typeof legacy.sizeBytes === 'number' ? legacy.sizeBytes : parseLegacySize(legacy.size),
      createdAt: legacy.createdAt || legacy.date || new Date().toISOString(),
      uploadedBy: legacy.uploadedBy || 'system',
      uploadedByName: legacy.author || legacy.uploadedByName || 'Система',
      visibility: legacy.visibility || MESSAGE_VISIBILITY.CLIENT,
      mockUrl: `mock://${legacy.id || generateAttachmentId()}`,
      status: ATTACHMENT_STATUS.READY,
      source: legacy.source || (legacy.author === 'Система' ? 'initial' : 'client'),
    };
  }

  function parseLegacySize(sizeStr) {
    if (!sizeStr || typeof sizeStr !== 'string') return 0;
    const normalized = sizeStr.replace(',', '.').toLowerCase();
    const mb = normalized.match(/([\d.]+)\s*мб/);
    if (mb) return Math.round(parseFloat(mb[1]) * 1024 * 1024);
    const kb = normalized.match(/([\d.]+)\s*кб/);
    if (kb) return Math.round(parseFloat(kb[1]) * 1024);
    return 0;
  }

  function historyEventToMessage(event) {
    const isComment = event.type === HISTORY_EVENT_TYPES.COMMENT_ADDED;
    return {
      id: event.id,
      appealId: event.appealId,
      type: isComment ? MESSAGE_TYPES.INTERNAL_COMMENT : MESSAGE_TYPES.SYSTEM_EVENT,
      authorId: event.authorId || null,
      authorName: event.actor || 'Система',
      authorRole: event.kind === 'system' ? 'Система' : null,
      text: event.description || '',
      createdAt: event.createdAt,
      visibility: isComment ? MESSAGE_VISIBILITY.INTERNAL : MESSAGE_VISIBILITY.INTERNAL,
      attachments: event.attachmentIds || [],
      eventType: event.type,
      oldValue: event.oldValue || null,
      newValue: event.newValue || null,
      reason: event.reason || null,
    };
  }

  function ensureMessages(record) {
    if (!record.messages) record.messages = [];
    if (record._messagesMerged) return record.messages;

    const historyMessages = (record.history || []).map(historyEventToMessage);
    const existingKeys = new Set(
      record.messages.map((m) => `${m.type}:${m.createdAt}:${m.text}:${m.eventType || ''}`)
    );

    for (const hm of historyMessages) {
      const key = `${hm.type}:${hm.createdAt}:${hm.text}:${hm.eventType || ''}`;
      if (!existingKeys.has(key)) {
        record.messages.push(hm);
        existingKeys.add(key);
      }
    }

    record._messagesMerged = true;
    return record.messages;
  }

  function ensureAttachments(record) {
    if (record.attachmentsNormalized) return record.attachments;
    const normalized = (record.attachments || []).map((a) =>
      a.mimeType ? a : createInitialAttachment(record.id, a)
    );
    record.attachments = normalized;
    record.attachmentsNormalized = true;
    return record.attachments;
  }

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
      attachments: [{ id: 'att-1', name: 'Обращение_№1847.pdf', type: 'PDF', size: '2,4 МБ', date: '29.07.2026', author: 'Система', createdAt: '2026-07-29T12:12:00+04:00' }],
      messages: [
        {
          id: 'msg-client-1847-1',
          appealId: 'AH-2026-01847',
          type: MESSAGE_TYPES.CLIENT_MESSAGE,
          authorId: 'client-ivanov',
          authorName: 'Иванов Иван Петрович',
          authorRole: 'Клиент',
          text: 'Добрый день! Прошу ускорить рассмотрение обращения — проблема с горячей водой сохраняется.',
          createdAt: '2026-07-30T09:30:00+04:00',
          visibility: MESSAGE_VISIBILITY.CLIENT,
          attachments: [],
        },
      ],
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
      messages: [
        {
          id: 'msg-client-1846-1',
          appealId: 'AH-2026-01846',
          type: MESSAGE_TYPES.CLIENT_MESSAGE,
          authorId: 'client-petrova',
          authorName: 'Петрова Анна Сергеевна',
          authorRole: 'Клиент',
          text: 'Жду ответа по телефону, как указано в обращении.',
          createdAt: '2026-08-02T11:05:00+04:00',
          visibility: MESSAGE_VISIBILITY.CLIENT,
          attachments: [],
        },
        {
          id: 'msg-internal-1846-1',
          appealId: 'AH-2026-01846',
          type: MESSAGE_TYPES.INTERNAL_COMMENT,
          authorId: 'user-admin',
          authorName: 'Администратор',
          authorRole: 'Администратор',
          text: 'Проверить запись с камер наблюдения в МФЦ за указанную дату.',
          createdAt: '2026-08-02T11:18:00+04:00',
          visibility: MESSAGE_VISIBILITY.INTERNAL,
          attachments: [],
        },
      ],
      history: [
        { id: 'h1', appealId: 'AH-2026-01846', type: 'CREATED', actor: 'Система', createdAt: '2026-08-02T11:02:00+04:00', description: 'Обращение создано', kind: 'system' },
        { id: 'h2', appealId: 'AH-2026-01846', type: 'ASSIGNEE_ASSIGNED', actor: 'Администратор', createdAt: '2026-08-02T11:15:00+04:00', oldValue: 'Не назначен', newValue: 'Сидорова М.В.', description: 'Назначен исполнитель', kind: 'user' },
        { id: 'h3', appealId: 'AH-2026-01846', type: 'STATUS_CHANGED', actor: 'Администратор', createdAt: '2026-08-02T11:16:00+04:00', oldValue: 'Новая', newValue: 'Назначена исполнителю', description: 'Статус изменён', kind: 'user' },
        { id: 'h4', appealId: 'AH-2026-01846', type: 'COMMENT_ADDED', actor: 'Администратор', createdAt: '2026-08-02T11:18:00+04:00', description: 'Проверить запись с камер наблюдения в МФЦ за указанную дату.', kind: 'internal' },
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
      attachments: [{ id: 'att-1', name: 'Фото_стройплощадки.jpg', type: 'JPG', size: '890 КБ', date: '28.07.2026', author: 'Козлов Д.А.', createdAt: '2026-07-28T16:44:00+04:00', source: 'client' }],
      messages: [],
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
      messages: [],
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
      messages: [],
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
      messages: [],
      history: [
        { id: 'h1', appealId: 'AH-2026-01842', type: 'CREATED', actor: 'Система', createdAt: '2026-07-27T17:30:00+04:00', description: 'Обращение создано', kind: 'system' },
      ],
    },
    'AH-2026-C001-01': {
      id: 'AH-2026-C001-01', clientId: 'CL-001', title: 'Перебои с горячей водой', category: 'ЖКХ', priority: 'Высокий', statusCode: 'IN_PROGRESS',
      assigneeId: 'user-004', createdAt: '2026-07-20T09:00:00+04:00', updatedAt: '2026-07-26T09:00:00+04:00', slaDueAt: '2026-08-05T09:00:00+04:00',
      client: { name: 'Соколова Марина Алексеевна', type: 'Физическое лицо' }, attachments: [], messages: [], history: [{ id: 'h1', type: 'CREATED', actor: 'Система', createdAt: '2026-07-20T09:00:00+04:00', description: 'Обращение создано', kind: 'system' }],
    },
    'AH-2026-C001-02': {
      id: 'AH-2026-C001-02', clientId: 'CL-001', title: 'Запрос справки по начислениям', category: 'ЖКХ', priority: 'Обычный', statusCode: 'NEW',
      assigneeId: null, createdAt: '2026-07-22T14:00:00+04:00', updatedAt: '2026-07-22T14:00:00+04:00', slaDueAt: '2026-08-01T14:00:00+04:00',
      client: { name: 'Соколова Марина Алексеевна', type: 'Физическое лицо' }, attachments: [], messages: [], history: [{ id: 'h1', type: 'CREATED', actor: 'Система', createdAt: '2026-07-22T14:00:00+04:00', description: 'Обращение создано', kind: 'system' }],
    },
    'AH-2026-C001-03': {
      id: 'AH-2026-C001-03', clientId: 'CL-001', title: 'Шум от лифта', category: 'ЖКХ', priority: 'Низкий', statusCode: 'CLOSED',
      assigneeId: 'user-004', createdAt: '2026-05-10T10:00:00+04:00', updatedAt: '2026-05-20T16:00:00+04:00', slaDueAt: '2026-05-17T10:00:00+04:00',
      client: { name: 'Соколова Марина Алексеевна', type: 'Физическое лицо' }, attachments: [], messages: [], history: [{ id: 'h1', type: 'CREATED', actor: 'Система', createdAt: '2026-05-10T10:00:00+04:00', description: 'Обращение создано', kind: 'system' }],
    },
    'AH-2026-C003-01': {
      id: 'AH-2026-C003-01', clientId: 'CL-003', title: 'Перерасчёт коммунальных платежей', category: 'ЖКХ', priority: 'Обычный', statusCode: 'CLOSED',
      assigneeId: 'user-002', createdAt: '2026-04-01T11:00:00+04:00', updatedAt: '2026-04-15T10:00:00+04:00', slaDueAt: '2026-04-08T11:00:00+04:00',
      client: { name: 'Кузнецов Дмитрий Сергеевич', type: 'Физическое лицо' }, attachments: [], messages: [], history: [{ id: 'h1', type: 'CREATED', actor: 'Система', createdAt: '2026-04-01T11:00:00+04:00', description: 'Обращение создано', kind: 'system' }],
    },
    'AH-2026-C005-01': {
      id: 'AH-2026-C005-01', clientId: 'CL-005', title: 'Неисправность домофона', category: 'ЖКХ', priority: 'Средний', statusCode: 'ASSIGNED',
      assigneeId: 'user-001', createdAt: '2026-07-29T10:20:00+04:00', updatedAt: '2026-07-29T11:00:00+04:00', slaDueAt: '2026-08-05T10:20:00+04:00',
      client: { name: 'Волкова Елена Игоревна', type: 'Физическое лицо' }, attachments: [], messages: [], history: [{ id: 'h1', type: 'CREATED', actor: 'Система', createdAt: '2026-07-29T10:20:00+04:00', description: 'Обращение создано', kind: 'system' }],
    },
    'AH-2026-C007-01': {
      id: 'AH-2026-C007-01', clientId: 'CL-007', title: 'Некорректные показания счётчика', category: 'ЖКХ', priority: 'Высокий', statusCode: 'IN_PROGRESS',
      assigneeId: 'user-004', createdAt: '2026-07-30T10:00:00+04:00', updatedAt: '2026-08-01T11:00:00+04:00', slaDueAt: '2026-08-06T10:00:00+04:00',
      client: { name: 'Морозов Павел Викторович', type: 'Физическое лицо' }, attachments: [], messages: [], history: [{ id: 'h1', type: 'CREATED', actor: 'Система', createdAt: '2026-07-30T10:00:00+04:00', description: 'Обращение создано', kind: 'system' }],
    },
    'AH-2026-C007-02': {
      id: 'AH-2026-C007-02', clientId: 'CL-007', title: 'Запрос акта выполненных работ', category: 'Договор', priority: 'Обычный', statusCode: 'NEW',
      assigneeId: null, createdAt: '2026-08-01T09:00:00+04:00', updatedAt: '2026-08-01T09:00:00+04:00', slaDueAt: '2026-08-08T09:00:00+04:00',
      client: { name: 'Морозов Павел Викторович', type: 'Физическое лицо' }, attachments: [], messages: [], history: [{ id: 'h1', type: 'CREATED', actor: 'Система', createdAt: '2026-08-01T09:00:00+04:00', description: 'Обращение создано', kind: 'system' }],
    },
    'AH-2026-C007-03': {
      id: 'AH-2026-C007-03', clientId: 'CL-007', title: 'Жалоба на качество уборки', category: 'ЖКХ', priority: 'Низкий', statusCode: 'CLOSED',
      assigneeId: 'user-001', createdAt: '2026-06-01T10:00:00+04:00', updatedAt: '2026-06-10T18:00:00+04:00', slaDueAt: '2026-06-08T10:00:00+04:00',
      client: { name: 'Морозов Павел Викторович', type: 'Физическое лицо' }, attachments: [], messages: [], history: [{ id: 'h1', type: 'CREATED', actor: 'Система', createdAt: '2026-06-01T10:00:00+04:00', description: 'Обращение создано', kind: 'system' }],
    },
  };

  function cloneRecord(record) {
    if (!record) return null;
    ensureMessages(record);
    ensureAttachments(record);
    return {
      ...record,
      attachments: record.attachments.map((a) => ({ ...a })),
      messages: record.messages.map((m) => ({ ...m, attachments: [...(m.attachments || [])] })),
      history: [...record.history],
    };
  }

  function getRawById(id) {
    const record = records[id];
    return record ? cloneRecord(record) : null;
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

  function pushMessage(record, message) {
    ensureMessages(record);
    record.messages.push(message);
  }

  function pushAttachment(record, attachment) {
    ensureAttachments(record);
    record.attachments.push(attachment);
  }

  function getMessages(record) {
    return ensureMessages(record);
  }

  function getAttachments(record) {
    return ensureAttachments(record);
  }

  function getList() {
    return Object.values(records).map((r) => cloneRecord(r));
  }

  function getByClientId(clientId) {
    return Object.values(records).filter((r) => r.clientId === clientId).map((r) => cloneRecord(r));
  }

  function getById(id, delayMs = 200) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getRawById(id)), delayMs);
    });
  }

  function generateFlowAppealId() {
    let max = 0;
    Object.keys(records).forEach((key) => {
      const match = /^AH-2026-(\d+)$/.exec(key);
      if (match) max = Math.max(max, parseInt(match[1], 10));
    });
    return `AH-2026-${String(max + 1).padStart(5, '0')}`;
  }

  function addAppealFromFlow(appealCard = {}) {
    const requestedId = appealCard.id;
    const id = requestedId && !records[requestedId] ? requestedId : generateFlowAppealId();
    const now = new Date().toISOString();
    const sourceAttachments = Array.isArray(appealCard.attachments) ? appealCard.attachments : [];
    const attachments = sourceAttachments.map((item) => ({
      ...item,
      id: item.id || generateAttachmentId(),
      appealId: id,
    }));

    records[id] = {
      id,
      title: appealCard.title || 'Новое обращение',
      category: appealCard.category || 'Не указано',
      aiStatus: 'Обработано',
      priority: 'Высокий',
      statusCode: 'NEW',
      assigneeId: null,
      assigneeGroup: 'Не указано',
      createdAt: now,
      updatedAt: now,
      slaDueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      slaState: null,
      source: appealCard.source || 'PDF-документ',
      channel: 'Портал',
      responseFormat: 'Email',
      region: appealCard.region || null,
      description: appealCard.description || 'Нет данных',
      client: appealCard.client ? { ...appealCard.client } : null,
      attachments,
      messages: [],
      history: [{
        id: `h-${id}`,
        appealId: id,
        type: 'CREATED',
        actor: 'Система',
        createdAt: now,
        description: 'Обращение создано из документа',
        kind: 'system',
      }],
      isNew: true,
    };
    ensureMessages(records[id]);
    return records[id];
  }

  return {
    getList,
    getByClientId,
    getById,
    getRawById,
    saveRecord,
    touchUpdatedAt,
    pushHistory,
    pushMessage,
    pushAttachment,
    getMessages,
    getAttachments,
    ensureMessages,
    ensureAttachments,
    generateFlowAppealId,
    addAppealFromFlow,
    historyEventToMessage,
  };
})();
