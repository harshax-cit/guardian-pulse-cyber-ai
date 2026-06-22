from fastapi import APIRouter

from app.database.db import SessionLocal
from app.database.models import ThreatLog

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
            "recommendation": log.recommendation
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