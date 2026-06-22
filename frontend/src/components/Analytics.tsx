import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

interface Threat {
  id: number;
  attack_type: string;
  confidence: number;
  severity: string;
  risk_score: number;
}

interface Props {
  history: Threat[];
}

function Analytics({ history }: Props) {

  const attackCounts: any = {};

  history.forEach((item) => {
    attackCounts[item.attack_type] =
      (attackCounts[item.attack_type] || 0) + 1;
  });

  const attackData = Object.keys(attackCounts).map((key) => ({
    name: key,
    value: attackCounts[key],
  }));

  const severityData = [
    {
      name: "Low",
      value: history.filter(
        (x) => x.severity === "Low"
      ).length,
    },
    {
      name: "Medium",
      value: history.filter(
        (x) => x.severity === "Medium"
      ).length,
    },
    {
      name: "High",
      value: history.filter(
        (x) => x.severity === "High"
      ).length,
    },
    {
      name: "Critical",
      value: history.filter(
        (x) => x.severity === "Critical"
      ).length,
    },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#FF4560",
  ];

  return (
    <div
      style={{
        marginTop: "30px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h2>Attack Distribution</h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={attackData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {attackData.map(
                (_, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        <h2>Severity Analytics</h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={severityData}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;