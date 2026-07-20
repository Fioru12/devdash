// ==================== THEME TOGGLE ====================
const themeToggle = document.getElementById('themeToggle');

function getPreferredTheme() {
  const saved = localStorage.getItem('devdash-theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('devdash-theme', theme);
}

setTheme(getPreferredTheme());

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ==================== LOCAL TIME ====================
function updateLocalTime() {
  const now = new Date();
  document.getElementById('localTime').textContent = now.toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
updateLocalTime();
setInterval(updateLocalTime, 1000);

// ==================== FOOTER YEAR ====================
document.getElementById('footerYear').textContent = new Date().getFullYear();

// ==================== API FETCH WITH ERROR HANDLING ====================
async function fetchAPI(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function showError(widgetId, message) {
  const el = document.getElementById(widgetId);
  if (!el) return;
  el.textContent = message;
  el.classList.add('visible');
}

function hideError(widgetId) {
  const el = document.getElementById(widgetId);
  if (!el) return;
  el.classList.remove('visible');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== WIDGET: WEATHER ====================
async function loadWeather() {
  hideError('weatherError');
  try {
    const data = await fetchAPI('/api/weather');

    if (data.error) {
      showError('weatherError', data.error);
      return;
    }

    document.getElementById('weatherTemp').textContent = `${data.temp}°`;
    document.getElementById('weatherDesc').textContent = data.desc;
    document.getElementById('weatherFeels').textContent = `${data.feelsLike}°`;
    document.getElementById('weatherHumidity').textContent = `${data.humidity}%`;
    document.getElementById('weatherWind').textContent = `${data.windSpeed} km/h`;
    document.getElementById('weatherCity').textContent = `📍 ${data.city}`;
  } catch (err) {
    showError('weatherError', 'Errore di connessione');
  }
}

// ==================== WIDGET: QUOTE ====================
async function loadQuote() {
  try {
    const data = await fetchAPI('/api/quote');
    document.getElementById('quoteText').textContent = data.content;
    document.getElementById('quoteAuthor').textContent = `— ${data.author}`;
  } catch {
    document.getElementById('quoteText').textContent = 'Carica una nuova citazione...';
    document.getElementById('quoteAuthor').textContent = '';
  }
}

// ==================== WIDGET: CLOCK ====================
async function loadClocks() {
  try {
    const times = await fetchAPI('/api/time');
    const list = document.getElementById('clockList');
    list.innerHTML = times.map(t => `
      <div class="clock-item">
        <span class="clock-label">${t.label}</span>
        <div>
          <span class="clock-time">${t.time}</span>
          <span class="clock-date">${t.date}</span>
        </div>
      </div>
    `).join('');
  } catch {
    document.getElementById('clockList').innerHTML = '<div class="clock-item">Errore caricamento orari</div>';
  }
}

// ==================== WIDGET: SYSTEM ====================
async function loadSystem() {
  try {
    const data = await fetchAPI('/api/system');
    const cpuPct = Math.min(data.cpu.usage, 100);
    const ramPct = Math.min(data.memory.percent, 100);

    document.getElementById('cpuBar').style.width = `${cpuPct}%`;
    document.getElementById('cpuValue').textContent = `${cpuPct}%`;
    document.getElementById('ramBar').style.width = `${ramPct}%`;
    document.getElementById('ramValue').textContent = `${ramPct}%`;
    document.getElementById('sysHostname').textContent = data.hostname;
    document.getElementById('sysPlatform').textContent = `${data.platform} (${data.arch})`;
    document.getElementById('sysUptime').textContent = data.uptime;
    document.getElementById('sysLoad').textContent = data.loadAvg.join(' / ');
  } catch {
    // silently fail
  }
}

// ==================== WIDGET: TODO ====================
async function loadTodos() {
  try {
    const todos = await fetchAPI('/api/todos');
    const list = document.getElementById('todoList');
    if (todos.length === 0) {
      list.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 12px; font-size: 0.85rem;">Nessun task. Aggiungine uno! ✨</div>';
      return;
    }
    list.innerHTML = todos.map(t => `
      <li class="todo-item" data-id="${t.id}">
        <input type="checkbox" class="todo-check" ${t.done ? 'checked' : ''} />
        <span class="todo-text ${t.done ? 'done' : ''}">${escapeHtml(t.text)}</span>
        <button class="todo-delete" aria-label="Elimina">✕</button>
      </li>
    `).join('');

    // Event listeners for checkboxes
    list.querySelectorAll('.todo-check').forEach(cb => {
      cb.addEventListener('change', async (e) => {
        const li = e.target.closest('.todo-item');
        const id = li.dataset.id;
        await fetchAPI(`/api/todos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: e.target.checked }),
        });
        loadTodos();
      });
    });

    // Event listeners for delete buttons
    list.querySelectorAll('.todo-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const li = e.target.closest('.todo-item');
        const id = li.dataset.id;
        await fetch(`/api/todos/${id}`, { method: 'DELETE' });
        loadTodos();
      });
    });
  } catch {
    // silently fail
  }
}

// Todo form submit
document.getElementById('todoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) return;

  try {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    input.value = '';
    loadTodos();
  } catch {
    // silently fail
  }
});

// ==================== REFRESH BUTTONS ====================
document.querySelectorAll('.widget-refresh').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const widget = e.target.dataset.widget;
    switch (widget) {
      case 'weather': loadWeather(); break;
      case 'quote': loadQuote(); break;
      case 'clock': loadClocks(); break;
      case 'system': loadSystem(); break;
    }
  });
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  loadWeather();
  loadQuote();
  loadClocks();
  loadSystem();
  loadTodos();

  // Auto-refresh weather & system every 60s, quote every 30s, clocks every 10s
  setInterval(loadWeather, 60000);
  setInterval(loadSystem, 60000);
  setInterval(loadQuote, 30000);
  setInterval(loadClocks, 10000);
});