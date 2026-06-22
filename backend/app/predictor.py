import os
import joblib
import pandas as pd
import numpy as np

from app.database.db import SessionLocal
from app.database.models import ThreatLog

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_DIR = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "..",
        "..",
        "ml-engine",
        "models"
    )
)

model = joblib.load(
    os.path.join(
        MODEL_DIR,
        "cyber_threat_model.pkl"
    )
)

feature_encoders = joblib.load(
    os.path.join(
        MODEL_DIR,
        "feature_encoders.pkl"
    )
)

target_encoder = joblib.load(
    os.path.join(
        MODEL_DIR,
        "target_encoder.pkl"
    )
)


def predict_attack(data):

    proto_map = {
        cls: idx
        for idx, cls in enumerate(
            feature_encoders["proto"].classes_
        )
    }

    service_map = {
        cls: idx
        for idx, cls in enumerate(
            feature_encoders["service"].classes_
        )
    }

    state_map = {
        cls: idx
        for idx, cls in enumerate(
            feature_encoders["state"].classes_
        )
    }

    row = data.model_dump()

    row["proto"] = proto_map.get(
        row["proto"],
        0
    )

    row["service"] = service_map.get(
        row["service"],
        0
    )

    row["state"] = state_map.get(
        row["state"],
        0
    )

    df = pd.DataFrame([row])

    df["packet_ratio"] = (
        df["spkts"] /
        (df["dpkts"] + 1)
    )

    df["byte_ratio"] = (
        df["sbytes"] /
        (df["dbytes"] + 1)
    )

    df["load_ratio"] = (
        df["sload"] /
        (df["dload"] + 1)
    )

    prediction = model.predict(df)[0]

    probabilities = model.predict_proba(df)[0]

    confidence = float(
        np.max(probabilities) * 100
    )

    attack_type = (
        target_encoder
        .inverse_transform([prediction])[0]
    )

    all_probs = {}

    for i, prob in enumerate(probabilities):

        attack_name = (
            target_encoder
            .inverse_transform([i])[0]
        )

        all_probs[attack_name] = round(
            float(prob * 100),
            2
        )

    risk_score = round(
        confidence * 0.9
    )

    if attack_type == "Normal":
        severity = "Low"
    elif confidence >= 90:
        severity = "Critical"
    elif confidence >= 75:
        severity = "High"
    elif confidence >= 50:
        severity = "Medium"
    else:
        severity = "Low"

    recommendations = {
        "Normal": "No threat detected.",
        "DoS": "Enable rate limiting and block suspicious IPs.",
        "Reconnaissance": "Investigate network scanning activity.",
        "Exploits": "Patch vulnerable services immediately.",
        "Generic": "Review traffic anomalies and logs.",
        "Fuzzers": "Inspect malformed packet sources.",
        "Backdoor": "Isolate affected systems and scan for malware.",
        "Shellcode": "Run endpoint security scans immediately.",
        "Worms": "Disconnect infected hosts from the network.",
        "Analysis": "Perform deeper forensic investigation."
    }

    recommendation = recommendations.get(
        attack_type,
        "Monitor network activity."
    )

    try:

        db = SessionLocal()

        log = ThreatLog(
            attack_type=attack_type,
            confidence=round(confidence, 2),
            severity=severity,
            risk_score=risk_score,
            recommendation=recommendation
        )

        print("Saving Threat:", attack_type)

        db.add(log)

        print("Before Commit")

        db.commit()

        print("After Commit")

        db.refresh(log)

        print("Saved ID:", log.id)

        db.close()

    except Exception as e:

        print("DATABASE ERROR:", e)

    return {
        "attack_type": attack_type,
        "confidence": round(confidence, 2),
        "risk_score": risk_score,
        "severity": severity,
        "recommendation": recommendation,
        "probabilities": all_probs
    }