from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float

from app.database.db import Base

class ThreatLog(Base):

    __tablename__ = "threat_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    attack_type = Column(
        String
    )

    confidence = Column(
        Float
    )

    severity = Column(
        String
    )

    risk_score = Column(
        Integer
    )

    recommendation = Column(
        String
    )