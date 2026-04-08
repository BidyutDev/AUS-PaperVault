import { Activity, DownloadCloud, FileText } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsTab({ allDepartments }) {
  // Mock Analytics Data
  const trafficData = [
    { name: "Mon", downloads: 120, uploads: 15 },
    { name: "Tue", downloads: 180, uploads: 22 },
    { name: "Wed", downloads: 250, uploads: 40 },
    { name: "Thu", downloads: 210, uploads: 35 },
    { name: "Fri", downloads: 190, uploads: 28 },
    { name: "Sat", downloads: 90, uploads: 10 },
    { name: "Sun", downloads: 110, uploads: 12 },
  ];

  const deptStats = allDepartments.map((dept) => ({
    name: dept.shortName,
    papers: Math.floor(Math.random() * 200) + 50,
  }));

  return (
    <div
      className="admin-analytics-section animate-slideUp"
      style={{ padding: "2rem", height: "100%", overflowY: "auto" }}
    >
      <h2
        className="admin-departments-title"
        style={{ marginBottom: "2rem" }}
      >
        Vault_Analytics{" "}
        <Activity
          size={18}
          style={{
            display: "inline",
            marginLeft: "0.5rem",
            color: "var(--color-vault-lavender)",
          }}
        />
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "2rem",
          marginBottom: "2rem",
        }}
        className="admin-analytics-grid"
      >
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              color: "var(--color-vault-steel)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <DownloadCloud size={16} /> Weekly Traffic (Uploads vs Downloads)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#afb3f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#afb3f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorUploads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff8080" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff8080" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#607b96"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#607b96"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "rgba(22, 26, 34, 0.95)",
                  border: "1px solid rgba(175, 179, 247, 0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="downloads"
                stroke="#afb3f7"
                fillOpacity={1}
                fill="url(#colorDownloads)"
              />
              <Area
                type="monotone"
                dataKey="uploads"
                stroke="#ff8080"
                fillOpacity={1}
                fill="url(#colorUploads)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1rem",
              color: "var(--color-vault-steel)",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <FileText size={16} /> Repository Size by Department
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptStats}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#607b96"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#607b96"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: "rgba(22, 26, 34, 0.95)",
                  border: "1px solid rgba(175, 179, 247, 0.2)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Bar dataKey="papers" fill="#92bcea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
