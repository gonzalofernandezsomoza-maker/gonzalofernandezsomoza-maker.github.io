/* Contact form — Web3Forms */
(function () {
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('cf-submit-btn');
  const success = document.getElementById('cf-success');
  if (!form) return;

  // Captcha casero: suma simple generada al cargar la página
  const captchaLabel  = document.getElementById('cf-captcha-label');
  const captchaAnswer = document.getElementById('cf-captcha-answer');
  const honeypot       = document.getElementById('cf-honeypot');
  let num1, num2, expected;

  function newCaptcha() {
    num1 = Math.floor(Math.random() * 8) + 2;   // 2–9
    num2 = Math.floor(Math.random() * 8) + 2;   // 2–9
    expected = num1 + num2;
    if (captchaLabel) captchaLabel.textContent = `Verificación: ¿cuánto es ${num1} + ${num2}?`;
    if (captchaAnswer) captchaAnswer.value = '';
  }
  newCaptcha();

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Honeypot: si un bot completó este campo invisible, cortamos silenciosamente
    if (honeypot && honeypot.value.trim() !== '') {
      form.style.display = 'none';
      success.style.display = 'flex';
      return;
    }

    // Validar la cuenta matemática
    const given = parseInt((captchaAnswer && captchaAnswer.value || '').trim(), 10);
    if (given !== expected) {
      alert('La verificación no es correcta. Por favor volvé a intentar.');
      newCaptcha();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando…';

    const data = Object.fromEntries(new FormData(form));
    delete data.captcha_answer;
    delete data.website;
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
      newCaptcha();
      alert('Hubo un error al enviar. Por favor intentá de nuevo o escribinos por WhatsApp.');
    }
  });
})();
