/**
 * Единый справочник статусов обращений.
 */

const APPEAL_STATUSES = {
  NEW: {
    code: 'NEW',
    label: 'Новая',
    variant: 'warning',
    macroGroup: 'intake',
    isTerminal: false,
  },
  SYSTEM_REVIEW: {
    code: 'SYSTEM_REVIEW',
    label: 'На проверке системой',
    variant: 'info',
    macroGroup: 'intake',
    isTerminal: false,
  },
  ASSIGNED: {
    code: 'ASSIGNED',
    label: 'Назначена исполнителю',
    variant: 'info',
    macroGroup: 'processing',
    isTerminal: false,
  },
  IN_PROGRESS: {
    code: 'IN_PROGRESS',
    label: 'В работе',
    variant: 'info',
    macroGroup: 'processing',
    isTerminal: false,
  },
  WAITING_SPECIALIST: {
    code: 'WAITING_SPECIALIST',
    label: 'Ожидает ответа специалиста',
    variant: 'warning',
    macroGroup: 'waiting',
    isTerminal: false,
  },
  WAITING_CLIENT: {
    code: 'WAITING_CLIENT',
    label: 'Ожидает ответа клиента',
    variant: 'warning',
    macroGroup: 'waiting',
    isTerminal: false,
  },
  RESPONSE_SENT: {
    code: 'RESPONSE_SENT',
    label: 'Ответ отправлен',
    variant: 'success',
    macroGroup: 'resolution',
    isTerminal: false,
  },
  CLOSED: {
    code: 'CLOSED',
    label: 'Закрыта',
    variant: 'success',
    macroGroup: 'closed',
    isTerminal: true,
  },
  REOPENED: {
    code: 'REOPENED',
    label: 'Возвращена в работу',
    variant: 'danger',
    macroGroup: 'processing',
    isTerminal: false,
  },
};

const STATUS_TRANSITIONS = {
  NEW: ['SYSTEM_REVIEW', 'ASSIGNED'],
  SYSTEM_REVIEW: ['ASSIGNED', 'RESPONSE_SENT'],
  ASSIGNED: ['IN_PROGRESS'],
  IN_PROGRESS: ['WAITING_SPECIALIST', 'WAITING_CLIENT', 'RESPONSE_SENT', 'CLOSED'],
  WAITING_SPECIALIST: ['IN_PROGRESS'],
  WAITING_CLIENT: ['IN_PROGRESS', 'RESPONSE_SENT', 'CLOSED'],
  RESPONSE_SENT: ['CLOSED', 'REOPENED'],
  CLOSED: ['REOPENED'],
  REOPENED: ['IN_PROGRESS'],
};

function getStatusDefinition(code) {
  return APPEAL_STATUSES[code] || null;
}

function getStatusLabel(code) {
  return getStatusDefinition(code)?.label || code;
}

function getAvailableStatusTransitions(currentStatus) {
  return (STATUS_TRANSITIONS[currentStatus] || []).map((code) => ({
    code,
    ...APPEAL_STATUSES[code],
  }));
}

function isTransitionAllowed(fromStatus, toStatus) {
  return (STATUS_TRANSITIONS[fromStatus] || []).includes(toStatus);
}

const REASSIGN_REASONS = [
  { code: 'WRONG_TOPIC', label: 'Неверно определена тематика' },
  { code: 'DIFFERENT_PROFILE', label: 'Требуется другой профиль специалиста' },
  { code: 'LOAD_BALANCING', label: 'Перераспределение нагрузки' },
  { code: 'SUBSTITUTION', label: 'Замещение отсутствующего сотрудника' },
  { code: 'OTHER', label: 'Другое' },
];

const HISTORY_EVENT_TYPES = {
  STATUS_CHANGED: 'STATUS_CHANGED',
  ASSIGNEE_ASSIGNED: 'ASSIGNEE_ASSIGNED',
  ASSIGNEE_CHANGED: 'ASSIGNEE_CHANGED',
  APPEAL_ACCEPTED: 'APPEAL_ACCEPTED',
  SLA_STATE_CHANGED: 'SLA_STATE_CHANGED',
  COMMENT_ADDED: 'COMMENT_ADDED',
  CREATED: 'CREATED',
  ATTACHMENT_ADDED: 'ATTACHMENT_ADDED',
};
