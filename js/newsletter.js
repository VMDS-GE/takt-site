(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('newsletter-form');
    if (!form) {
      return;
    }
    var statusEl = document.getElementById('newsletter-status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var button = form.querySelector('button[type="submit"]');
      var emailInput = document.getElementById('newsletter-email');
      var email = emailInput ? emailInput.value : '';

      button.disabled = true;

      fetch('https://submit-form.com/Y1bAyKeyp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      })
        .then(function (response) {
          if (response.ok) {
            statusEl && (statusEl.dataset.state = 'success');
            statusEl && (statusEl.textContent = "Thanks! You're subscribed.");
            statusEl && (statusEl.hidden = false);
          } else {
            statusEl && (statusEl.dataset.state = 'error');
            statusEl && (statusEl.textContent = 'Something went wrong — please try again.');
            statusEl && (statusEl.hidden = false);
            button.disabled = false;
          }
        })
        .catch(function () {
          statusEl && (statusEl.dataset.state = 'error');
          statusEl && (statusEl.textContent = 'Something went wrong — please try again.');
          statusEl && (statusEl.hidden = false);
          button.disabled = false;
        });
    });
  });
})();
