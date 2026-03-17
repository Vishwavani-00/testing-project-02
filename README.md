# NLQ App v2.0 — Natural Language Query (Local AI)

Convert plain English questions into SQL and get **visual charts + AI insights** — powered by **TinyLlama running locally via Ollama**. No API key. No cloud. 100% local.

---

## Architecture

```
┌──────────────────┐    REST API     ┌──────────────────┐    SQLite    ┌──────────────┐
│  React Frontend  │ ◄─────────────► │  FastAPI Backend │ ◄──────────► │  nlq.db      │
│  (Port 3000)     │                 │  (Port 8000)     │              │  (Local)     │
└──────────────────┘                 └──────────────────┘              └──────────────┘
                                              │
                                              ▼
                                    ┌──────────────────┐
                                    │  TinyLlama       │
                                    │  via Ollama      │
                                    │  (Port 11434)    │
                                    └──────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Recharts |
| Backend | Python FastAPI |
| LLM (NL→SQL) | TinyLlama 1.1B via Ollama (local) |
| Database | SQLite (local, no setup needed) |
| Insight Summary | TinyLlama |

## Prerequisites

1. **Ollama** installed and running
2. **TinyLlama** pulled: `ollama pull tinyllama`
3. Python 3.9+ and Node.js 16+

## Quick Start

```bash
# 1. Clone
git clone https://github.com/Vishwavani-00/testing-project-02.git
cd testing-project-02

# 2. Start Ollama (in a separate terminal)
ollama serve

# 3. Backend
cd backend
pip install -r requirements.txt
python run.py

# 4. Frontend (new terminal)
cd frontend
npm install
npm start

# Open http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/query/` | NL question → SQL + chart + summary |
| GET | `/api/history/` | Get query history |
| DELETE | `/api/history/` | Clear history |
| GET | `/api/schema/` | Get DB schema |
| GET | `/health` | Health check |

## Sample Questions

- "Show total sales by region"
- "Top 5 products by revenue"
- "List all customers"
- "Which salesperson has the highest sales?"
- "Show all products with rating above 4.5"

## Project Structure

```
testing-project-02/
├── backend/
│   ├── main.py              ← FastAPI entry point
│   ├── run.py               ← Seeds DB + starts server
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── routes/          ← query, history, schema
│       ├── models/          ← Pydantic models
│       ├── services/        ← NLQ pipeline (TinyLlama)
│       └── utils/           ← SQLite DB handler
├── frontend/
│   └── src/
│       ├── App.jsx
│       ├── components/      ← Navbar, QueryInput, ChartView, etc.
│       └── services/api.js
└── README.md
```

## Note on TinyLlama SQL Accuracy

TinyLlama (1.1B params) handles simple queries well. For complex JOINs or multi-table aggregations, SQL accuracy may vary. The app includes:
- Few-shot prompting to improve accuracy
- SQL safety validator (blocks DROP/DELETE/UPDATE)
- Fallback summary if model output is unclear
