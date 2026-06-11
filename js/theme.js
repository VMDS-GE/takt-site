(function () {
  var KEY = 'takt-theme';
  var cycle = { light: 'dark', dark: 'system', system: 'light' };

  function getStored() {
    try { return localStorage.getItem(KEY) || 'system'; }
    catch (_) { return 'system'; }
  }

  function apply(theme) {
    if (theme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    updateIcon(theme);
  }

  function updateIcon(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var icons = { light: '☀', dark: '☾', system: '◑' };
    var labels = { light: 'Switch to dark mode', dark: 'Switch to system mode', system: 'Switch to light mode' };
    btn.textContent = icons[theme];
    btn.setAttribute('aria-label', labels[theme]);
  }

  apply(getStored());

  function bindToggle() {
    var current = getStored();
    updateIcon(current);

    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      current = cycle[current] || 'light';
      try { localStorage.setItem(KEY, current); } catch (_) {}
      apply(current);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindToggle();
    if (!document.getElementById('theme-toggle')) {
      new MutationObserver(function (_, obs) {
        if (document.getElementById('theme-toggle')) {
          bindToggle();
          obs.disconnect();
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  });
})();
