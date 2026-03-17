# NLQ App — Natural Language Query Application

Convert natural language questions into SQL, execute them, and return **visual + textual insights** instantly.

> Built for Mu Sigma | Stack: React + FastAPI + PostgreSQL + OpenAI

---

## Core Flow

```
User Question → OpenAI (NL→SQL) → PostgreSQL → Chart + Summary
```

---

## Features

- 💬 **Chat-based query interface** — type questions in plain English
- ⚡ **NL → SQL conversion** via OpenAI GPT-4o-mini
- 📊 **Auto-generated charts** — bar, line, pie, or table (auto-detected)
- 🧠 **Insight summaries** — business-friendly explanations of results
- 🕑 **Query history** — re-run previous queries with one click
- 🛡️ **SQL validation** — blocks dangerous queries (DROP, DELETE, etc.)

---

## Project Structure

```
nlq-app/
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── routers/
│   │   ├── query.py               # POST /api/query/
│   │   ├── history.py             # GET/DELETE /api/history/
│   │   └── schema.py              # GET /api/schema/
│   ├── services/
│   │   └── nlq_service.py         # NL→SQL, execution, summary, chart logic
│   ├── models/
│   │   └── query_models.py        # Pydantic models
│   ├── db/
│   │   └── database.py            # SQLAlchemy + schema fetcher
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app with tabs
│   │   ├── components/
│   │   │   ├── QueryInput.jsx     # Input + suggestions
│   │   │   ├── ChartView.jsx      # Bar/Line/Pie/Table charts (Recharts)
│   │   │   ├── SQLViewer.jsx      # SQL display with copy button
│   │   │   ├── InsightSummary.jsx # AI-generated insight card
│   │   │   └── QueryHistory.jsx   # History sidebar
│   │   └── services/api.js        # Axios API client
│   ├── public/index.html
│   ├── package.json
│   └── Dockerfile
├── data/
│   └── seed.sql                   # Sample DB (sales, customers, products)
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### Option 1 — Docker (Recommended)

```bash
# 1. Clone the repo
git clone https://github.com/Vishwavani-00/testing-project-02.git
cd testing-project-02

# 2. Set your OpenAI API key
export OPENAI_API_KEY=your_key_here

# 3. Start everything
docker-compose up --build

# App runs at:
# Frontend → http://localhost:3000
# Backend API → http://localhost:8000
# API Docs → http://localhost:8000/docs
```

### Option 2 — Manual Setup

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your OPENAI_API_KEY
uvicorn main:app --reload --port 8000

# Database
psql -U nlq_user -d nlq_db -f ../data/seed.sql

# Frontend
cd ../frontend
npm install
npm start
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/query/` | Submit NL question → get SQL + chart + summary |
| GET | `/api/history/` | Get recent query history |
| DELETE | `/api/history/` | Clear history |
| GET | `/api/schema/` | Get database schema |
| GET | `/health` | Health check |

---

## Sample Questions

- *"Show total sales by region"*
- *"Top 5 products by revenue"*
- *"Monthly sales trend for 2024"*
- *"Which customers spent the most?"*
- *"List all products with rating above 4.5"*

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `DATABASE_URL` | PostgreSQL connection string |

---

## Success Metrics (per PRD)
- ✅ Response time < 5 sec
- ✅ SQL accuracy > 85% (GPT-4o-mini)
- ✅ Secure — RBAC-ready, no write queries allowed
