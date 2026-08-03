/**
 * Appeals list + shell (Figma UI Kit migration)
 * Legacy views: flow, appeal-detail — unchanged logic
 */

const STATUS_META = {
  'Новое': { label: 'Новая', variant: 'warning' },
  'В работе': { label: 'В работе', variant: 'info' },
  'Закрыто': { label: 'Закрыта', variant: 'success' },
};

const PRIORITY_LABELS = ['Низкий', 'Обычный', 'Высокий', 'Критический'];

const PRIORITY_META = {
  'Низкий': 'low',
  'Обычный': 'normal',
  'Средний': 'normal',
  'Высокий': 'high',
  'Критический': 'critical',
};

const appeals = [
  {
    id: 'AH-2026-01847',
    date: '29.07.2026',
    time: '12:14',
    title: 'Некачественное предоставление коммунальных услуг',
    category: 'ЖКХ',
    aiStatus: 'Обработано',
    status: 'Новое',
    isNew: true,
  },
  {
    id: 'AH-2026-01846',
    date: '29.07.2026',
    time: '11:02',
    title: 'Жалоба на работу МФЦ',
    category: 'Госуслуги',
    aiStatus: 'Обработано',
    status: 'В работе',
  },
  {
    id: 'AH-2026-01845',
    date: '28.07.2026',
    time: '16:45',
    title: 'Нарушение сроков строительства',
    category: 'Строительство',
    aiStatus: 'Обработано',
    status: 'Закрыто',
  },
  {
    id: 'AH-2026-01844',
    date: '28.07.2026',
    time: '14:20',
    title: 'Проблема с начислением пенсии',
    category: 'Соцзащита',
    aiStatus: 'Обработано',
    status: 'В работе',
  },
  {
    id: 'AH-2026-01843',
    date: '28.07.2026',
    time: '09:15',
    title: 'Незаконная реклама на фасаде',
    category: 'Градостроительство',
    aiStatus: 'Обработка',
    status: 'Новое',
  },
  {
    id: 'AH-2026-01842',
    date: '27.07.2026',
    time: '17:30',
    title: 'Шум от проведения ремонтных работ',
    category: 'ЖКХ',
    aiStatus: 'Обработано',
    status: 'Закрыто',
  },
];

const appealCardData = {
  id: 'AH-2026-01847',
  title: 'Некачественное предоставление коммунальных услуг',
  category: 'ЖКХ',
  date: '29.07.2026',
  priority: 'Средний',
  status: 'Новое',
  source: 'PDF-документ',
  region: 'г. Москва',
};

function renderStatusBadge(status) {
  const meta = STATUS_META[status] || { label: status, variant: 'neutral' };
  return `<span class="ui-status-badge ui-status-badge--${meta.variant}">${meta.label}</span>`;
}

function renderPriorityBadge(priority) {
  const variant = PRIORITY_META[priority] || 'normal';
  return `<span class="ui-priority-badge ui-priority-badge--${variant}">${priority}</span>`;
}

function displayPriority(index) {
  return PRIORITY_LABELS[index % PRIORITY_LABELS.length];
}

function renderAppealCard(container, data, full = false) {
  container.innerHTML = `
    <div class="appeal-card__header">
      <div>
        <div class="appeal-card__id">${data.id}</div>
        <div class="appeal-card__title">${data.title}</div>
      </div>
      <span class="badge badge--neutral">${data.status}</span>
    </div>
    <div class="appeal-card__grid">
      <div>
        <div class="appeal-card__field-label">Категория</div>
        <div class="appeal-card__field-value">${data.category}</div>
      </div>
      <div>
        <div class="appeal-card__field-label">Дата поступления</div>
        <div class="appeal-card__field-value">${data.date}</div>
      </div>
      <div>
        <div class="appeal-card__field-label">Приоритет</div>
        <div class="appeal-card__field-value">${data.priority}</div>
      </div>
      <div>
        <div class="appeal-card__field-label">Источник</div>
        <div class="appeal-card__field-value">${data.source}</div>
      </div>
      <div>
        <div class="appeal-card__field-label">Регион</div>
        <div class="appeal-card__field-value">${data.region}</div>
      </div>
      <div>
        <div class="appeal-card__field-label">AI-статус</div>
        <div class="appeal-card__field-value"><span class="badge badge--success">Обработано</span></div>
      </div>
    </div>
  `;
}

function updateAppealsCount(count) {
  const el = document.getElementById('appeals-count');
  if (el) el.textContent = `Найдено обращений: ${count}`;
}

function setListState(state) {
  const loading = document.getElementById('appeals-loading');
  const empty = document.getElementById('appeals-empty');
  const data = document.getElementById('appeals-data-panel');

  [loading, empty].forEach((panel) => {
    if (panel) panel.classList.toggle('is-visible', panel.dataset.state === state);
  });
  if (data) data.classList.toggle('is-hidden', state !== 'loaded');
}

function renderTable() {
  const tbody = document.getElementById('appeals-table-body');
  if (!tbody) return;

  updateAppealsCount(appeals.length);
  setListState(appeals.length ? 'loaded' : 'empty');

  tbody.innerHTML = appeals.map((a, index) => {
    const priority = displayPriority(index);
    return `
    <tr>
      <td><span class="ui-data-table__id">${a.id}</span></td>
      <td class="ui-data-table__muted">—</td>
      <td>${a.title}</td>
      <td>${renderStatusBadge(a.status)}</td>
      <td>${renderPriorityBadge(priority)}</td>
      <td class="ui-data-table__muted">—</td>
      <td class="ui-data-table__muted">—</td>
      <td class="ui-data-table__muted">${a.date}, ${a.time}</td>
      <td><button type="button" class="ui-data-table__link" data-go="appeal-detail">Открыть</button></td>
    </tr>
  `;
  }).join('');
}

function switchView(viewId) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('view--active'));
  const target = document.getElementById(`view-${viewId}`);
  if (target) target.classList.add('view--active');

  document.querySelectorAll('.shell-nav__item[data-view]').forEach((n) => {
    n.classList.toggle('is-active', n.dataset.view === viewId);
  });
}

function setFlowStep(step) {
  document.querySelectorAll('.flow-panel').forEach((p) => p.classList.remove('flow-panel--active'));
  document.getElementById(`flow-step-${step}`).classList.add('flow-panel--active');

  document.querySelectorAll('.flow-step').forEach((s) => {
    const n = parseInt(s.dataset.step, 10);
    s.classList.remove('flow-step--done', 'flow-step--active');
    if (n < step) s.classList.add('flow-step--done');
    if (n === step) s.classList.add('flow-step--active');
  });
}

function simulateAIProcessing() {
  setFlowStep(2);

  const lastItem = document.querySelector('.ai-log__item--active');
  setTimeout(() => {
    lastItem.classList.remove('ai-log__item--active');
    lastItem.classList.add('ai-log__item--done');
    lastItem.querySelector('.ai-log__spinner').outerHTML = '<span class="ai-log__check">✓</span>';
    lastItem.textContent = '';
    lastItem.insertAdjacentHTML('afterbegin', '<span class="ai-log__check">✓</span> Извлечены структурированные данные');

    setTimeout(() => {
      const newItem = document.createElement('div');
      newItem.className = 'ai-log__item ai-log__item--done';
      newItem.innerHTML = '<span class="ai-log__check">✓</span> Карточка обращения создана';
      lastItem.parentElement.appendChild(newItem);

      setTimeout(() => {
        renderAppealCard(document.getElementById('new-appeal-card'), appealCardData);
        setFlowStep(3);

        if (!appeals.find((a) => a.isNew)) {
          appeals.unshift({
            id: appealCardData.id,
            date: '29.07.2026',
            time: '12:14',
            title: appealCardData.title,
            category: appealCardData.category,
            aiStatus: 'Обработано',
            status: 'Новое',
            isNew: true,
          });
          renderTable();
        }
      }, 600);
    }, 800);
  }, 2000);
}

function initFlow() {
  const uploadZone = document.getElementById('upload-zone');
  const fileInput = document.getElementById('file-input');
  const incomingPreview = document.getElementById('incoming-preview');
  if (!uploadZone || !fileInput) return;

  document.getElementById('btn-upload').addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    uploadZone.hidden = true;
    incomingPreview.hidden = false;
  });

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('upload-zone--dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('upload-zone--dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('upload-zone--dragover');
    uploadZone.hidden = true;
    incomingPreview.hidden = false;
  });

  document.getElementById('btn-start-ai').addEventListener('click', simulateAIProcessing);
}

function initNavigation() {
  document.querySelectorAll('[data-view]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.disabled) return;
      switchView(el.dataset.view);
      if (el.dataset.view === 'flow') {
        setFlowStep(1);
        document.getElementById('upload-zone').hidden = false;
        document.getElementById('incoming-preview').hidden = true;
      }
    });
  });

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-go]');
    if (!trigger) return;
    switchView(trigger.dataset.go);
  });

  const tbody = document.getElementById('appeals-table-body');
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      if (e.target.closest('[data-go]')) return;
      const row = e.target.closest('tr');
      if (row) switchView('appeal-detail');
    });
  }

  const resetBtn = document.getElementById('filters-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.appeals-toolbar select').forEach((s) => {
        s.selectedIndex = 0;
      });
      const search = document.getElementById('appeals-search');
      if (search) search.value = '';
    });
  }

  const refreshBtn = document.getElementById('appeals-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      setListState('loading');
      setTimeout(renderTable, 300);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setListState('loading');
  setTimeout(renderTable, 400);

  renderAppealCard(document.getElementById('detail-appeal-card'), appealCardData, true);
  initFlow();
  initNavigation();
});
