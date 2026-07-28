/* Contact form — Web3Forms */
(function () {
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('cf-submit-btn');
  const success = document.getElementById('cf-success');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      if (json.success) {
        form.style.display = 'none';
        success.style.display = 'flex';
      } else {
        throw new Error(json.message || 'Error');
      }
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje →';
      alert('Hubo un error al enviar. Por favor intentá de nuevo o escribinos por WhatsApp.');
    }
  });
})();
