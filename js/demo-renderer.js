/**
 * docs/js/demo-renderer.js — Feature #94
 * Pure ES module: six named exports, no side effects on import.
 * Projects initialState (demo-state.js) into five popup panes.
 */

export function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderHome(state, popupRoot) {
  const statusEl = popupRoot.querySelector('#tp-status');
  const activeTab = state.tabs.find(t => t.active === true);
  const matchedRule = activeTab
    ? state.rules.find(r => r.enabled && activeTab.url.includes(r.pattern))
    : null;
  if (matchedRule) {
    statusEl.innerHTML =
      `<span class="tp-color-dot" style="background:${matchedRule.color}"></span>` +
      ` Matched: "${escapeHtml(matchedRule.name)}"` +
      `<button id="btn-move-to-group" type="button">Move to group</button>`;
  } else {
    statusEl.innerHTML = '<span class="tp-status-no-match">No matching rule</span>';
  }
}

export function renderRules(state, popupRoot) {
  const listEl = popupRoot.querySelector('#tp-rules-list');
  const countEl = popupRoot.querySelector('#tp-rules-count');
  const activeCount = state.rules.filter(r => r.enabled).length;
  countEl.textContent = `(${activeCount} active)`;
  listEl.innerHTML = state.rules.map((rule, i) =>
    `<li class="tp-rule-item">` +
    `<label class="tp-toggle"><input type="checkbox"${rule.enabled ? ' checked' : ''} data-rule-id="${rule.id}">` +
    `<span class="tp-toggle-track"></span></label>` +
    `<span class="tp-rule-name">${escapeHtml(rule.name)}</span>` +
    `<span class="tp-color-dot" style="background:${rule.color}"></span>` +
    `<span class="tp-rule-group">${escapeHtml(rule.name)}</span>` +
    `</li>`
  ).join('');
}

export function renderSessions(state, popupRoot) {
  const listEl = popupRoot.querySelector('#tp-sessions-list');
  if (!state.sessions.length) {
    listEl.innerHTML =
      '<div style="font-size:11px;color:#8e8e93;padding:4px 0">No saved sessions.</div>';
    return;
  }
  listEl.innerHTML = state.sessions.map(session =>
    `<div class="tp-session-item">` +
    `<div class="tp-session-info">` +
    `<span class="tp-session-name">${escapeHtml(session.name)}</span>` +
    `<span class="tp-session-meta">${session.tabCount} tabs · ${session.createdAt.slice(0, 10)}</span>` +
    `</div>` +
    `<div class="tp-session-actions">` +
    `<button class="tp-btn-link tp-restore-btn" style="font-size:11px;color:#007aff">Restore</button>` +
    `<button class="tp-btn-link tp-del-btn" data-session-id="${escapeHtml(session.id)}" style="font-size:11px;color:#aeaeb2">✕</button>` +
    `</div>` +
    `</div>`
  ).join('');
}

export function renderHibernate(state, popupRoot) {
  const badge = popupRoot.querySelector('#tp-hib-badge');
  const statsEl = popupRoot.querySelector('#tp-hib-stats');
  const listEl = popupRoot.querySelector('#tp-hib-list');
  const count = state.hibernated.length;
  if (count > 0) {
    badge.textContent = String(count);
    badge.hidden = false;
    statsEl.innerHTML = `<span class="tp-hib-stat">~${count * 16}MB saved</span>`;
    listEl.innerHTML = state.hibernated.map(tab =>
      `<div class="tp-hib-item">` +
      `<img class="tp-hib-favicon" src="${escapeHtml(tab.favIconUrl)}" alt="" />` +
      `<div class="tp-hib-info"><div class="tp-hib-title">${escapeHtml(tab.title)}</div></div>` +
      `<button class="tp-wake-btn" data-id="${escapeHtml(tab.id)}">Wake</button>` +
      `</div>`
    ).join('');
  } else {
    badge.hidden = true;
    statsEl.innerHTML = '';
    listEl.innerHTML =
      '<div style="padding:40px 24px;text-align:center;color:#8e8e93;font-size:13px">No hibernated tabs</div>';
  }
}

export function renderInsights(state, popupRoot) {
  const listEl = popupRoot.querySelector('#tp-insights-list');
  const badge = popupRoot.querySelector('#tp-insights-badge');
  if (!state.insights.length) {
    listEl.innerHTML =
      '<div style="padding:40px 24px;text-align:center;color:#8e8e93;font-size:13px;line-height:1.5">Your tabs are well-organized!</div>';
    badge.hidden = true;
    return;
  }
  badge.textContent = String(state.insights.length);
  badge.hidden = false;
  const cards = state.insights.map((insight, i) => {
    const ruleHtml = 'suggestedRule' in insight
      ? `<div class="tp-insight-rule"><span class="tp-insight-rule-name">${escapeHtml(insight.suggestedRule.name)}</span></div>`
      : '';
    const createBtn = insight.type === 'suggestion'
      ? `<button class="tp-insight-btn tp-insight-create" data-insight-idx="${i}">Create rule</button>`
      : '';
    return `<div class="tp-insight-card">` +
      `<div class="tp-insight-header">` +
      `<span class="tp-insight-title">${escapeHtml(insight.title)}</span>` +
      `<span class="tp-insight-type">${escapeHtml(insight.type)}</span>` +
      `</div>` +
      `<p class="tp-insight-body">${escapeHtml(insight.body)}</p>` +
      ruleHtml +
      `<div class="tp-insight-actions">` +
      createBtn +
      `<button class="tp-insight-btn tp-insight-dismiss" data-insight-idx="${i}">Dismiss</button>` +
      `</div>` +
      `</div>`;
  }).join('');
  listEl.innerHTML =
    cards + '<div class="tp-insights-cta"><span>Unlock full insights with</span><strong>Takt Premium</strong></div>';
}
