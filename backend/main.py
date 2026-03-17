from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import query, history, schema

app = FastAPI(
    title="NLQ Application API",
    description="Natural Language Query — powered by TinyLlama (local) via Ollama",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(query.router, prefix="/api/query", tags=["Query"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(schema.router, prefix="/api/schema", tags=["Schema"])


@app.get("/")
def root():
    return {"message": "NLQ App v2.0 — powered by TinyLlama (local)", "version": "2.0.0"}


@app.get("/health")
def health():
    return {"status": "ok", "model": "tinyllama", "provider": "ollama"}
