/**
 * docs/js/demo-controller.js — Feature #95 + #96 + #97 + #98 + #99 + #100 + #101 + #102 + #103
 * Wires BrowserStage tab-change, tab-group-toggle, and group action events to state mutation + renderHome.
 */

import { renderHome, renderHibernate, renderRules, renderSessions, renderInsights } from './demo-renderer.js';

export function setActiveTab(state, index) {
  if (state.tabs.length === 0) return;
  // ponytail: clamping formula per spec — typeof+isInteger+<0 covers all invalid inputs
  const effectiveIndex =
    typeof index !== 'number' || !Number.isInteger(index) || index < 0
      ? 0
      : Math.min(index, state.tabs.length - 1);
  state.tabs.forEach((t, i) => {
    t.active = i === effectiveIndex;
  });
}

// ponytail: pure helper — mutates matched group's collapsed via Boolean() coercion; no-op on miss
export function setTabGroupCollapsed(state, id, collapsed) {
  const group = state.tabGroups.find((g) => g.id === id);
  if (group) group.collapsed = Boolean(collapsed);
}

// ponytail: sets all tabGroups[i].collapsed to true; no-op on empty array
export function collapseAll(state) {
  state.tabGroups.forEach((g) => {
    g.collapsed = true;
  });
}

// ponytail: symmetric inverse of collapseAll — sets all tabGroups[i].collapsed to false
export function expandAll(state) {
  state.tabGroups.forEach((g) => {
    g.collapsed = false;
  });
}

// ponytail: symmetric inverse of groupAll — clears all groups and sets every tab's groupId to null
export function ungroupAll(state) {
  if (state.tabs.length === 0) return;
  state.tabGroups = [];
  state.tabs.forEach((t) => {
    t.groupId = null;
  });
}

// ponytail: assigns all falsy-groupId tabs to the first group; creates default group if none exist
export function groupAll(state) {
  if (state.tabs.length === 0) return;
  if (state.tabGroups.length === 0) {
    state.tabGroups.push({ id: 'group-default', title: 'Work', color: 'blue', collapsed: false });
  }
  const target = state.tabGroups[0].id;
  state.tabs.forEach((t) => {
    if (!t.groupId) t.groupId = target;
  });
}

// ponytail: flip rule.enabled; no-op on miss or falsy ruleId (find returns undefined, early return)
export function toggleRule(state, ruleId) {
  const rule = state.rules.find((r) => r.id === ruleId);
  if (!rule) return;
  rule.enabled = !rule.enabled;
}

// ponytail: splice matched hibernated entry → push reconstructed Tab with groupId:null/active:false
export function wakeTab(state, tabId) {
  const idx = state.hibernated.findIndex((h) => h.id === tabId);
  if (idx === -1) return;
  const [h] = state.hibernated.splice(idx, 1);
  state.tabs.push({
    id: h.id,
    title: h.title,
    url: h.url,
    favIconUrl: h.favIconUrl,
    groupId: null,
    active: false,
  });
}

// ponytail: forEach push reconstructed Tab (groupId:null/active:false) → clear hibernated via length=0
export function wakeAll(state) {
  if (state.hibernated.length === 0) return;
  state.hibernated.forEach((h) => {
    state.tabs.push({
      id: h.id,
      title: h.title,
      url: h.url,
      favIconUrl: h.favIconUrl,
      groupId: null,
      active: false,
    });
  });
  state.hibernated.length = 0;
}

// ponytail: findIndex on sessions by id, splice on hit; no-op on miss or falsy sessionId
export function deleteSession(state, sessionId) {
  if (!sessionId) return;
  const idx = state.sessions.findIndex((s) => s.id === sessionId);
  if (idx === -1) return;
  state.sessions.splice(idx, 1);
}

// ponytail: discard all hibernated entries via length=0 (array identity preserved); does NOT touch tabs
export function clearHibernated(state) {
  if (state.hibernated.length === 0) return;
  state.hibernated.length = 0;
}

// ponytail: find insight by id → splice on hit; silent no-op on falsy or miss
export function dismissInsight(state, insightId) {
  if (!insightId) return;
  const idx = state.insights.findIndex((i) => i.id === insightId);
  if (idx === -1) return;
  state.insights.splice(idx, 1);
}

// ponytail: find insight by id → push shallow clone of suggestedRule to rules → splice insight; no-op on miss/no-key
export function createRuleFromInsight(state, insightId) {
  const insight = state.insights.find((i) => i.id === insightId);
  if (!insight) return;
  if (!('suggestedRule' in insight)) return;
  state.rules.push({ ...insight.suggestedRule });
  const idx = state.insights.findIndex((i) => i.id === insightId);
  state.insights.splice(idx, 1);
}

// ponytail: pure push — caller generates id/name/createdAt/tabCount; no clock/rng here
export function saveSession(state, { id, name, createdAt, tabCount }) {
  state.sessions.push({ id, name, createdAt, tabCount });
}

// ponytail: splice active tab → push 4-field entry to hibernated → re-anchor tabs[0].active
export function hibernateTab(state) {
  const idx = state.tabs.findIndex((t) => t.active === true);
  if (idx === -1) return;
  const [removed] = state.tabs.splice(idx, 1);
  state.hibernated.push({
    id: removed.id,
    title: removed.title,
    url: removed.url,
    favIconUrl: removed.favIconUrl,
  });
  if (state.tabs.length > 0) state.tabs[0].active = true;
}

const mapTabGroups = (state) =>
  state.tabGroups.map((g) => ({
    id: g.id,
    label: g.title,
    color: g.color,
    collapsed: g.collapsed,
  }));

const mapTabs = (state) =>
  state.tabs.map((t) => ({ title: t.title, url: t.url, groupId: t.groupId }));

export function wireController(el, popupRoot, state) {
  el.tabs = mapTabs(state);
  el.tabGroups = mapTabGroups(state);
  renderSessions(state, popupRoot);
  renderInsights(state, popupRoot);
  el.addEventListener('tab-change', (event) => {
    setActiveTab(state, event.detail.index);
    renderHome(state, popupRoot);
  });
  el.addEventListener('tab-group-toggle', (event) => {
    setTabGroupCollapsed(state, event.detail.id, event.detail.collapsed);
    el.tabGroups = mapTabGroups(state);
  });
  const btn = popupRoot.querySelector('#btn-group-all');
  if (btn) {
    btn.addEventListener('click', () => {
      groupAll(state);
      el.tabs = mapTabs(state);
      el.tabGroups = mapTabGroups(state);
      el.showToast('All tabs grouped', { type: 'success', duration: 1500 });
      renderHome(state, popupRoot);
    });
  }
  const ungroupBtn = popupRoot.querySelector('#btn-ungroup-all');
  if (ungroupBtn) {
    ungroupBtn.addEventListener('click', () => {
      ungroupAll(state);
      el.tabs = mapTabs(state);
      el.tabGroups = mapTabGroups(state);
      el.showToast('All groups removed', { type: 'success', duration: 1500 });
      renderHome(state, popupRoot);
    });
  }
  const collapseBtn = popupRoot.querySelector('#btn-collapse-all');
  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      if (state.tabGroups.length === 0) return;
      collapseAll(state);
      el.tabGroups = mapTabGroups(state);
      el.showToast('All groups collapsed', { type: 'success', duration: 1500 });
      renderHome(state, popupRoot);
    });
  }
  const expandBtn = popupRoot.querySelector('#btn-expand-all');
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      if (state.tabGroups.length === 0) return;
      expandAll(state);
      el.tabGroups = mapTabGroups(state);
      el.showToast('All groups expanded', { type: 'success', duration: 1500 });
      renderHome(state, popupRoot);
    });
  }
  const hibBtn = popupRoot.querySelector('#btn-hibernate-tab');
  if (hibBtn) {
    hibBtn.addEventListener('click', () => {
      hibernateTab(state);
      el.tabs = mapTabs(state);
      el.showToast('Tab hibernated', { type: 'success', duration: 1500 });
      renderHome(state, popupRoot);
      renderHibernate(state, popupRoot);
    });
  }
  const wakeAllBtn = popupRoot.querySelector('#btn-wake-all');
  if (wakeAllBtn) {
    wakeAllBtn.addEventListener('click', () => {
      wakeAll(state);
      el.tabs = mapTabs(state);
      renderHibernate(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('All tabs awakened', { type: 'success', duration: 1500 });
    });
  }
  const clearHibBtn = popupRoot.querySelector('#btn-clear-hib');
  if (clearHibBtn) {
    clearHibBtn.addEventListener('click', () => {
      clearHibernated(state);
      renderHibernate(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('All hibernated tabs cleared', { type: 'success', duration: 1500 });
    });
  }
  const saveSessionBtn = popupRoot.querySelector('#btn-save-session');
  if (saveSessionBtn) {
    saveSessionBtn.addEventListener('click', () => {
      const id = 'ses-' + Date.now();
      const name = 'Session ' + (state.sessions.length + 1);
      const createdAt = new Date().toISOString();
      const tabCount = state.tabs.length;
      saveSession(state, { id, name, createdAt, tabCount });
      renderSessions(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Session saved', { type: 'success', duration: 1500 });
    });
  }
  popupRoot.addEventListener('click', (e) => {
    if (e.target.tagName === 'INPUT' && e.target.dataset.ruleId) {
      const ruleId = e.target.dataset.ruleId;
      toggleRule(state, ruleId);
      const rule = state.rules.find((r) => r.id === ruleId);
      renderRules(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast(rule.enabled ? 'Rule enabled' : 'Rule disabled', {
        type: 'success',
        duration: 1500,
      });
    } else if (e.target.id === 'btn-move-to-group') {
      e.target.disabled = true;
      e.target.textContent = 'Moved!';
      const activeTab = state.tabs.find((t) => t.active);
      const matchedRule = activeTab
        ? state.rules.find((r) => r.enabled && activeTab.url.includes(r.pattern))
        : null;
      if (!matchedRule) return;
      el.showToast('Moved to "' + matchedRule.name + '"', { type: 'success', duration: 1500 });
      setTimeout(() => {
        e.target.disabled = false;
        e.target.textContent = 'Move to group';
      }, 1500);
    } else if (e.target.classList?.contains('tp-wake-btn')) {
      const tabId = e.target.dataset.id;
      wakeTab(state, tabId);
      el.tabs = mapTabs(state);
      renderHibernate(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Tab awakened', { type: 'success', duration: 1500 });
    } else if (e.target.classList?.contains('tp-del-btn')) {
      const sessionId = e.target.dataset.sessionId;
      if (!state.sessions.some((s) => s.id === sessionId)) return;
      deleteSession(state, sessionId);
      renderSessions(state, popupRoot);
      el.showToast('Session deleted', { type: 'success', duration: 1500 });
    } else if (e.target.classList?.contains('tp-insight-create')) {
      const insightId = e.target.dataset.insightId;
      if (!state.insights.some((i) => i.id === insightId)) return;
      const insight = state.insights.find((i) => i.id === insightId);
      if (!('suggestedRule' in insight)) return;
      createRuleFromInsight(state, insightId);
      renderRules(state, popupRoot);
      renderInsights(state, popupRoot);
      el.showToast('Rule created', { type: 'success', duration: 1500 });
    } else if (e.target.classList?.contains('tp-insight-dismiss')) {
      const insightId = e.target.dataset.insightId;
      if (!state.insights.some((i) => i.id === insightId)) return;
      dismissInsight(state, insightId);
      renderInsights(state, popupRoot);
      renderHome(state, popupRoot);
      el.showToast('Insight dismissed', { type: 'success', duration: 1500 });
    }
  });
}
