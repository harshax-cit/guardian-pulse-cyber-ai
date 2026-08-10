# GuardianPulse Cyber AI

A real-time network threat detection and SOC (Security Operations Center) monitoring platform powered by machine learning. It captures live network traffic, classifies attack types using an XGBoost model, and visualizes threats on an interactive dashboard.

---

## Features

- **Live Threat Detection** — classifies network flows into 10 attack categories in real time
- **SOC Dashboard** — KPI cards, attack distribution pie chart, severity analytics, threat trend line chart
- **Live Threat Feed** — auto-refreshes every 3 seconds with latest detections
- **Threat History Table** — full log of all past detections with confidence scores and risk scores
- **Simulate Threats** — seed the dashboard with synthetic data via `/simulate-threat` (no packet sniffer needed for testing)
- **Persistent Storage** — all detections saved to SQLite via SQLAlchemy

---

## Attack Categories

| Category | Description |
|---|---|
| Normal | Benign traffic |
| DoS | Denial of Service |
| Reconnaissance | Network scanning / probing |
| Exploits | Service exploitation |
| Fuzzers | Malformed packet injection |
| Backdoor | Unauthorized remote access |
| Shellcode | Shell injection attempts |
| Worms | Self-propagating malware |
| Analysis | Deep packet inspection evasion |
| Generic | Unclassified anomalies |

---

## Tech Stack

**Backend**
- Python 3.13
- FastAPI + Uvicorn
- SQLAlchemy + SQLite
- XGBoost + scikit-learn
- Scapy (packet monitor)

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts
- Axios + Lucide React

---

## Project Structure

```
GuardianPulse-Cyber-AI/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── routes.py            # API endpoints
│   │   ├── predictor.py         # ML inference + DB save
│   │   ├── schemas.py           # Request validation (Pydantic)
│   │   └── database/
│   │       ├── db.py            # SQLAlchemy engine & session
│   │       └── models.py        # ThreatLog ORM model
│   ├── packet-monitor/
│   │   ├── capture.py           # Raw packet capture (Scapy)
│   │   ├── flow_builder.py      # Groups packets into flows
│   │   ├── feature_extractor.py # Extracts ML features from flows
│   │   └── live_predictor.py    # Sends flows to /predict API
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/Dashboard.tsx  # Main dashboard (self-contained)
│   │   └── components/
│   │       ├── Analytics.tsx
│   │       └── ThreatHistory.tsx
│   ├── components/              # Modular dashboard components
│   │   ├── LiveThreatFeed.tsx
│   │   ├── KPICards.tsx
│   │   ├── AttackPieChart.tsx
│   │   ├── ThreatTrend.tsx
│   │   ├── RecentThreats.tsx
│   │   ├── SystemHealth.tsx
│   │   ├── NotificationPanel.tsx
│   │   └── ...
│   ├── hooks/                   # Data-fetching hooks
│   ├── services/api.ts
│   └── pages/Dashboard.tsx      # Modular dashboard entry
└── ml-engine/
    └── models/                  # Trained model files (.pkl)
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip

### 1. Clone the repo

```bash
git clone https://github.com/harshax-cit/guardian-pulse-cyber-ai.git
cd guardian-pulse-cyber-ai
```

### 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Run the backend

```bash
uvicorn app.main:app --reload --port 8000
```

API will be available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### 4. Frontend setup

```bash
cd frontend
npm install
```

### 5. Run the frontend

```bash
npm run dev
```

Dashboard will be available at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/health` | Service status |
| POST | `/predict` | Run ML prediction on a network flow |
| GET | `/threat-history` | Fetch last 100 threat logs |
| GET | `/recent-threats` | Fetch last 5 threats |
| GET | `/attack-distribution` | Attack type counts |
| GET | `/threat-trend` | Threat count over time |
| GET | `/soc-stats` | SOC KPI summary |
| POST | `/simulate-threat` | Generate a random synthetic threat (for testing) |

### Example: Simulate a threat

```bash
curl -X POST http://localhost:8000/simulate-threat
```

```json
{
  "id": 42,
  "attack_type": "DoS",
  "confidence": 94.31,
  "severity": "Critical",
  "risk_score": 85,
  "recommendation": "Enable rate limiting and block suspicious IPs.",
  "created_at": "2026-08-10T14:33:28.164710"
}
```

---

## Live Packet Monitor (optional)

To detect threats from real network traffic, run the packet monitor with root privileges:

```bash
cd backend/packet-monitor
sudo python3 live_predictor.py
```

This uses Scapy to capture packets, builds network flows, extracts features, and posts them to the `/predict` endpoint automatically.

> **Note:** Requires root/admin access for raw packet capture. For testing without root, use `/simulate-threat` instead.

---

## ML Model

The model is trained on the **UNSW-NB15** dataset — a comprehensive network intrusion dataset containing 9 attack categories and normal traffic. Features include packet counts, byte counts, inter-packet timing, TCP flags, load metrics, and protocol information.

Model files are stored in `ml-engine/models/`:
- `cyber_threat_model.pkl` — XGBoost classifier
- `feature_encoders.pkl` — Label encoders for categorical features
- `target_encoder.pkl` — Label encoder for attack type classes

---

## License

MIT
