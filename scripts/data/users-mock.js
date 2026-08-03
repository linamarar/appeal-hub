/**
 * Mock-пользователи для назначения исполнителей.
 */

const MOCK_USERS = [
  { id: 'user-001', name: 'Сидорова М.В.', role: 'Оператор', department: 'Госуслуги — операторы', active: true, absent: false },
  { id: 'user-002', name: 'Иванова Е.К.', role: 'Специалист', department: 'Строительный надзор', active: true, absent: false },
  { id: 'user-003', name: 'Петров И.Н.', role: 'Специалист', department: 'Соцзащита', active: true, absent: false },
  { id: 'user-004', name: 'Кузнецов А.П.', role: 'Оператор', department: 'ЖКХ — 1 линия', active: true, absent: false },
  { id: 'user-005', name: 'Морозова Т.С.', role: 'Руководитель группы', department: 'ЖКХ — 1 линия', active: true, absent: true },
  { id: 'user-inactive', name: 'Неактивный пользователь', role: 'Оператор', department: 'Архив', active: false, absent: false },
];

const CURRENT_USER = {
  id: 'user-admin',
  name: 'Администратор',
  role: 'Администратор',
  department: 'Операционный центр',
  permissions: [
    'appeal.accept',
    'appeal.changeStatus',
    'appeal.assign',
    'appeal.reassign',
    'appeal.addInternalComment',
    'appeal.addAttachment',
    'appeal.viewInternalComments',
  ],
};

function getActiveUsers() {
  return MOCK_USERS.filter((u) => u.active && !u.absent);
}

function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id) || null;
}

function getCurrentUser() {
  return CURRENT_USER;
}
