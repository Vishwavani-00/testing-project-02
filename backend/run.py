"""Entry point — seeds DB and starts FastAPI server."""
from app.utils.db import seed_database
import uvicorn

if __name__ == "__main__":
    print("🌱 Seeding database...")
    seed_database()
    print("✅ Database ready.")
    print("🚀 Starting NLQ API on http://localhost:8000")
    print("📖 Swagger docs: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
