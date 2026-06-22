import { useEffect, useState } from "react";
import axios from "axios";

interface Threat {
  id: number;
  attack_type: string;
  confidence: number;
  severity: string;
  risk_score: number;
}

function ThreatHistory() {
  const [history, setHistory] = useState<Threat[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/threat-history"
      );

      setHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        marginTop: "30px",
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
      }}
    >
      <h2>Threat History</h2>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Attack</th>
            <th>Confidence</th>
            <th>Severity</th>
            <th>Risk Score</th>
          </tr>
        </thead>

        <tbody>
          {history.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.attack_type}</td>
              <td>{item.confidence}%</td>
              <td>{item.severity}</td>
              <td>{item.risk_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ThreatHistory;