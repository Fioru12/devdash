const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==================== API ====================

// --- Meteo ---
const WEATHER_API = 'https://wttr.in';

app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || '';
    const url = city
      ? `${WEATHER_API}/${encodeURIComponent(city)}?format=j1`
      : `${WEATHER_API}?format=j1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      return res.json({ error: 'Città non trovata' });
    }

    const current = data.current_condition?.[0];
    const location = data.nearest_area?.[0]?.areaName?.[0]?.value || 'Sconosciuta';

    // Previsioni 3 giorni
    const forecast = (data.weather || []).slice(0, 3).map((day) => ({
      date: day.date,
      tempMax: day.maxtempC,
      tempMin: day.mintempC,
      desc: day.hourly?.[0]?.weatherDesc?.[0]?.value || '',
      icon: day.hourly?.[0]?.weatherIconUrl?.[0]?.value || '',
    }));

    res.json({
      city: location,
      temp: current?.temp_C || 'N/A',
      feelsLike: current?.FeelsLikeC || 'N/A',
      humidity: current?.humidity || 'N/A',
      windSpeed: current?.windspeedKmph || 'N/A',
      desc: current?.weatherDesc?.[0]?.value || 'N/A',
      icon: current?.weatherIconUrl?.[0]?.value || '',
      forecast,
    });
  } catch (err) {
    res.json({ error: 'Impossibile recuperare il meteo' });
  }
});

// --- Citazione ---
const QUOTES_API = 'https://api.quotable.io/random';

app.get('/api/quote', async (req, res) => {
  try {
    const response = await fetch(QUOTES_API);
    const data = await response.json();
    res.json({
      content: data.content || 'La vita è ciò che accende mentre fai altri piani.',
      author: data.author || 'John Lennon',
    });
  } catch {
    res.json({
      content: 'La vita è ciò che accende mentre fai altri piani.',
      author: 'John Lennon',
    });
  }
});

// --- Monitor Sistema ---
app.get('/api/system', (req, res) => {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });

  const cpuUsage = Math.round((1 - totalIdle / totalTick) * 100);

  res.json({
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    cpu: {
      model: cpus[0]?.model || 'N/A',
      usage: cpuUsage,
      cores: cpus.length,
    },
    memory: {
      total: formatBytes(totalMem),
      used: formatBytes(usedMem),
      free: formatBytes(freeMem),
      percent: Math.round((usedMem / totalMem) * 100),
    },
    uptime: formatUptime(os.uptime()),
    loadAvg: os.loadavg().map((v) => v.toFixed(2)),
  });
});

// --- Todo List ---
const TODOS_FILE = path.join(__dirname, 'data', 'todos.json');

function readTodos() {
  try {
    if (!fs.existsSync(TODOS_FILE)) return [];
    const data = fs.readFileSync(TODOS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));
}

app.get('/api/todos', (req, res) => {
  res.json(readTodos());
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Testo richiesto' });
  }

  const todos = readTodos();
  const todo = {
    id: Date.now().toString(),
    text: text.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  writeTodos(todos);
  res.status(201).json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const idx = todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Todo non trovato' });

  if (req.body.done !== undefined) todos[idx].done = req.body.done;
  if (req.body.text) todos[idx].text = req.body.text.trim();

  writeTodos(todos);
  res.json(todos[idx]);
});

app.delete('/api/todos/:id', (req, res) => {
  let todos = readTodos();
  const before = todos.length;
  todos = todos.filter((t) => t.id !== req.params.id);
  if (todos.length === before) {
    return res.status(404).json({ error: 'Todo non trovato' });
  }
  writeTodos(todos);
  res.json({ ok: true });
});

// --- Time (mondiale) ---
app.get('/api/time', (req, res) => {
  const timezones = [
    { label: 'Roma', zone: 'Europe/Rome' },
    { label: 'New York', zone: 'America/New_York' },
    { label: 'Londra', zone: 'Europe/London' },
    { label: 'Tokyo', zone: 'Asia/Tokyo' },
    { label: 'Sydney', zone: 'Australia/Sydney' },
    { label: 'Mosca', zone: 'Europe/Moscow' },
  ];

  const times = timezones.map((tz) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('it-IT', {
      timeZone: tz.zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const dateStr = now.toLocaleDateString('it-IT', {
      timeZone: tz.zone,
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    return { label: tz.label, time: timeStr, date: dateStr };
  });

  res.json(times);
});

// ==================== SPA fallback ====================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== Start ====================
app.listen(PORT, () => {
  console.log(`✨ DevDash avviato!`);
  console.log(`🌐 Apri http://localhost:${PORT} nel browser`);
});

// ==================== Utilities ====================
function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < sizes.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(1)} ${sizes[i]}`;
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (days) parts.push(`${days}g`);
  if (hours) parts.push(`${hours}h`);
  parts.push(`${mins}m`);
  return parts.join(' ');
}