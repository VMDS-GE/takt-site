/**
 * docs/js/demo-controller.js — Feature #95 + #96 + #97
 * Wires BrowserStage tab-change, tab-group-toggle, and group-all events to state mutation + renderHome.
 */

import { renderHome } from './demo-renderer.js';

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
}
