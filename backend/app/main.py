from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import ThreatRequest
from app.predictor import predict_attack
from app.routes import router

from app.database.db import engine, Base
from app.database.models import ThreatLog

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GuardianPulse Cyber AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router)


@app.get("/")
def home():

    return {
        "message": "GuardianPulse Cyber AI Running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/predict")
def predict(
    request: ThreatRequest
):

    return predict_attack(request)