from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import query, history, schema

app = FastAPI(
    title="NLQ Application API",
    description="Natural Language Query — converts user questions to SQL, executes, and returns charts + insights",
    version="1.0.0"
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
    return {"message": "NLQ Application is running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
