# ⎔ DevDash

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-22.22-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.21-000?logo=express)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)

**Dashboard personale moderna e reattiva per developers e sysadmin**

[Demo](#) • [Features](#-features) • [Installazione](#-installazione) • [Screenshots](#-screenshots) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### 🌤️ Widget Meteo
- Temperatura in tempo reale con gradiente dinamico
- Percepita, umidità, vento
- Previsioni 3 giorni
- Geolocalizzazione automatica

### 💻 Monitor Sistema
- CPU e RAM con barre di progresso animate
- Sparkline per storico utilizzo
- Hostname, piattaforma, uptime
- Load average in tempo reale

### 📰 News Tech
- Notizie da HackerNews in tempo reale
- Ticker animato con ultime notizie
- Punteggi, commenti, autore
- Aggiornamento automatico ogni 2 minuti

### ✅ Todo List
- Aggiungi, completa ed elimina task
- Animazioni fluide
- Persistenza dati in JSON
- Suoni di feedback

### 📝 Note & Bookmarks
- Note rapide con delete animato
- Bookmarks con link cliccabili
- Salvataggio automatico

### 📅 Calendario
- Mese corrente con giorno evidenziato
- Design minimalista

### � Network & Storage
- Interfacce di rete con IP
- Traffico RX/TX
- Dischi con percentuali e barre

### ⚙️ Servizi & GitHub
- Status servizi systemd con indicatori
- Profilo GitHub con avatar
- Repository recenti con stats

### ₿ Crypto
- Bitcoin, Ethereum, Solana
- Prezzi in USD con variazioni 24h

### ⏱️ Timer Pomodoro
- 25 minuti con start/pause/reset
- Suono quando scade

### 🎨 Personalizzazione
- Tema chiaro/scuro con transizioni
- Color picker con 8 colori
- Drag & drop per riordinare widget
- Shortcuts da tastiera

---

## 🚀 Installazione

```bash
# Clona il repository
git clone https://github.com/tuo-username/devdash.git
cd devdash

# Installa le dipendenze
npm install

# Avvia il server
npm start
```

Apri [http://localhost:3001](http://localhost:3001) nel browser.

---

## 🛠️ Sviluppo

```bash
# Avvia con hot-reload
npm run dev
```

---

## 📁 Struttura del progetto

```
devdash/
├── server.js          # Server Express + API
├── package.json       # Dipendenze
├── .gitignore         # File da ignorare
├── README.md          # Documentazione
├── LICENSE            # Licenza MIT
├── public/
│   ├── index.html     # HTML principale
│   ├── style.css      # Stili CSS
│   ├── script.js      # Logica JavaScript
│   ├── manifest.json  # PWA manifest
│   └── icons/         # Icone PWA
└── data/              # Dati persistenti (git-ignored)
    ├── todos.json
    ├── notes.json
    └── bookmarks.json
```

---

## 🎯 Tech Stack

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **OS Module** - Informazioni sistema
- **File System** - Persistenza dati

### Frontend
- **Vanilla JavaScript** - Nessun framework
- **CSS3** - Glassmorphism, animazioni, gradienti
- **HTML5** - Struttura semantica
- **Canvas API** - Particelle animate

### API Esterne
- **wttr.in** - Meteo
- **HackerNews API** - Notizie tech
- **CoinGecko API** - Prezzi crypto
- **GitHub API** - Profilo e repository
- **Quotable API** - Citazioni

---

## 🎨 Design

- **Glassmorphism** - Effetti vetro con backdrop-filter
- **Animazioni fluide** - Transizioni CSS e spring animations
- **Responsive** - Mobile-first con breakpoints
- **Dark Mode** - Tema scuro con transizioni
- **Micro-interazioni** - Hover effects, suoni, particelle

---

## ⌨️ Shortcuts

| Tasto | Azione |
|-------|--------|
| `T` | Focus su Todo input |
| `R` | Refresh tutti i widget |
| `D` | Cambia tema chiaro/scuro |
| `C` | Apri color picker |
| `?` | Mostra/nascondi shortcuts |

---

## 📊 API Endpoints

### Meteo
- `GET /api/weather?city=NomeCittà` - Meteo località

### Sistema
- `GET /api/system` - CPU, RAM, uptime

### Notizie
- `GET /api/news` - Top 15 da HackerNews

### Orologi
- `GET /api/time` - 6 timezone mondiali

### Todo
- `GET /api/todos` - Lista todos
- `POST /api/todos` - Crea todo
- `PUT /api/todos/:id` - Aggiorna todo
- `DELETE /api/todos/:id` - Elimina todo

### Note
- `GET /api/notes` - Lista note
- `POST /api/notes` - Crea nota
- `DELETE /api/notes/:id` - Elimina nota

### Bookmarks
- `GET /api/bookmarks` - Lista bookmarks
- `POST /api/bookmarks` - Crea bookmark
- `DELETE /api/bookmarks/:id` - Elimina bookmark

### Sistema Avanzato
- `GET /api/storage` - Dischi e utilizzo
- `GET /api/network` - Interfacce e traffico
- `GET /api/services` - Status servizi
- `GET /api/github` - Profilo GitHub
- `GET /api/crypto` - Prezzi crypto
- `GET /api/calendar` - Calendario mensile

---

## 🎯 Casi d'uso

- **Developers** - Monitoraggio sistema durante sviluppo
- **SysAdmin** - Overview server e servizi
- **Project Manager** - Todo list e note
- **Tech Enthusiast** - News e crypto tracking

---

## 🤝 Contributi

I contributi sono benvenuti! Sentiti libero di:
1. Forkare il progetto
2. Creare un branch (`git checkout -b feature/nuova-feature`)
3. Committare (`git commit -m 'Aggiunta nuova feature'`)
4. Pushare (`git push origin feature/nuova-feature`)
5. Aprire una Pull Request

---

## � Licenza

MIT © [Fioru12](https://github.com/Fioru12)

---

## 👨‍💻 Autore

**Nicolò Fiorucci**
- GitHub: [@Fioru12](https://github.com/Fioru12)
- LinkedIn: [Nicolò Fiorucci](https://linkedin.com/in/tuoprofilo)

---

<div align="center">

**Costruito con ❤️ e ☕**

[⬆ Torna su](#-devdash)

</div>