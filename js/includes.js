(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var base = getBasePath();
    injectHeader(base);
    injectFooter(base);
  });

  function getBasePath() {
    var link = document.querySelector('link[rel="stylesheet"][href*="tokens.css"]');
    if (!link) return './';
    var href = link.getAttribute('href');
    var match = href.match(/^((?:\.\.\/)*)/);
    return match ? match[1] || './' : './';
  }

  function injectHeader(b) {
    var el = document.getElementById('site-header');
    if (!el) return;
    el.className = 'site-header';
    el.innerHTML =
      '<div class="header-inner">' +
        '<a href="' + b + '" class="site-logo">' +
          '<svg viewBox="0 0 64 64" width="24" height="24" aria-hidden="true">' +
            '<rect x="8" y="8" width="48" height="48" rx="10" fill="none" stroke="currentColor" stroke-width="5"/>' +
            '<rect x="22" y="22" width="20" height="20" rx="4" fill="currentColor"/>' +
          '</svg>' +
          '<span>Takt</span>' +
        '</a>' +
        '<nav>' +
          '<ul class="nav-links">' +
            '<li><a href="' + b + 'getting-started/">Get Started</a></li>' +
            '<li><a href="' + b + 'docs/rules/">Docs</a></li>' +
            '<li><a href="' + b + 'privacy/">Privacy</a></li>' +
            '<li><button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">◑</button></li>' +
          '</ul>' +
        '</nav>' +
        '<button class="nav-toggle" aria-label="Menu" aria-expanded="false">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M3 6h18M3 12h18M3 18h18"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="mobile-nav" role="navigation">' +
        '<ul>' +
          '<li><a href="' + b + '">Home</a></li>' +
          '<li><a href="' + b + 'getting-started/">Get Started</a></li>' +
          '<li><a href="' + b + 'docs/rules/">Rule Reference</a></li>' +
          '<li><a href="' + b + 'docs/duplicates/">Duplicates</a></li>' +
          '<li><a href="' + b + 'docs/resources/">Resources</a></li>' +
          '<li><a href="' + b + 'docs/profiles/">Profiles</a></li>' +
          '<li><a href="' + b + 'docs/shortcuts/">Shortcuts</a></li>' +
          '<li><a href="' + b + 'docs/permissions/">Permissions</a></li>' +
          '<li><a href="' + b + 'privacy/">Privacy</a></li>' +
        '</ul>' +
      '</div>';
  }

  function injectFooter(b) {
    var el = document.getElementById('site-footer');
    if (!el) return;
    el.className = 'site-footer';
    el.innerHTML =
      '<div class="footer-inner">' +
        '<div class="footer-col">' +
          '<h4>Product</h4>' +
          '<ul>' +
            '<li><a href="' + b + '">Home</a></li>' +
            '<li><a href="' + b + 'getting-started/">Get Started</a></li>' +
            '<li><a href="' + b + 'privacy/">Privacy Policy</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Documentation</h4>' +
          '<ul>' +
            '<li><a href="' + b + 'docs/rules/">Rule Reference</a></li>' +
            '<li><a href="' + b + 'docs/duplicates/">Duplicate Prevention</a></li>' +
            '<li><a href="' + b + 'docs/resources/">Resource Dashboard</a></li>' +
            '<li><a href="' + b + 'docs/profiles/">Profiles & Schedules</a></li>' +
            '<li><a href="' + b + 'docs/shortcuts/">Keyboard Shortcuts</a></li>' +
            '<li><a href="' + b + 'docs/permissions/">Permissions</a></li>' +
          '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4>Links</h4>' +
          '<ul>' +
            '<li><a href="https://github.com/VMDS-GE/takt-site" rel="noopener">GitHub</a></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span>&copy; ' + new Date().getFullYear() + ' Takt. Built with Manifest V3.</span>' +
      '</div>';
  }
})();
