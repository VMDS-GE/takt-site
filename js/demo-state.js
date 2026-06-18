/**
 * demo-state.js — Seed state for the interactive Takt homepage demo.
 *
 * Single named export: initialState.
 * Subsequent Phase 23 features mutate this object in place and re-render.
 * No side effects on import. No Chrome APIs. No src/ imports. No build step.
 *
 * Feature #93
 */
export const initialState = {
  rules: [
    { id: 'rule-1', name: 'Work', pattern: 'google.com', matchType: 'domain', color: 'blue', enabled: true },
    { id: 'rule-2', name: 'Research', pattern: 'arxiv.org', matchType: 'domain', color: 'purple', enabled: false },
  ],
  tabs: [
    { id: 'tab-1', title: 'Gmail', url: 'https://mail.google.com/', favIconUrl: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico', groupId: 'group-1', active: true },
    { id: 'tab-2', title: 'Google Docs', url: 'https://docs.google.com/', favIconUrl: 'https://www.gstatic.com/images/branding/product/2x/docs_2020q4_32dp.png', groupId: 'group-1', active: false },
    { id: 'tab-3', title: 'GitHub', url: 'https://github.com/', favIconUrl: 'https://github.githubassets.com/favicons/favicon.ico', groupId: 'group-1', active: false },
    { id: 'tab-4', title: 'arXiv.org', url: 'https://arxiv.org/', favIconUrl: 'https://arxiv.org/favicon.ico', groupId: 'group-2', active: false },
    { id: 'tab-5', title: 'Wikipedia', url: 'https://en.wikipedia.org/', favIconUrl: 'https://en.wikipedia.org/static/favicon/wikipedia.ico', groupId: 'group-2', active: false },
  ],
  tabGroups: [
    { id: 'group-1', title: 'Work', color: 'blue', collapsed: false },
    { id: 'group-2', title: 'Research', color: 'purple', collapsed: false },
  ],
  hibernated: [
    { id: 'hib-1', title: 'Stack Overflow', url: 'https://stackoverflow.com/', favIconUrl: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico' },
  ],
  sessions: [
    { id: 'ses-1', name: 'Morning standup', createdAt: '2026-06-18T09:00:00.000Z', tabCount: 4 },
  ],
  insights: [
    {
      id: 'ins-1',
      type: 'suggestion',
      title: 'Group YouTube tabs automatically',
      body: 'You have 3 YouTube tabs open. Create a rule to keep them organised.',
      suggestedRule: { id: 'rule-sr1', name: 'YouTube', pattern: 'youtube.com', matchType: 'domain', color: 'red', enabled: true },
    },
    {
      id: 'ins-2',
      type: 'info',
      title: 'Session saved',
      body: 'Your "Morning standup" session has been saved.',
    },
  ],
  settings: {
    theme: 'system',
    automation: 'auto',
    autoCollapse: true,
  },
};
