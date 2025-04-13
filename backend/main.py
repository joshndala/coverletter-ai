from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, get_db
from routers import cover_letters, auth, experiences
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "https://localhost:3000", 
        "https://127.0.0.1:3000",
        "http://frontend:3000",       # Docker service name
        "http://frontend"             # Docker service without port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(cover_letters.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(experiences.router, prefix="/api")