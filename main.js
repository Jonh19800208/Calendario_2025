const festivos2025 = ['2025-01-01', '2025-01-06', '2025-03-19', '2025-04-18', '2025-04-21', '2025-05-01', '2025-08-15', '2025-10-09', '2025-10-12', '2025-11-01', '2025-12-06', '2025-12-08', '2025-12-25'];
const diasEspeciales = ['2025-03-18', '2025-12-24', '2025-12-31'];
const diasNuevoEspeciales = ['2025-08-14', '2025-09-08'];
const diasOctubre17 = ['2025-10-17'];

let currentDate = new Date();

const diasSemana = ['Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.', 'Dom.'];

const FESTIVO_RATE = 297.838758;
const NIGHT_RATE = 31.1554948;
const WEEKEND_RATE = 102.0080736;
const PLUS_DF_RATE = 102.007695;
const HE_RATE = 19.6296544;

const monthlyWorkDays = {
  0: { days: 21, hours: 168 },
  1: { days: 20, hours: 160 },
  2: { days: 19, hours: 152 },
  3: { days: 20, hours: 160 },
  4: { days: 21, hours: 168 },
  5: { days: 21, hours: 168 },
  6: { days: 23, hours: 184 },
  7: { days: 19, hours: 152 },
  8: { days: 21, hours: 168 },
  9: { days: 21, hours: 168 },
  10: { days: 20, hours: 160 },
  11: { days: 19, hours: 152 }
};

function getTurnoColor(turno) {
  const colors = {
    '': 'white',
    'M': 'var(--turno-m)',
    'T': 'var(--turno-t)',
    'N': 'var(--turno-n)',
    'A': 'var(--turno-a)',
    'V': 'var(--turno-v)',
    'F': 'var(--festivo)',
    'FL': 'var(--turno-fl)',
    'B': 'var(--turno-b)',
    'PNR': 'var(--turno-pnr)',
    'LPF': 'var(--turno-lpf)',
    'VAA': 'var(--turno-vaa)',
    'PD': '#FFD700',
    'HE': 'var(--turno-he)',
    'JP': 'var(--turno-jp)'
  };
  return colors[turno] || 'white';
}

function updateSummary() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const counts = {
    'M': 0, 'T': 0, 'N': 0, 'A': 0, 'V': 0, 'FL': 0, 'B': 0, 'PNR': 0, 'LPF': 0, 'VAA': 0, 'DF': 0, 'PD': 0, 'F': 0, 'JP': 0
  };
  let weekendDays = 0;

  for (let day = 1; day <= 31; day++) {
    const date = new Date(year, month, day);
    if (date.getMonth() === month) {
      const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const turno = localStorage.getItem(fecha);

      const isWeekend = [0, 6].includes(date.getDay());
      if (isWeekend && turno && turno !== '' && turno !== 'V' && turno !== 'B' && turno !== 'LPF' && turno !== 'F' && turno !== 'FL') {
        weekendDays++;
      }

      if (turno && counts.hasOwnProperty(turno)) {
        if (turno === 'F') {
          if (!isWeekend) counts['F']++;
        } else {
          counts[turno]++;
        }
      }
    }
  }

  document.getElementById('count-m').textContent = `Mañanas: ${counts['M']}`;
  document.getElementById('count-t').textContent = `Tardes: ${counts['T']}`;
  const nochesCount = counts['N'];
  const nochesEuros = (nochesCount * NIGHT_RATE).toFixed(2);
  document.getElementById('count-n').textContent = `Noches: ${nochesCount} — ${nochesEuros} €`;
  document.getElementById('count-a').textContent = `Adelantos: ${counts['A']}`;
  document.getElementById('count-v').textContent = `Vacaciones: ${counts['V']}`;
  document.getElementById('count-fl').textContent = `Flexibilidad: ${counts['FL']}`;
  document.getElementById('count-b').textContent = `Días de baja: ${counts['B']}`;
  document.getElementById('count-vaa').textContent = `Vacaciones año anterior: ${counts['VAA']}`;

  const festivosCount = counts['F'];
  const festivosEuros = (festivosCount * FESTIVO_RATE).toFixed(2);
  document.getElementById('count-f').textContent = `Festivo trab.: ${festivosCount} — ${festivosEuros} €`;

  const pdCount = counts['PD'];
  const pdEuros = (pdCount * PLUS_DF_RATE).toFixed(2);
  document.getElementById('count-pd').textContent = `Plus D-Festivo: ${pdCount} — ${pdEuros} €`;

  const weekendEuros = (weekendDays * WEEKEND_RATE).toFixed(2);
  document.getElementById('weekend-days').textContent = `Días trabajados en fin de semana: ${weekendDays} — ${weekendEuros} €`;

  const total = Object.entries(counts).reduce((sum, [key, count]) => {
    return (key !== 'B' && key !== 'LPF' && key !== 'DF') ? sum + count : sum;
  }, 0);
  document.getElementById('count-total').textContent = `Total: ${total}`;

  let totalVacationDaysUsed = 0;
  for (let m = 0; m <= month; m++) {
    for (let day = 1; day <= 31; day++) {
      const fecha = `${currentDate.getFullYear()}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const turno = localStorage.getItem(fecha);
      if (turno === 'V') totalVacationDaysUsed++;
    }
  }
  const remainingVacationDays = 22 - totalVacationDaysUsed;
  document.getElementById('vacation-days').textContent = `Días de vacaciones restantes: ${remainingVacationDays}`;

  // Horas Extras (monthly) from storage
  const heMonthly = getStoredHE(year, month);
  const heEl = document.getElementById('count-he');
  if (heEl) heEl.textContent = `Horas Extras: ${heMonthly.toFixed(1)} h — ${(heMonthly * HE_RATE).toFixed(2)} €`;

  const annualSummary = document.getElementById('annual-summary');
  annualSummary.classList.toggle('visible', currentDate.getMonth() === 11);
  if (currentDate.getMonth() === 11) calculateAnnualSummary();
}

function calculateAnnualSummary() {
  const counts = { 'M': 0, 'T': 0, 'N': 0, 'A': 0, 'V': 0, 'FL': 0, 'B': 0, 'PNR': 0, 'LPF': 0, 'PD': 0, 'F': 0, 'JP': 0 };
  let totalWeekendDays = 0;
  let annualHE = 0;
  
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2025, month, day);
      if (date.getMonth() === month) {
        const fecha = `2025-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const turno = localStorage.getItem(fecha);
        const isWeekend = [0, 6].includes(date.getDay());
        if (isWeekend && turno && turno !== '' && turno !== 'V' && turno !== 'B' && turno !== 'LPF' && turno !== 'FL') totalWeekendDays++;
        if (turno && counts.hasOwnProperty(turno)) counts[turno]++;
      }
    }
    // accumulate Horas Extras for this month into annual total
    annualHE += getStoredHE(2025, month);
  }

  document.getElementById('annual-m').textContent = `Mañanas: ${counts['M']}`;
  document.getElementById('annual-t').textContent = `Tardes: ${counts['T']}`;
  const annualNochesCount = counts['N'];
  const annualNochesEuros = (annualNochesCount * NIGHT_RATE).toFixed(2);
  document.getElementById('annual-n').textContent = `Noches: ${annualNochesCount} — ${annualNochesEuros} €`;
  document.getElementById('annual-a').textContent = `Adelantos: ${counts['A']}`;
  document.getElementById('annual-v').textContent = `Vacaciones: ${counts['V']}`;

  document.getElementById('annual-fl').textContent = `Flexibilidad: ${counts['FL']}`;
  document.getElementById('annual-b').textContent = `Total días de baja: ${counts['B']}`;

  const annualFestivosCount = counts['F'];
  const annualFestivosEuros = (annualFestivosCount * FESTIVO_RATE).toFixed(2);
  document.getElementById('annual-f').textContent = `Total festivos trab.: ${annualFestivosCount} — ${annualFestivosEuros} €`;

  let annualPdEl = document.getElementById('annual-pd');
  const annualPdCount = counts['PD'] || 0;
  const annualPdEuros = (annualPdCount * PLUS_DF_RATE).toFixed(2);
  if (!annualPdEl) {
    annualPdEl = document.createElement('div');
    annualPdEl.id = 'annual-pd';
    annualPdEl.className = 'summary-item turno-pd';
    document.querySelector('#annual-summary .summary-grid').appendChild(annualPdEl);
  }
  annualPdEl.textContent = `Total Plus D-Festivo: ${annualPdCount} — ${annualPdEuros} €`;

  const annualWeekendEuros = (totalWeekendDays * WEEKEND_RATE).toFixed(2);
  document.getElementById('annual-weekend-days').textContent = `Total días trabajados en fin de semana: ${totalWeekendDays} — ${annualWeekendEuros} €`;

  const total = Object.entries(counts).reduce((sum, [key, count]) => {
    return (key !== 'B' && key !== 'LPF') ? sum + count : sum;
  }, 0);
  document.getElementById('annual-total').textContent = `Total días trabajados: ${total}`;
  document.getElementById('annual-vacation-days').textContent = `Total días vacaciones usados: ${counts['V']}`;
  document.getElementById('annual-he').textContent = `Horas Extras: ${annualHE.toFixed(1)} h — ${(annualHE * HE_RATE).toFixed(2)} €`;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentDate);
  document.getElementById('currentMonth').textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = '';
  diasSemana.forEach(dia => {
    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = dia;
    calendar.appendChild(header);
  });

  const mondayBasedDay = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < mondayBasedDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'day empty';
    calendar.appendChild(emptyDay);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dayEl = document.createElement('div');
    dayEl.className = 'day';
    const mondayBasedDayOfWeek = (date.getDay() + 6) % 7;
    if (mondayBasedDayOfWeek === 5 || mondayBasedDayOfWeek === 6) dayEl.classList.add('weekend'); else dayEl.classList.add('weekday');

    const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (festivos2025.includes(fecha)) dayEl.classList.add('festivo');
    if (diasEspeciales.includes(fecha)) {
      dayEl.classList.add('especial');
      const festivoText = document.createElement('div');
      festivoText.style.fontSize = '0.6rem';
      festivoText.style.fontWeight = 'bold';
      festivoText.textContent = 'Festivo Convenio';
      dayEl.appendChild(festivoText);
    }
    if (diasNuevoEspeciales.includes(fecha)) dayEl.classList.add('nuevo-especial');
    if (diasOctubre17.includes(fecha)) dayEl.classList.add('october-17');

    const savedTurno = localStorage.getItem(fecha) || '';
    if (diasOctubre17.includes(fecha) && month === 9) {
      const patronaText = document.createElement('div');
      patronaText.style.fontSize = '0.6rem';
      patronaText.style.fontWeight = 'bold';
      patronaText.textContent = 'Patrona';
      dayEl.appendChild(patronaText);
    }

    dayEl.innerHTML = `
      <div class="day-header">${day}</div>
      <div class="day-content ${savedTurno ? 'turno-' + savedTurno.toLowerCase() : ''}">
        <select class="turno-select" data-fecha="${fecha}">
          <option value="" ${savedTurno === '' ? 'selected' : ''}>Descanso</option>
          <option value="M" ${savedTurno === 'M' ? 'selected' : ''}>Mañana</option>
          <option value="T" ${savedTurno === 'T' ? 'selected' : ''}>Tarde</option>
          <option value="N" ${savedTurno === 'N' ? 'selected' : ''}>Noche</option>
          <option value="A" ${savedTurno === 'A' ? 'selected' : ''}>Adelanto</option>
          <option value="V" ${savedTurno === 'V' ? 'selected' : ''}>Vacaciones</option>
          <option value="VAA" ${savedTurno === 'VAA' ? 'selected' : ''}>Vacaciones año anterior</option>
          <option value="F" ${savedTurno === 'F' ? 'selected' : ''}>Festivo trabajado</option>
          <option value="FL" ${savedTurno === 'FL' ? 'selected' : ''}>Flexibilidad</option>
          <option value="B" ${savedTurno === 'B' ? 'selected' : ''}>Baja</option>
          <option value="PNR" ${savedTurno === 'PNR' ? 'selected' : ''}>Permiso no retribuido</option>
          <option value="LPF" ${savedTurno === 'LPF' ? 'selected' : ''}>Libres por festivo</option>
          <option value="DF" ${savedTurno === 'DF' ? 'selected' : ''}>Descanso flexibilidad</option>
          <option value="HE" ${savedTurno === 'HE' ? 'selected' : ''}>Horas Extras</option>
          <option value="PD" ${savedTurno === 'PD' ? 'selected' : ''}>Plus D-Festivo</option>
          <option value="JP" ${savedTurno === 'JP' ? 'selected' : ''}>Jornada Partida</option>
        </select>
      </div>
    `;
    calendar.appendChild(dayEl);
  }

  // create an extra "nuevo día" box after the last day with same structure and behavior
  const nextDateObj = new Date(year, month, lastDay.getDate() + 1);
  const nextFecha = `${nextDateObj.getFullYear()}-${String(nextDateObj.getMonth() + 1).padStart(2,'0')}-${String(nextDateObj.getDate()).padStart(2,'0')}`;
  const extraDayEl = document.createElement('div');
  extraDayEl.className = 'day nuevo-dia';
  extraDayEl.innerHTML = `
    <div class="day-header">H.Extras</div>
    <div class="day-content">
      <div class="h-extras-controls" data-month="${month}">
        <button class="h-extras-btn" data-action="dec">-</button>
        <div class="h-extras-value" id="h-extras-value">${getStoredHE(year, month).toFixed(1)}</div>
        <button class="h-extras-btn" data-action="inc">+</button>
      </div>
    </div>
  `;
  extraDayEl.style.gridColumn = '7';
  // visual styling handled by CSS (.day.nuevo-dia)
  extraDayEl.style.border = '1px solid black';
  extraDayEl.classList.remove('weekend', 'weekday');
  calendar.appendChild(extraDayEl);
  // initialize its content as empty/white (no select)
  extraDayEl.querySelector('.day-content').style.backgroundColor = 'white';

  // attach handlers for H.Extras controls
  const heControls = extraDayEl.querySelector('.h-extras-controls');
  if (heControls) {
    heControls.addEventListener('click', (ev) => {
      const btn = ev.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const m = Number(heControls.dataset.month);
      const current = getStoredHE(year, m);
      const step = 0.5;
      let next = current;
      if (action === 'inc') next = +(current + step).toFixed(1);
      if (action === 'dec') next = +(Math.max(0, current - step)).toFixed(1);
      storeHE(year, m, next);
      document.getElementById('h-extras-value').textContent = next.toFixed(1);
      updateSummary();
    });
  }

  const workInfo = monthlyWorkDays[currentDate.getMonth()];
  const workDaysInfo = document.getElementById('workDaysInfo');
  workDaysInfo.textContent = workInfo ? `Días laborables: ${workInfo.days} días ${workInfo.hours} Horas` : '';

  // attach event listeners after rendering
  document.querySelectorAll('.turno-select').forEach(sel => {
    sel.style.backgroundColor = getTurnoColor(localStorage.getItem(sel.dataset.fecha) || '');
    sel.addEventListener('change', (e) => {
      asignarTurno(e.target, sel.dataset.fecha);
    });
  });

  updateSummary();
}

// Helper functions for storing/reading monthly Horas Extras (keyed by YEAR-MONTH)
function heKey(year, month) {
  return `HE-${year}-${String(month + 1).padStart(2,'0')}`;
}
function getStoredHE(year, month) {
  const v = localStorage.getItem(heKey(year, month));
  return v ? parseFloat(v) : 0.0;
}
function storeHE(year, month, value) {
  localStorage.setItem(heKey(year, month), String(value));
}

function asignarTurno(select, fecha) {
  const turno = select.value;
  const dayContent = select.parentElement;
  dayContent.className = 'day-content';
  if (turno) dayContent.classList.add(`turno-${turno.toLowerCase()}`);
  select.style.backgroundColor = getTurnoColor(turno);
  localStorage.setItem(fecha, turno);
  updateSummary();
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

// Wire up navigation buttons (existing IDs from index.html)
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('prevMonthBtn').addEventListener('click', prevMonth);
  document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);
  renderCalendar();
});