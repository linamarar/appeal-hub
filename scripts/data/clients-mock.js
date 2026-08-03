/**
 * Mock clients data — вымышленные персональные данные.
 */

const CLIENT_STATUSES = {
  ACTIVE: { label: 'Активный', variant: 'success' },
  ATTENTION: { label: 'Требует внимания', variant: 'warning' },
  NO_OPEN: { label: 'Нет открытых обращений', variant: 'neutral' },
};

const CLIENTS_MOCK = [
  { id: 'CL-001', name: 'Соколова Марина Алексеевна', phone: '+7 (495) 123-45-67', email: 'sokolova.ma@example.ru', clientType: 'Физическое лицо', objectOrContract: 'Договор №ДГ-2024-1182 · ЖК «Северный»', totalAppeals: 5, openAppeals: 2, lastActivityAt: '2026-07-28T14:30:00', status: 'ATTENTION' },
  { id: 'CL-002', name: 'ООО «СтройКомфорт»', phone: '+7 (812) 987-65-43', email: 'info@stroykomfort-demo.ru', clientType: 'Юридическое лицо', objectOrContract: 'Договор №ЮЛ-2023-0456 · БЦ «Горизонт»', totalAppeals: 12, openAppeals: 1, lastActivityAt: '2026-07-30T09:15:00', status: 'ACTIVE' },
  { id: 'CL-003', name: 'Кузнецов Дмитрий Сергеевич', phone: '+7 (916) 555-12-34', email: 'kuznetsov.ds@example.ru', clientType: 'Физическое лицо', objectOrContract: 'Кв. 87 · ЖК «Речной»', totalAppeals: 3, openAppeals: 0, lastActivityAt: '2026-06-15T11:00:00', status: 'NO_OPEN' },
  { id: 'CL-004', name: 'УК «ДомСервис Плюс»', phone: '+7 (495) 777-88-99', email: 'support@domservice-demo.ru', clientType: 'Управляющая компания', objectOrContract: 'Сервисный договор №УК-2025-003', totalAppeals: 28, openAppeals: 4, lastActivityAt: '2026-08-01T16:45:00', status: 'ATTENTION' },
  { id: 'CL-005', name: 'Волкова Елена Игоревна', phone: '+7 (903) 234-56-78', email: 'volkova.ei@example.ru', clientType: 'Физическое лицо', objectOrContract: 'Договор №ДГ-2025-0891 · ЖК «Парковый»', totalAppeals: 1, openAppeals: 1, lastActivityAt: '2026-07-29T10:20:00', status: 'ACTIVE' },
  { id: 'CL-006', name: 'АО «ТехноСтрой»', phone: '+7 (495) 333-22-11', email: 'appeals@technostroy-demo.ru', clientType: 'Юридическое лицо', objectOrContract: 'Объект «Склад-7» · договор сопровождения', totalAppeals: 7, openAppeals: 0, lastActivityAt: '2026-05-20T08:30:00', status: 'NO_OPEN' },
  { id: 'CL-007', name: 'Морозов Павел Викторович', phone: '+7 (926) 888-77-66', email: 'morozov.pv@example.ru', clientType: 'Физическое лицо', objectOrContract: 'Кв. 12 · ЖК «Солнечный»', totalAppeals: 9, openAppeals: 3, lastActivityAt: '2026-08-02T13:10:00', status: 'ATTENTION' },
  { id: 'CL-008', name: 'ИП Романова Ольга Петровна', phone: '+7 (903) 111-22-33', email: 'romanova.op@example.ru', clientType: 'Физическое лицо', objectOrContract: 'Договор №ДГ-2024-2207 · апартаменты', totalAppeals: 2, openAppeals: 0, lastActivityAt: '2026-04-10T15:00:00', status: 'NO_OPEN' },
  { id: 'CL-009', name: 'ООО «ГарантСтрой»', phone: '+7 (495) 444-55-66', email: 'office@garantstroy-demo.ru', clientType: 'Юридическое лицо', objectOrContract: 'Договор №ЮЛ-2024-1120 · ТЦ «Центральный»', totalAppeals: 15, openAppeals: 2, lastActivityAt: '2026-07-31T17:30:00', status: 'ACTIVE' },
];

const ClientsRepository = (() => {
  function getAll() { return CLIENTS_MOCK.map((c) => ({ ...c })); }
  function getById(id) { return CLIENTS_MOCK.find((c) => c.id === id) || null; }
  return { getAll, getById, CLIENT_STATUSES };
})();
