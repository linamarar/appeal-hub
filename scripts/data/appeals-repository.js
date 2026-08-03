/**
 * Mock repository — обращения, детали, история, комментарии (in-memory).
 */

const AppealsRepository = (() => {
  const list = [
    { id: 'AH-2026-01847', date: '29.07.2026', time: '12:14', title: 'Некачественное предоставление коммунальных услуг', category: 'ЖКХ', aiStatus: 'Обработано', status: 'Новое', isNew: true },
    { id: 'AH-2026-01846', date: '29.07.2026', time: '11:02', title: 'Жалоба на работу МФЦ', category: 'Госуслуги', aiStatus: 'Обработано', status: 'В работе' },
    { id: 'AH-2026-01845', date: '28.07.2026', time: '16:45', title: 'Нарушение сроков строительства', category: 'Строительство', aiStatus: 'Обработано', status: 'Закрыто' },
    { id: 'AH-2026-01844', date: '28.07.2026', time: '14:20', title: 'Проблема с начислением пенсии', category: 'Соцзащита', aiStatus: 'Обработано', status: 'В работе' },
    { id: 'AH-2026-01843', date: '28.07.2026', time: '09:15', title: 'Незаконная реклама на фасаде', category: 'Градостроительство', aiStatus: 'Обработка', status: 'Новое' },
    { id: 'AH-2026-01842', date: '27.07.2026', time: '17:30', title: 'Шум от проведения ремонтных работ', category: 'ЖКХ', aiStatus: 'Обработано', status: 'Закрыто' },
  ];

  const priorities = ['Высокий', 'Обычный', 'Низкий', 'Критический', 'Обычный', 'Низкий'];

  const details = {
    'AH-2026-01847': {
      updatedDate: '29.07.2026',
      updatedTime: '12:14',
      sla: '2 дн.',
      assignee: 'Не назначен',
      assigneeGroup: 'ЖКХ — 1 линия',
      source: 'PDF-документ',
      channel: 'Портал госуслуг',
      responseFormat: 'Email',
      region: 'г. Москва',
      initiator: 'Иванов Иван Петрович',
      description: 'Прошу рассмотреть вопрос о некачественном предоставлении коммунальных услуг по адресу проживания. С 15.03.2026 наблюдаются перебои с горячим водоснабжением — горячая вода отсутствует более 8 часов в сутки.\n\nОбращался в управляющую компанию «ЖилКомСервис» неоднократно, однако проблема не решена. Прошу провести проверку и принять меры.',
      client: {
        name: 'Иванов Иван Петрович',
        phone: '+7 (916) 123-45-67',
        email: 'ivanov.ip@mail.ru',
        type: 'Физическое лицо',
        appealsCount: 3,
      },
      attachments: [
        { id: 'att-1', name: 'Обращение_№1847.pdf', type: 'PDF', size: '2,4 МБ', date: '29.07.2026', author: 'Система' },
      ],
      history: [
        { id: 'h1', type: 'created', kind: 'system', author: 'Система', datetime: '29.07.2026 12:12', description: 'Обращение создано из документа' },
        { id: 'h2', type: 'status_changed', kind: 'system', author: 'AI', datetime: '29.07.2026 12:13', description: 'Статус изменён', oldValue: '—', newValue: 'Новая' },
        { id: 'h3', type: 'attachment', kind: 'system', author: 'Система', datetime: '29.07.2026 12:12', description: 'Добавлено вложение «Обращение_№1847.pdf»' },
      ],
    },
    'AH-2026-01846': {
      updatedDate: '29.07.2026',
      updatedTime: '11:45',
      sla: '1 дн.',
      assignee: 'Сидорова М.В.',
      assigneeGroup: 'Госуслуги — операторы',
      source: 'Веб-форма',
      channel: 'Сайт',
      responseFormat: 'Телефон',
      region: 'г. Москва',
      initiator: 'Петрова Анна Сергеевна',
      description: 'Жалоба на длительное ожидание в очереди и некорректную консультацию сотрудника МФЦ «Мои документы» на ул. Профсоюзная.',
      client: {
        name: 'Петрова Анна Сергеевна',
        phone: '+7 (903) 555-12-34',
        email: 'petrova.as@mail.ru',
        type: 'Физическое лицо',
      },
      attachments: [],
      history: [
        { id: 'h1', type: 'created', kind: 'system', author: 'Система', datetime: '29.07.2026 11:02', description: 'Обращение создано' },
        { id: 'h2', type: 'assignee_changed', kind: 'system', author: 'Администратор', datetime: '29.07.2026 11:15', description: 'Назначен исполнитель', oldValue: 'Не назначен', newValue: 'Сидорова М.В.' },
        { id: 'h3', type: 'status_changed', kind: 'system', author: 'Сидорова М.В.', datetime: '29.07.2026 11:20', description: 'Статус изменён', oldValue: 'Новая', newValue: 'В работе' },
      ],
    },
    'AH-2026-01845': {
      updatedDate: '28.07.2026',
      updatedTime: '18:00',
      sla: 'Нет данных',
      assignee: 'Иванова Е.К.',
      assigneeGroup: 'Строительный надзор',
      source: 'Email',
      channel: 'Почта',
      responseFormat: 'Email',
      region: 'Московская область',
      description: 'Нарушение сроков строительства многоквартирного дома по адресу ул. Строителей, 5.',
      client: { name: 'Козлов Дмитрий Александрович', type: 'Физическое лицо' },
      attachments: [
        { id: 'att-1', name: 'Фото_стройплощадки.jpg', type: 'JPG', size: '890 КБ', date: '28.07.2026', author: 'Козлов Д.А.' },
      ],
      history: [
        { id: 'h1', type: 'created', kind: 'system', author: 'Система', datetime: '28.07.2026 16:45', description: 'Обращение создано' },
        { id: 'h2', type: 'status_changed', kind: 'system', author: 'Иванова Е.К.', datetime: '28.07.2026 18:00', description: 'Статус изменён', oldValue: 'В работе', newValue: 'Закрыта' },
      ],
    },
    'AH-2026-01844': {
      updatedDate: '28.07.2026',
      updatedTime: '15:30',
      sla: '4 ч.',
      assignee: 'Петров И.Н.',
      assigneeGroup: 'Соцзащита',
      source: 'Портал',
      channel: 'Портал',
      responseFormat: 'Email',
      description: 'Проблема с начислением пенсии за июнь 2026 года.',
      client: { name: 'Смирнова Людмила Григорьевна', phone: '+7 (495) 111-22-33', type: 'Физическое лицо', appealsCount: 1 },
      attachments: [],
      history: [
        { id: 'h1', type: 'created', kind: 'system', author: 'Система', datetime: '28.07.2026 14:20', description: 'Обращение создано' },
      ],
    },
    'AH-2026-01843': {
      updatedDate: '28.07.2026',
      updatedTime: '09:15',
      sla: '3 дн.',
      assignee: 'Не назначен',
      assigneeGroup: 'Не указано',
      source: 'Мобильное приложение',
      channel: 'Приложение',
      responseFormat: 'Не указано',
      description: 'Незаконная реклама на фасаде жилого дома.',
      client: null,
      attachments: [],
      history: [
        { id: 'h1', type: 'created', kind: 'system', author: 'Система', datetime: '28.07.2026 09:15', description: 'Обращение создано' },
      ],
    },
    'AH-2026-01842': {
      updatedDate: '27.07.2026',
      updatedTime: '17:30',
      sla: 'Нет данных',
      assignee: 'Сидорова М.В.',
      assigneeGroup: 'ЖКХ — 1 линия',
      source: 'Телефон',
      channel: 'Кол-центр',
      responseFormat: 'Телефон',
      description: 'Шум от проведения ремонтных работ в вечернее время.',
      client: { name: 'Новикова Ольга Романовна', email: 'novikova@inbox.ru', type: 'Физическое лицо' },
      attachments: [],
      history: [
        { id: 'h1', type: 'created', kind: 'system', author: 'Система', datetime: '27.07.2026 17:30', description: 'Обращение создано' },
        { id: 'h2', type: 'status_changed', kind: 'system', author: 'Сидорова М.В.', datetime: '28.07.2026 10:00', description: 'Статус изменён', oldValue: 'В работе', newValue: 'Закрыта' },
      ],
    },
  };

  function mergeAppeal(id) {
    const base = list.find((a) => a.id === id);
    if (!base) return null;
    const index = list.findIndex((a) => a.id === id);
    const extra = details[id] || {};
    return {
      ...base,
      priority: priorities[index] || 'Обычный',
      ...extra,
      history: [...(extra.history || [])],
    };
  }

  function getList() {
    return list.map((item, index) => ({
      ...item,
      priority: priorities[index] || 'Обычный',
    }));
  }

  function getById(id, delayMs = 300) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mergeAppeal(id));
      }, delayMs);
    });
  }

  function updateStatus(id, newStatus) {
    const base = list.find((a) => a.id === id);
    if (!base) return null;
    const oldStatus = base.status;
    base.status = newStatus;
    const detail = details[id];
    if (detail) {
      detail.updatedDate = '29.07.2026';
      detail.updatedTime = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      detail.history.unshift({
        id: `h-${Date.now()}`,
        type: 'status_changed',
        kind: 'system',
        author: 'Администратор',
        datetime: `${detail.updatedDate} ${detail.updatedTime}`,
        description: 'Статус изменён',
        oldValue: oldStatus,
        newValue: newStatus,
      });
    }
    return mergeAppeal(id);
  }

  function acceptToWork(id) {
    const base = list.find((a) => a.id === id);
    if (!base || base.status !== 'Новое') return null;
    return updateStatus(id, 'В работе');
  }

  function addComment(id, text) {
    const detail = details[id];
    const base = list.find((a) => a.id === id);
    if (!detail || !base || !text.trim()) return null;

    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    detail.updatedDate = dateStr;
    detail.updatedTime = timeStr;
    detail.history.unshift({
      id: `c-${Date.now()}`,
      type: 'comment',
      kind: 'internal',
      author: 'Администратор',
      datetime: `${dateStr} ${timeStr}`,
      description: text.trim(),
    });
    return mergeAppeal(id);
  }

  function addAppeal(appeal) {
    list.unshift(appeal);
    priorities.unshift('Высокий');
    details[appeal.id] = details[appeal.id] || {
      updatedDate: appeal.date,
      updatedTime: appeal.time,
      sla: '2 дн.',
      assignee: 'Не назначен',
      assigneeGroup: 'Не указано',
      source: 'PDF-документ',
      channel: 'Портал',
      responseFormat: 'Email',
      region: 'г. Москва',
      description: 'Нет данных',
      client: null,
      attachments: [],
      history: [{ id: 'h-new', type: 'created', kind: 'system', author: 'Система', datetime: `${appeal.date} ${appeal.time}`, description: 'Обращение создано из документа' }],
    };
  }

  return { getList, getById, updateStatus, acceptToWork, addComment, addAppeal, mergeAppeal };
})();
