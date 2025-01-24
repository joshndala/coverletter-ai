from fastapi import FastAPI
from app.routes import router
from app.database import Base, engine

app = FastAPI()
app.include_router(router)

# Create database tables
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)