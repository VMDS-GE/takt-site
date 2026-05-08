(function () {
  var KEY = 'takt-theme';
  var cycle = { light: 'dark', dark: 'system', system: 'light' };
  var icons = { light: '☀', dark: '☾', system: '◑' };
  var labels = {
    light: 'Switch to dark mode',
    dark: 'Switch to system mode',
    system: 'Switch to light mode',
  };

  function getStored() {
    try {
      return localStorage.getItem(KEY) || 'system';
    } catch (_) {
      return 'system';
    }
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
    btn.textContent = icons[theme];
    btn.setAttribute('aria-label', labels[theme]);
  }

  apply(getStored());

  document.addEventListener('DOMContentLoaded', function () {
    var current = getStored();
    updateIcon(current);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        current = cycle[current] || 'light';
        try {
          localStorage.setItem(KEY, current);
        } catch (_) {}
        apply(current);
      });
    }
  });
})();
