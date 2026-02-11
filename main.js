const festivos2025 = ['2025-01-01', '2025-01-06', '2025-03-19', '2025-04-18', '2025-04-21', '2025-05-01', '2025-08-15', '2025-10-09', '2025-10-12', '2025-11-01', '2025-12-06', '2025-12-08', '2025-12-24', '2025-12-25', '2025-12-31'];
// Festivos for 2026 (user requested: 1 Jan and 6 Jan are holidays)
const festivos2026 = ['2026-01-01', '2026-01-06', '2026-03-19', '2026-03-18', '2026-04-03', '2026-04-06', '2026-05-01', '2026-06-24', '2026-08-14', '2026-08-15', '2026-09-07', '2026-10-09', '2026-10-12', '2026-12-08', '2026-12-24', '2026-12-25', '2026-12-31'];
const diasEspeciales = ['2025-03-18', '2025-12-24', '2025-12-31', '2026-03-18', '2026-12-24', '2026-12-31'];
const diasNuevoEspeciales = ['2025-08-14', '2025-09-08', '2026-08-14', '2026-09-07'];
const diasPatrona = ['2025-10-17', '2026-11-13'];

let currentDate = new Date();

const diasSemana = ['Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.', 'Dom.'];

const FESTIVO_RATE_2025 = 297.838758;
const FESTIVO_RATE_2026 = 302.306339; // per user's request for 2026
function getFestivoRate(year) {
  return year === 2026 ? FESTIVO_RATE_2026 : FESTIVO_RATE_2025;
}
const NIGHT_RATE_2025 = 31.1554948;
const NIGHT_RATE_2026 = 32.09015968;
const WEEKEND_RATE_2025 = 102.0080736;
const WEEKEND_RATE_2026 = 103.5421952;
function getNightRate(year) {
  if (year === 2026) return NIGHT_RATE_2026;
  return NIGHT_RATE_2025;
}
function getWeekendRate(year) {
  return year === 2026 ? WEEKEND_RATE_2026 : WEEKEND_RATE_2025;
}
const PLUS_DF_RATE_2025 = 102.007695;
const PLUS_DF_RATE_2026 = 103.53781; // per user's request for 2026
function getPlusDfRate(year) {
  return year === 2026 ? PLUS_DF_RATE_2026 : PLUS_DF_RATE_2025;
}
const HE_RATE_2025 = 19.6296544;
const HE_RATE_2026 = 19.9240992;
function getHeRate(year) {
  return year === 2026 ? HE_RATE_2026 : HE_RATE_2025;
}
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

/**
 * Return monthly work days data, allowing year-specific overrides.
 * Currently: January (month 0), February (month 1) and March (month 2) of 2026 are 20 days / 160 hours.
 */
function getMonthlyWorkDays(year, month) {
  // Year-specific overrides for 2026:
  // enero 2026 => 20 días, 160 horas
  if (year === 2026 && month === 0) return { days: 20, hours: 160 };
  // febrero 2026 => 20 días, 160 horas
  if (year === 2026 && month === 1) return { days: 20, hours: 160 };
  // marzo 2026 => 20 días, 160 horas (user requested)
  if (year === 2026 && month === 2) return { days: 20, hours: 160 };
  // mayo 2026 => 20 días, 160 horas (added)
  if (year === 2026 && month === 4) return { days: 20, hours: 160 };
  // agosto 2026 => 20 días, 160 horas (user requested)
  if (year === 2026 && month === 7) return { days: 20, hours: 160 };
  // octubre 2026 => 20 días, 160 horas (user requested)
  if (year === 2026 && month === 9) return { days: 20, hours: 160 };
  return monthlyWorkDays[month] || null;
}

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
    'M': 0, 'T': 0, 'N': 0, 'A': 0, 'V': 0, 'FL': 0, 'B': 0, 'PNR': 0, 'LPF': 0, 'VAA': 0, 'DF': 0, 'PD': 0, 'PSD': 0, 'F': 0, 'JP': 0
  };
  let weekendDays = 0;
  let weekendFestivos = 0;
  let weekendVacaciones = 0;
  
  for (let day = 1; day <= 31; day++) {
    const date = new Date(year, month, day);
    if (date.getMonth() === month) {
      const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const turno = localStorage.getItem(fecha);
 
      // If this date is a patrona day, do not count it as a worked day
      if (diasPatrona.includes(fecha)) {
        continue;
      }
      const isWeekend = [0, 6].includes(date.getDay());
      // Contar como día trabajado en fin de semana también si es festivo trabajado (F)
      if (isWeekend && turno && !['','V','B','LPF','FL'].includes(turno)) {
        weekendDays++;
      }
      // Count vacation days on weekends so they can be excluded from Total
      if (isWeekend && turno === 'V') weekendVacaciones++;
      // track festivos worked that fall on weekend so they can be excluded from Total
      if (isWeekend && turno === 'F') weekendFestivos++;
 
      if (turno && counts.hasOwnProperty(turno)) {
        // Contamos festivos trabajados (F) independientemente de si caen en fin de semana
        counts[turno]++;
      }
    }
  }
 
  document.getElementById('count-m').textContent = `Mañanas: ${counts['M']}`;
  document.getElementById('count-t').textContent = `Tardes: ${counts['T']}`;
  const nochesCount = counts['N'];
  const nochesEuros = (nochesCount * getNightRate(year)).toFixed(2);
  document.getElementById('count-n').textContent = `Noches: ${nochesCount} — ${nochesEuros} €`;
  document.getElementById('count-a').textContent = `Adelanto turno: ${counts['A']}`;
  document.getElementById('count-v').textContent = `Vacaciones: ${counts['V']}`;
  document.getElementById('count-fl').textContent = `Flexibilidad: ${counts['FL']}`;
  document.getElementById('count-b').textContent = `Días de baja: ${counts['B']}`;
  document.getElementById('count-vaa').textContent = `Vacaciones año anterior: ${counts['VAA']}`;

  const festivosCount = counts['F'];
  const festivosEuros = (festivosCount * getFestivoRate(year)).toFixed(2);
  document.getElementById('count-f').textContent = `Festivo trab.: ${festivosCount} — ${festivosEuros} €`;

  const pdCount = counts['PD'];
  const pdEuros = (pdCount * getPlusDfRate(year)).toFixed(2);
  document.getElementById('count-pd').textContent = `Plus D-Festivo: ${pdCount} — ${pdEuros} €`;

  const weekendEuros = (weekendDays * getWeekendRate(year)).toFixed(2);
  document.getElementById('weekend-days').textContent = `Días trabajados en fin de semana: ${weekendDays} — ${weekendEuros} €`;

  let total = Object.entries(counts).reduce((sum, [key, count]) => {
    // Excluir B, LPF, DF y PD del conteo total de días trabajados (PSD cuenta como día trabajado)
    return (key !== 'B' && key !== 'LPF' && key !== 'DF' && key !== 'PD') ? sum + count : sum;
  }, 0);
  // Exclude festivos trabajados that fall on weekend from the Total per user's request
  // Also exclude vacation days that fall on weekends from the Total
  total = Math.max(0, total - weekendFestivos - weekendVacaciones);
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
  if (heEl) heEl.textContent = `Horas Extras: ${heMonthly.toFixed(1)} h — ${(heMonthly * getHeRate(year)).toFixed(2)} €`;

  const annualSummary = document.getElementById('annual-summary');
  annualSummary.classList.toggle('visible', currentDate.getMonth() === 11);
  if (currentDate.getMonth() === 11) calculateAnnualSummary();
}

function calculateAnnualSummary() {
  const year = currentDate.getFullYear();
  // update annual title to match selected year
  const titleEl = document.getElementById('annualTitle');
  if (titleEl) titleEl.textContent = `Resumen Anual ${year}`;

  const counts = { 'M': 0, 'T': 0, 'N': 0, 'A': 0, 'V': 0, 'FL': 0, 'B': 0, 'PNR': 0, 'LPF': 0, 'PD': 0, 'PSD': 0, 'F': 0, 'JP': 0 };
  let totalWeekendDays = 0;
  let annualHE = 0;
  let weekendFestivosAnnual = 0;
  let weekendVacacionesAnnual = 0;
  
  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const date = new Date(year, month, day);
      if (date.getMonth() === month) {
        const fecha = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const turno = localStorage.getItem(fecha);
        // If this date is a patrona day, do not count it as a worked day
        if (diasPatrona.includes(fecha)) {
          continue;
        }
        const isWeekend = [0, 6].includes(date.getDay());
        // Include worked days on weekend in weekend counter
        if (isWeekend && turno && !['','V','B','LPF','FL'].includes(turno)) totalWeekendDays++;
        if (isWeekend && turno === 'F') weekendFestivosAnnual++;
        if (isWeekend && turno === 'V') weekendVacacionesAnnual++;
        if (turno && counts.hasOwnProperty(turno)) counts[turno]++;
      }
    }
    // accumulate Horas Extras for this month into annual total (use the same year)
    annualHE += getStoredHE(year, month);
  }

  document.getElementById('annual-m').textContent = `Mañanas: ${counts['M']}`;
  document.getElementById('annual-t').textContent = `Tardes: ${counts['T']}`;
  const annualNochesCount = counts['N'];
  const annualNochesEuros = (annualNochesCount * getNightRate(year)).toFixed(2);
  document.getElementById('annual-n').textContent = `Noches: ${annualNochesCount} — ${annualNochesEuros} €`;
  document.getElementById('annual-a').textContent = `Adelanto turno: ${counts['A']}`;
  document.getElementById('annual-v').textContent = `Vacaciones: ${counts['V']}`;

  document.getElementById('annual-fl').textContent = `Flexibilidad: ${counts['FL']}`;
  document.getElementById('annual-b').textContent = `Total días de baja: ${counts['B']}`;

  const annualFestivosCount = counts['F'];
  const annualFestivosEuros = (annualFestivosCount * getFestivoRate(year)).toFixed(2);
  document.getElementById('annual-f').textContent = `Total festivos trab.: ${annualFestivosCount} — ${annualFestivosEuros} €`;

  let annualPdEl = document.getElementById('annual-pd');
  const annualPdCount = counts['PD'] || 0;
  const annualPdEuros = (annualPdCount * getPlusDfRate(year)).toFixed(2);
  if (!annualPdEl) {
    annualPdEl = document.createElement('div');
    annualPdEl.id = 'annual-pd';
    annualPdEl.className = 'summary-item turno-pd';
    document.querySelector('#annual-summary .summary-grid').appendChild(annualPdEl);
  }
  annualPdEl.textContent = `Total Plus D-Festivo: ${annualPdCount} — ${annualPdEuros} €`;

  const annualWeekendEuros = (totalWeekendDays * getWeekendRate(year)).toFixed(2);
  document.getElementById('annual-weekend-days').textContent = `Total días trabajados en fin de semana: ${totalWeekendDays} — ${annualWeekendEuros} €`;

  let total = Object.entries(counts).reduce((sum, [key, count]) => {
    // Excluir B, LPF y PD del total anual de días trabajados (PSD cuenta como día trabajado)
    return (key !== 'B' && key !== 'LPF' && key !== 'PD') ? sum + count : sum;
  }, 0);
  // Exclude annual festivos trabajados that fall on weekends from Annual Total
  // Also exclude vacation days that fall on weekends from the Annual Total
  total = Math.max(0, total - weekendFestivosAnnual - weekendVacacionesAnnual);
  document.getElementById('annual-total').textContent = `Total días trabajados: ${total}`;
  document.getElementById('annual-vacation-days').textContent = `Total días vacaciones usados: ${counts['V']}`;
  document.getElementById('annual-he').textContent = `Horas Extras: ${annualHE.toFixed(1)} h — ${(annualHE * getHeRate(year)).toFixed(2)} €`;
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
    // mark festivos depending on the year
    if ((year === 2025 && festivos2025.includes(fecha)) || (year === 2026 && festivos2026.includes(fecha))) dayEl.classList.add('festivo');
    // Special-case: 18 March 2026 should be ochre
    if (fecha === '2026-03-18') {
      dayEl.classList.add('mar18-2026');
      const festivoText = document.createElement('div');
      festivoText.style.fontSize = '0.6rem';
      festivoText.style.fontWeight = 'bold';
      festivoText.textContent = 'Festivo Convenio';
      dayEl.appendChild(festivoText);
    } else if (fecha === '2026-12-24' || fecha === '2026-12-31') {
      // 24 and 31 December 2026 should be khaki (F0E68C)
      const cls = fecha === '2026-12-24' ? 'dec24-2026' : 'dec31-2026';
      dayEl.classList.add(cls);
      const festivoText = document.createElement('div');
      festivoText.style.fontSize = '0.6rem';
      festivoText.style.fontWeight = 'bold';
      festivoText.textContent = 'Especial';
      dayEl.appendChild(festivoText);
    } else if (diasEspeciales.includes(fecha)) {
      dayEl.classList.add('especial');
      const festivoText = document.createElement('div');
      festivoText.style.fontSize = '0.6rem';
      festivoText.style.fontWeight = 'bold';
      festivoText.textContent = 'Festivo Convenio';
      dayEl.appendChild(festivoText);
    }
    if (diasNuevoEspeciales.includes(fecha)) dayEl.classList.add('nuevo-especial');
    if (diasPatrona.includes(fecha)) dayEl.classList.add('patrona');

    const savedTurno = localStorage.getItem(fecha) || '';
    if (diasPatrona.includes(fecha)) {
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
          <option value="A" ${savedTurno === 'A' ? 'selected' : ''}>Adelanto turno</option>
          <option value="V" ${savedTurno === 'V' ? 'selected' : ''}>Vacaciones</option>
          <option value="VAA" ${savedTurno === 'VAA' ? 'selected' : ''}>Vacaciones año anterior</option>
          <option value="F" ${savedTurno === 'F' ? 'selected' : ''}>Plus festivo adicional</option>
          <option value="FL" ${savedTurno === 'FL' ? 'selected' : ''}>Flexibilidad</option>
          <option value="B" ${savedTurno === 'B' ? 'selected' : ''}>Baja</option>
          <option value="PNR" ${savedTurno === 'PNR' ? 'selected' : ''}>Permiso retribuido</option>
          <option value="LPF" ${savedTurno === 'LPF' ? 'selected' : ''}>Descanso por festivo</option>
          <option value="DF" ${savedTurno === 'DF' ? 'selected' : ''}>Descanso flexibilidad</option>
          <option value="HE" ${savedTurno === 'HE' ? 'selected' : ''}>Horas Extras</option>
          <option value="PD" ${savedTurno === 'PD' ? 'selected' : ''}>Plus D-Festivo</option>
          <option value="PSD" ${savedTurno === 'PSD' ? 'selected' : ''}>Plus sab. y dom en reparación</option>
          <option value="JP" ${savedTurno === 'JP' ? 'selected' : ''}>Jornada Partida</option>
        </select>
      </div>
    `;
    calendar.appendChild(dayEl);
  }

  // create H.Extras controls and append them to the end of the monthly summary (so they appear after the summary-grid)
  const summaryEl = document.getElementById('summary');
  // remove any existing H.Extras wrapper for this summary to avoid duplicates when re-rendering
  const existingHe = document.getElementById('h-extras-wrapper');
  if (existingHe && existingHe.parentNode) existingHe.parentNode.removeChild(existingHe);
  const heWrapper = document.createElement('div');
  heWrapper.id = 'h-extras-wrapper';
  heWrapper.className = 'day nuevo-dia';
  // give the control a month-scoped id to avoid collisions when switching months
  const heValueId = `h-extras-value-${month}`;
  heWrapper.innerHTML = `
    <div class="day-header">Horas Extras del mes</div>
    <div class="day-content">
      <div class="h-extras-controls" data-month="${month}">
        <button class="h-extras-btn" data-action="dec">-</button>
        <div class="h-extras-value" id="${heValueId}">${getStoredHE(year, month).toFixed(1)}</div>
        <button class="h-extras-btn" data-action="inc">+</button>
      </div>
    </div>
  `;
  // center the H.Extras wrapper contents
  heWrapper.style.textAlign = 'center';
  heWrapper.style.border = '1px solid black';
  heWrapper.style.marginTop = '6px';
  // append after the summary-grid so it appears at the end of the monthly summary
  const grid = summaryEl.querySelector('.summary-grid');
  if (grid) grid.parentNode.appendChild(heWrapper);

  // move the workDaysInfo container so it appears below the H.Extras control
  const workDaysInfoEl = document.getElementById('workDaysInfo');
  // ensure workDaysInfo is only appended once and placed after the H.Extras wrapper
  if (workDaysInfoEl) {
    if (workDaysInfoEl.parentNode) workDaysInfoEl.parentNode.removeChild(workDaysInfoEl);
    heWrapper.parentNode.appendChild(workDaysInfoEl);
  }

  // attach handlers for H.Extras controls (month-scoped)
  const heControls = heWrapper.querySelector('.h-extras-controls');
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
      document.getElementById(`h-extras-value-${m}`).textContent = next.toFixed(1);
      updateSummary();
    });
  }

  const workInfo = getMonthlyWorkDays(currentDate.getFullYear(), currentDate.getMonth());
  const workDaysInfo = document.getElementById('workDaysInfo');
  workDaysInfo.textContent = workInfo ? `Días laborables: ${workInfo.days} días ${workInfo.hours} Horas` : '';

  // attach event listeners after rendering
  document.querySelectorAll('.turno-select').forEach(sel => {
    const saved = localStorage.getItem(sel.dataset.fecha) || '';
    // ensure the select element itself receives the matching turno-* class so its color can be styled
    sel.className = 'turno-select';
    if (saved) sel.classList.add(`turno-${saved.toLowerCase()}`);
    sel.style.backgroundColor = getTurnoColor(saved);
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

  // determine previous turno stored for this date
  const previousTurno = localStorage.getItem(fecha) || '';

  // Update day content class
  dayContent.className = 'day-content';
  if (turno) dayContent.classList.add(`turno-${turno.toLowerCase()}`);
  // ensure the select element itself reflects the selected turno class (so LPF becomes orange)
  select.className = 'turno-select';
  if (turno) select.classList.add(`turno-${turno.toLowerCase()}`);
  select.style.backgroundColor = getTurnoColor(turno);

  // store new turno
  localStorage.setItem(fecha, turno);

  // Adjust monthly Horas Extras: +1 if newly set to 'A', -1 if previously was 'A' and changed away
  try {
    const dateParts = fecha.split('-');
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]) - 1;
    let currentHE = getStoredHE(year, month);

    if (previousTurno !== 'A' && turno === 'A') {
      currentHE = +(currentHE + 1).toFixed(1);
      storeHE(year, month, currentHE);
      // update UI value if present
      const heValueEl = document.getElementById(`h-extras-value-${month}`);
      if (heValueEl) heValueEl.textContent = currentHE.toFixed(1);
    } else if (previousTurno === 'A' && turno !== 'A') {
      // remove the 1 hour that was added when 'A' was selected
      currentHE = +(Math.max(0, currentHE - 1)).toFixed(1);
      storeHE(year, month, currentHE);
      const heValueEl = document.getElementById(`h-extras-value-${month}`);
      if (heValueEl) heValueEl.textContent = currentHE.toFixed(1);
    }
  } catch (err) {
    // fail silently if parsing/storage errors occur
    console.error('Error adjusting HE for Adelanto turno', err);
  }

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