# ⎔ DevDash

Una dashboard personale moderna e reattiva con widget meteo, orologio mondiale, citazioni, monitor di sistema e todo list.

![Anteprima](https://img.shields.io/badge/Node.js-22.22-339933?logo=node.js)
![Anteprima](https://img.shields.io/badge/Express-4.21-000?logo=express)
![Licenza](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- 🌤️ **Meteo** — Temperatura, umidità, vento (dati in tempo reale)
- 🕐 **Orologio mondiale** — Roma, New York, Londra, Tokyo, Sydney, Mosca
- 💬 **Citazione quotidiana** — Ispirazione ogni 30 secondi
- 💻 **Monitor sistema** — CPU, RAM, uptime, carico
- ✅ **Todo list** — Aggiungi, completa ed elimina task
- 🔗 **Link rapidi** — Accesso一键 ai siti più usati
- 🌙 **Tema chiaro/scuro** — Con rilevamento automatico
- 📱 **Responsive** — Funziona su desktop e mobile
- 🔄 **Auto-refresh** — Widget aggiornati automaticamente

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

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 🛠️ Sviluppo

```bash
# Avvia con hot-reload (Node.js --watch)
npm run dev
```

## 📁 Struttura del progetto

```
devdash/
├── server.js          # Server Express + API
├── package.json
├── .gitignore
├── README.md
├── LICENSE
├── public/
│   ├── index.html     # Frontend
│   ├── style.css      # Stili (tema chiaro/scuro)
│   └── script.js      # Logica frontend
└── data/
    └── todos.json     # Todo list (persistente)
```

## 🌐 API disponibili

| Endpoint | Descrizione |
|----------|-------------|
| `GET /api/weather` | Meteo corrente (con supporto `?city=Nome`) |
| `GET /api/quote` | Citazione casuale |
| `GET /api/system` | Monitor sistema (CPU, RAM, uptime) |
| `GET /api/time` | Ora in 6 fusi orari |
| `GET /api/todos` | Lista todo |
| `POST /api/todos` | Aggiungi todo |
| `PUT /api/todos/:id` | Modifica todo |
| `DELETE /api/todos/:id` | Elimina todo |

## 📦 Dipendenze

- [Express](https://expressjs.com/) — Framework web

## 📄 Licenza

MIT — vedi [LICENSE](LICENSE).

---

<p align="center">Fatto con ❤️ e tanta voglia di imparare</p>