/**
 * Analytics dashboard — mock KPI and CSS charts.
 */

const AnalyticsPage = (() => {
  let period = '30d';
  let eventsBound = false;

  function renderKpiCards(kpis) {
    const root = document.getElementById('analytics-kpis');
    if (!root) return;
    const cards = [
      { label: 'Всего обращений', value: kpis.total },
      { label: 'Новые', value: kpis.new },
      { label: 'В работе', value: kpis.inProgress },
      { label: 'Закрыто', value: kpis.closed },
      { label: 'Выполнение SLA', value: `${kpis.slaCompliance}%` },
      { label: 'Среднее время обработки', value: `${kpis.avgProcessingHours} ч` },
      { label: 'Просрочено', value: kpis.overdue, danger: true },
      { label: 'Автоматически обработано', value: kpis.autoProcessed },
    ];
    root.innerHTML = cards.map((c) => `
      <div class="analytics-kpi${c.danger ? ' analytics-kpi--danger' : ''}">
        <span class="analytics-kpi__label">${PageUtils.escapeHtml(c.label)}</span>
        <span class="analytics-kpi__value">${PageUtils.escapeHtml(String(c.value))}</span>
      </div>
    `).join('');
  }

  function renderBarRows(containerId, items, maxVal) {
    const root = document.getElementById(containerId);
    if (!root) return;
    const max = maxVal || Math.max(...items.map((i) => i.value || i.pct || 0), 1);
    root.innerHTML = items.map((item) => {
      const val = item.value ?? item.pct;
      const pct = Math.round((val / max) * 100);
      return `
        <div class="analytics-bar-row">
          <span class="analytics-bar-row__label">${PageUtils.escapeHtml(item.label || item.name || item.day)}</span>
          <div class="analytics-bar-row__track"><div class="analytics-bar-row__fill" style="width:${item.pct != null ? item.pct : pct}%"></div></div>
          <span class="analytics-bar-row__value">${PageUtils.escapeHtml(String(val))}${item.pct != null ? '%' : ''}</span>
        </div>`;
    }).join('');
  }

  function renderDynamics(items) {
    const root = document.getElementById('analytics-dynamics');
    if (!root) return;
    const max = Math.max(...items.map((i) => i.value), 1);
    root.innerHTML = `<div class="analytics-dynamics">${items.map((item) => {
      const h = Math.round((item.value / max) * 100);
      return `<div class="analytics-dynamics__col"><div class="analytics-dynamics__bar" style="height:${h}%"></div><span class="analytics-dynamics__label">${PageUtils.escapeHtml(item.day)}</span><span class="analytics-dynamics__value">${item.value}</span></div>`;
    }).join('')}</div>`;
  }

  function renderAssigneeTable(items) {
    const tbody = document.getElementById('analytics-assignee-body');
    if (!tbody) return;
    tbody.innerHTML = items.map((a) => `
      <tr><td>${PageUtils.escapeHtml(a.name)}</td><td>${a.count}</td></tr>
    `).join('');
  }

  function render(data) {
    renderKpiCards(data.kpis);
    renderBarRows('analytics-by-status', data.byStatus);
    renderBarRows('analytics-by-topic', data.byTopic);
    renderBarRows('analytics-by-source', data.bySource);
    renderBarRows('analytics-sla', data.slaBreakdown);
    renderAssigneeTable(data.assigneeLoad);
    renderDynamics(data.dynamics);
  }

  function setPeriod(p) {
    period = p;
    document.querySelectorAll('.analytics-period__btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.period === p);
    });
    const data = AnalyticsRepository.getData(period);
    PageUtils.setPanelState('analytics', 'loaded');
    render(data);
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;
    document.querySelectorAll('.analytics-period__btn').forEach((btn) => {
      btn.addEventListener('click', () => setPeriod(btn.dataset.period));
    });
  }

  function load() {
    PageUtils.setPanelState('analytics', 'loading');
    setTimeout(() => {
      bindEvents();
      setPeriod('30d');
    }, 200);
  }

  return { load };
})();
