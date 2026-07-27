/* Booking calendar — Mon–Fri, 09:00–18:00 */
(function () {
  const BOOKING_EMAIL = 'fernandez.gonzalo@jmmgfsconsultores.com';
  const HOURS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
  const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const DAYS_ES = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

  let viewYear, viewMonth, selectedDate = null, selectedHour = null;

  const elLabel   = document.getElementById('cal-month-label');
  const elDays    = document.getElementById('cal-days');
  const elSlots   = document.getElementById('slots-grid');
  const elTitle   = document.getElementById('slots-title');
  const elConfirm = document.getElementById('slots-confirm');
  const elSelVal  = document.getElementById('slots-selected-val');
  const elBookBtn = document.getElementById('slot-book-btn');

  if (!elLabel) return;

  const now = new Date();
  viewYear  = now.getFullYear();
  viewMonth = now.getMonth();

  function renderCalendar() {
    elLabel.textContent = MONTHS_ES[viewMonth] + ' ' + viewYear;
    elDays.innerHTML = '';

    const first = new Date(viewYear, viewMonth, 1);
    const last  = new Date(viewYear, viewMonth + 1, 0);
    // Monday-first offset
    let startDow = first.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1;

    for (let i = 0; i < startDow; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-day';
      elDays.appendChild(blank);
    }

    for (let d = 1; d <= last.getDate(); d++) {
      const cell = document.createElement('div');
      const date = new Date(viewYear, viewMonth, d);
      const dow  = date.getDay(); // 0=Sun,6=Sat
      const isWeekend = dow === 0 || dow === 6;
      const isPast    = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const isToday   = date.toDateString() === now.toDateString();
      const isSel     = selectedDate && date.toDateString() === selectedDate.toDateString();

      cell.className = 'cal-day' +
        (!isWeekend && !isPast ? ' workday' : '') +
        (isPast ? ' past' : '') +
        (isToday ? ' today' : '') +
        (isSel ? ' selected' : '');
      cell.textContent = d;

      if (!isWeekend && !isPast) {
        cell.addEventListener('click', () => selectDate(date));
      }
      elDays.appendChild(cell);
    }
  }

  function selectDate(date) {
    selectedDate = date;
    selectedHour = null;
    elConfirm.style.display = 'none';
    renderCalendar();
    renderSlots(date);
  }

  function renderSlots(date) {
    const dayName = DAYS_ES[date.getDay()];
    const label   = dayName.charAt(0).toUpperCase() + dayName.slice(1) + ' ' +
                    date.getDate() + ' de ' + MONTHS_ES[date.getMonth()];
    elTitle.textContent = label;
    elSlots.innerHTML = '';

    HOURS.forEach(h => {
      const btn = document.createElement('button');
      btn.className = 'slot-btn';
      btn.textContent = h;
      btn.addEventListener('click', () => selectSlot(h, label));
      elSlots.appendChild(btn);
    });
  }

  function selectSlot(hour, dateLabel) {
    selectedHour = hour;
    elSlots.querySelectorAll('.slot-btn').forEach(b => {
      b.classList.toggle('selected', b.textContent === hour);
    });
    const fullLabel = dateLabel + ' a las ' + hour + ' hs';
    elSelVal.textContent = fullLabel;
    elConfirm.style.display = 'block';

    const subject = encodeURIComponent('Solicitud de asesoría — ' + fullLabel);
    const body    = encodeURIComponent(
      'Hola,\n\nSolicitaría una asesoría el ' + fullLabel + '.\n\n' +
      'Por favor confirmarme disponibilidad.\n\nSaludos.'
    );
    elBookBtn.href = 'mailto:' + BOOKING_EMAIL + '?subject=' + subject + '&body=' + body;
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  renderCalendar();
})();
