(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.nav-hamburger');
    var mobileNav = document.querySelector('.mobile-nav');
    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    highlightActive();
  });

  function highlightActive() {
    var path = window.location.pathname;
    var links = document.querySelectorAll('.nav-center a, .mobile-nav a, .docs-sidebar a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var resolved = new URL(href, window.location.href).pathname;
      if (resolved === path || (path.endsWith('/') && resolved === path.slice(0, -1))) {
        link.classList.add('active');
      }
    });
  }
})();
