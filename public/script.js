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
  playSound('theme');
});

// ==================== HEADER DATE ====================
function updateHeaderDate() {
  const now = new Date();
  const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
  const day = dayNames[now.getDay()];
  const date = now.getDate();
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  document.getElementById('headerDate').textContent = `${day} ${date} ${month} ${year}`;
}
updateHeaderDate();

// ==================== COLOR PICKER ====================
const colorPickerBtn = document.getElementById('colorPickerBtn');
const colorPopup = document.getElementById('colorPopup');
const colorPopupClose = document.getElementById('colorPopupClose');
const colorOptions = document.querySelectorAll('.color-opt');

function getAccentRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function setAccentColor(hex) {
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  root.style.setProperty('--accent-rgb', getAccentRGB(hex));
  root.style.setProperty('--accent-light', hex);
  root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${hex}, ${hex})`);
  localStorage.setItem('devdash-accent', hex);

  colorOptions.forEach(opt => opt.classList.remove('active'));
  const activeOpt = document.querySelector(`.color-opt[data-color="${hex}"]`);
  if (activeOpt) activeOpt.classList.add('active');
}

const savedAccent = localStorage.getItem('devdash-accent');
if (savedAccent) setAccentColor(savedAccent);

colorPickerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  colorPopup.classList.toggle('visible');
});

colorPopupClose.addEventListener('click', () => {
  colorPopup.classList.remove('visible');
});

document.addEventListener('click', (e) => {
  if (!colorPopup.contains(e.target) && e.target !== colorPickerBtn) {
    colorPopup.classList.remove('visible');
  }
});

colorOptions.forEach(opt => {
  opt.addEventListener('click', () => {
    const color = opt.dataset.color;
    setAccentColor(color);
    playSound('theme');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key.toLowerCase() === 'c') {
    e.preventDefault();
    colorPopup.classList.toggle('visible');
  }
});

// ==================== SOUND EFFECTS ====================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    switch (type) {
      case 'todo':
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
        break;
      case 'delete':
        osc.frequency.value = 400;
        osc.type = 'sawtooth';
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
        break;
      case 'refresh':
        osc.frequency.value = 600;
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
        break;
      case 'theme':
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
        break;
    }
  } catch {
    // Silently fail
  }
}

// ==================== PARTICLE CANVAS ====================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
const PARTICLE_COUNT = 30;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.3 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  draw() {
    const accentColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-rgb')
      .trim() || '0, 113, 227';

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${accentColor}, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent-rgb')
    .trim() || '0, 113, 227';

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        const opacity = (1 - dist / 120) * 0.08;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${accentColor}, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  drawConnections();
  requestAnimationFrame(animateParticles);
}

animateParticles();

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

// ==================== API FETCH ====================
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

// ==================== ANIMATED COUNTER ====================
function animateCounter(element, targetValue, suffix = '') {
  const target = parseInt(targetValue);
  if (isNaN(target)) {
    element.textContent = targetValue + suffix;
    return;
  }

  const duration = 800;
  const startTime = performance.now();
  const startValue = parseInt(element.textContent) || 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startValue + (target - startValue) * easeProgress);
    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ==================== SPARKLINE ====================
const cpuHistory = [];
const ramHistory = [];
const MAX_HISTORY = 60;

function drawSparkline(canvasId, data, color) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  const c = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const padding = 2;

  c.clearRect(0, 0, w, h);

  if (data.length < 2) return;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  // Draw fill
  c.beginPath();
  c.moveTo(0, h - padding);
  data.forEach((val, i) => {
    const x = (i / (data.length - 1)) * (w - padding * 2) + padding;
    const y = (h - padding) - ((val - min) / range) * (h - padding * 2);
    c.lineTo(x, y);
  });
  c.lineTo(w - padding, h - padding);
  c.closePath();

  const gradient = c.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, color.replace('0.', '0.15'));
  gradient.addColorStop(1, color.replace('0.', '0.01'));
  c.fillStyle = gradient;
  c.fill();

  // Draw line
  c.beginPath();
  data.forEach((val, i) => {
    const x = (i / (data.length - 1)) * (w - padding * 2) + padding;
    const y = (h - padding) - ((val - min) / range) * (h - padding * 2);
    if (i === 0) c.moveTo(x, y);
    else c.lineTo(x, y);
  });
  c.strokeStyle = color;
  c.lineWidth = 1.5;
  c.stroke();
}

// ==================== NEWS ====================
let newsData = [];

async function loadNews() {
  try {
    const stories = await fetchAPI('/api/news');
    newsData = stories;
    const list = document.getElementById('newsList');
    
    if (stories.length === 0) {
      list.innerHTML = '<div style="color: var(--text-tertiary); text-align: center; padding: 20px;">Nessuna notizia disponibile</div>';
      return;
    }

    list.innerHTML = stories.map((story, i) => {
      const timeAgo = getTimeAgo(story.time);
      return `
        <a href="${story.url}" target="_blank" class="news-item" style="animation-delay: ${i * 0.05}s">
          <div class="news-score">
            <span>${story.score}</span>
            <span class="news-score-label">punti</span>
          </div>
          <div class="news-content">
            <div class="news-title">${escapeHtml(story.title)}</div>
            <div class="news-meta">
              <span>👤 ${story.author}</span>
              <span>💬 ${story.comments}</span>
              <span>🕐 ${timeAgo}</span>
            </div>
          </div>
        </a>
      `;
    }).join('');

    // Update ticker
    updateTicker(stories);
  } catch {
    document.getElementById('newsList').innerHTML = '<div style="color: var(--text-tertiary); text-align: center; padding: 20px;">Errore caricamento notizie</div>';
  }
}

function updateTicker(stories) {
  const track = document.getElementById('tickerTrack');
  if (stories.length === 0) {
    track.innerHTML = '<span class="ticker-text">Nessuna notizia al momento</span>';
    return;
  }
  // Create a long string with all titles separated by bullets
  const text = stories.map(s => s.title).join('  •  ') + '  •  ';
  track.innerHTML = `<span class="ticker-text">${escapeHtml(text)}</span>`;
}

function getTimeAgo(timestamp) {
  const seconds = Math.floor(Date.now() / 1000) - timestamp;
  if (seconds < 60) return 'ora';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h fa`;
  const days = Math.floor(hours / 24);
  return `${days}g fa`;
}

// ==================== WIDGET: WEATHER ====================
async function loadWeather() {
  hideError('weatherError');
  const tempEl = document.getElementById('weatherTemp');
  tempEl.classList.add('loading');

  try {
    const data = await fetchAPI('/api/weather');

    if (data.error) {
      showError('weatherError', data.error);
      tempEl.classList.remove('loading');
      return;
    }

    tempEl.classList.remove('loading');
    document.getElementById('weatherTemp').textContent = `${data.temp}°`;
    document.getElementById('weatherDesc').textContent = data.desc;
    document.getElementById('weatherFeels').textContent = `${data.feelsLike}°`;
    document.getElementById('weatherHumidity').textContent = `${data.humidity}%`;
    document.getElementById('weatherWind').textContent = `${data.windSpeed} km/h`;
    document.getElementById('weatherCity').textContent = `📍 ${data.city}`;

    // Render forecast 3 giorni
    const forecastRow = document.getElementById('forecastRow');
    if (data.forecast && data.forecast.length > 0) {
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
      const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

      forecastRow.innerHTML = data.forecast.map(day => {
        const date = new Date(day.date + 'T00:00:00');
        const dayName = dayNames[date.getDay()];
        const month = monthNames[date.getMonth()];
        const dayNum = date.getDate();

        return `
          <div class="forecast-card">
            <div class="forecast-date">${dayName} ${dayNum} ${month}</div>
            <div class="forecast-icon">${day.icon ? '🌤️' : '🌡️'}</div>
            <div class="forecast-temps">
              <span class="forecast-temp-max">${day.tempMax}°</span>
              <span class="forecast-temp-min">${day.tempMin}°</span>
            </div>
          </div>
        `;
      }).join('');
    } else {
      forecastRow.innerHTML = '';
    }
  } catch (err) {
    tempEl.classList.remove('loading');
    showError('weatherError', 'Errore di connessione');
  }
}

// ==================== WIDGET: QUOTE ====================
async function loadQuote() {
  try {
    const data = await fetchAPI('/api/quote');
    const textEl = document.getElementById('quoteText');
    textEl.style.opacity = '0';
    setTimeout(() => {
      textEl.textContent = data.content;
      textEl.style.opacity = '1';
      document.getElementById('quoteAuthor').textContent = `— ${data.author}`;
    }, 200);
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

    animateCounter(document.getElementById('cpuValue'), cpuPct, '%');
    animateCounter(document.getElementById('ramValue'), ramPct, '%');

    document.getElementById('cpuBar').style.width = `${cpuPct}%`;
    document.getElementById('ramBar').style.width = `${ramPct}%`;
    document.getElementById('sysHostname').textContent = data.hostname;
    document.getElementById('sysPlatform').textContent = `${data.platform} (${data.arch})`;
    document.getElementById('sysUptime').textContent = data.uptime;
    document.getElementById('sysLoad').textContent = data.loadAvg.join(' / ');

    cpuHistory.push(cpuPct);
    ramHistory.push(ramPct);
    if (cpuHistory.length > MAX_HISTORY) cpuHistory.shift();
    if (ramHistory.length > MAX_HISTORY) ramHistory.shift();

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#0071e3';
    const success = '#34c759';

    drawSparkline('sparklineCpu', cpuHistory, accent);
    drawSparkline('sparklineRam', ramHistory, success);
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
      list.innerHTML = '<div style="color: var(--text-tertiary); text-align: center; padding: 16px; font-size: 0.85rem; font-weight: 500;">Nessun task. Aggiungine uno! ✨</div>';
      return;
    }
    list.innerHTML = todos.map(t => `
      <li class="todo-item" data-id="${t.id}">
        <input type="checkbox" class="todo-check" ${t.done ? 'checked' : ''} />
        <span class="todo-text ${t.done ? 'done' : ''}">${escapeHtml(t.text)}</span>
        <button class="todo-delete" aria-label="Elimina">✕</button>
      </li>
    `).join('');

    list.querySelectorAll('.todo-check').forEach(cb => {
      cb.addEventListener('change', async (e) => {
        const li = e.target.closest('.todo-item');
        const id = li.dataset.id;
        await fetch(`/api/todos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: e.target.checked }),
        });
        if (e.target.checked) playSound('todo');
        loadTodos();
      });
    });

    list.querySelectorAll('.todo-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const li = e.target.closest('.todo-item');
        li.classList.add('removing');
        playSound('delete');
        const id = li.dataset.id;
        setTimeout(async () => {
          await fetch(`/api/todos/${id}`, { method: 'DELETE' });
          loadTodos();
        }, 300);
      });
    });
  } catch {
    // silently fail
  }
}

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
    playSound('todo');
    loadTodos();
  } catch {
    // silently fail
  }
});

// ==================== REFRESH BUTTONS ====================
document.querySelectorAll('.widget-refresh').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const widget = e.target.dataset.widget;
    btn.classList.add('spinning');
    playSound('refresh');
    setTimeout(() => btn.classList.remove('spinning'), 600);

    switch (widget) {
      case 'weather': loadWeather(); break;
      case 'quote': loadQuote(); break;
      case 'clock': loadClocks(); break;
      case 'system': loadSystem(); break;
    }
  });
});

// ==================== KEYBOARD SHORTCUTS ====================
const shortcutHint = document.getElementById('shortcutHint');
let hintTimeout;

function showShortcutHint() {
  shortcutHint.classList.add('visible');
  clearTimeout(hintTimeout);
  hintTimeout = setTimeout(() => {
    shortcutHint.classList.remove('visible');
  }, 4000);
}

if (!localStorage.getItem('devdash-hint-seen')) {
  setTimeout(showShortcutHint, 2000);
  localStorage.setItem('devdash-hint-seen', 'true');
}

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;

  switch (e.key.toLowerCase()) {
    case 't':
      e.preventDefault();
      document.getElementById('todoInput').focus();
      break;
    case 'r':
      e.preventDefault();
      loadWeather();
      loadQuote();
      loadClocks();
      loadSystem();
      playSound('refresh');
      break;
    case 'd':
      e.preventDefault();
      themeToggle.click();
      break;
    case 'c':
      e.preventDefault();
      colorPopup.classList.toggle('visible');
      break;
    case '?':
      e.preventDefault();
      if (shortcutHint.classList.contains('visible')) {
        shortcutHint.classList.remove('visible');
      } else {
        showShortcutHint();
      }
      break;
  }
});

document.addEventListener('click', (e) => {
  if (!shortcutHint.contains(e.target)) {
    shortcutHint.classList.remove('visible');
  }
});

// ==================== THEME CHANGE SPARKLINE REPAINT ====================
const observer = new MutationObserver(() => {
  if (cpuHistory.length > 0) {
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#0071e3';
    drawSparkline('sparklineCpu', cpuHistory, accent);
  }
});
observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  loadWeather();
  loadQuote();
  loadClocks();
  loadSystem();
  loadTodos();
  loadNews();

  setInterval(loadWeather, 60000);
  setInterval(loadSystem, 2000);
  setInterval(loadQuote, 30000);
  setInterval(loadClocks, 10000);
  setInterval(loadNews, 120000); // Refresh news every 2 min
});