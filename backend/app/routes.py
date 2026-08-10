from fastapi import APIRouter

from app.database.db import SessionLocal
from app.database.models import ThreatLog

import random
from datetime import datetime

router = APIRouter()


@router.get("/threat-history")
def threat_history():

    db = SessionLocal()

    logs = (
        db.query(ThreatLog)
        .order_by(
            ThreatLog.id.desc()
        )
        .limit(100)
        .all()
    )

    result = []

    for log in logs:

        result.append({
            "id": log.id,
            "attack_type": log.attack_type,
            "confidence": log.confidence,
            "severity": log.severity,
            "risk_score": log.risk_score,
            "recommendation": log.recommendation,
            "created_at": log.created_at.isoformat() if log.created_at else None
        })

    db.close()

    return result


@router.get("/attack-distribution")
def attack_distribution():

    db = SessionLocal()

    logs = db.query(
        ThreatLog
    ).all()

    result = {}

    for log in logs:

        result[
            log.attack_type
        ] = result.get(
            log.attack_type,
            0
        ) + 1

    db.close()

    return result


@router.get("/soc-stats")
def soc_stats():

    db = SessionLocal()

    logs = db.query(
        ThreatLog
    ).all()

    total = len(logs)

    critical = len([
        x for x in logs
        if x.severity == "Critical"
    ])

    high = len([
        x for x in logs
        if x.severity == "High"
    ])

    medium = len([
        x for x in logs
        if x.severity == "Medium"
    ])

    low = len([
        x for x in logs
        if x.severity == "Low"
    ])

    attacks = {}

    for log in logs:

        attacks[
            log.attack_type
        ] = attacks.get(
            log.attack_type,
            0
        ) + 1

    top_attack = (
        max(
            attacks,
            key=attacks.get
        )
        if attacks
        else "None"
    )

    db.close()

    return {
        "total_threats": total,
        "critical": critical,
        "high": high,
        "medium": medium,
        "low": low,
        "top_attack": top_attack
    }


@router.get("/recent-threats")
def recent_threats():

    db = SessionLocal()

    logs = (
        db.query(
            ThreatLog
        )
        .order_by(
            ThreatLog.id.desc()
        )
        .limit(5)
        .all()
    )

    result = []

    for log in logs:

        result.append({
            "attack_type":
            log.attack_type,

            "confidence":
            log.confidence,

            "severity":
            log.severity
        })

    db.close()

    return result


@router.get("/threat-trend")
def threat_trend():

    db = SessionLocal()

    logs = (
        db.query(
            ThreatLog
        )
        .order_by(
            ThreatLog.id.desc()
        )
        .limit(20)
        .all()
    )

    trend = []

    counter = 1

    for log in reversed(logs):

        trend.append({
            "time": counter,
            "count": counter
        })

        counter += 1

    db.close()

    return trend


@router.post("/simulate-threat")
def simulate_threat():
    """
    Generates a random synthetic threat and saves it to the database.
    Useful for testing the Live Threat Feed without running the packet monitor.
    """

    attack_types = [
        "DoS", "Reconnaissance", "Exploits",
        "Generic", "Fuzzers", "Backdoor",
        "Shellcode", "Worms", "Analysis", "Normal"
    ]

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

    attack_type = random.choice(attack_types)
    confidence = round(random.uniform(50.0, 99.9), 2)

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

    risk_score = round(confidence * 0.9)
    recommendation = recommendations.get(attack_type, "Monitor network activity.")

    db = SessionLocal()

    log = ThreatLog(
        attack_type=attack_type,
        confidence=confidence,
        severity=severity,
        risk_score=risk_score,
        recommendation=recommendation,
        created_at=datetime.utcnow()
    )

    db.add(log)
    db.commit()
    db.refresh(log)
    db.close()

    return {
        "id": log.id,
        "attack_type": log.attack_type,
        "confidence": log.confidence,
        "severity": log.severity,
        "risk_score": log.risk_score,
        "recommendation": log.recommendation,
        "created_at": log.created_at.isoformat()
    }
