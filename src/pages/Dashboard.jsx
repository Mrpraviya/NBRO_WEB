import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RISK_COLORS = {
  Low: "#10b981",
  Moderate: "#f59e0b",
  High: "#ef4444",
  Critical: "#991b1b",
};

const backendPort = import.meta.env.VITE_BACKEND_PORT || "4000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riskData, setRiskData] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    avgObservations: 0,
    completion: 0,
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:${backendPort}/api/reports`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
      processReportData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (reportList) => {
    if (!reportList || reportList.length === 0) {
      setRiskData([]);
      setDistrictData([]);
      setStats({ total: 0, highRisk: 0, avgObservations: 0, completion: 0 });
      return;
    }

    const riskCounts = { Low: 0, Moderate: 0, High: 0, Critical: 0 };
    const districtCounts = {};
    let highRiskCount = 0;
    let totalObservations = 0;

    reportList.forEach((report) => {
      const risk = report.riskLevel || "Low";
      riskCounts[risk] = (riskCounts[risk] || 0) + 1;

      if (risk === "High" || risk === "Critical") {
        highRiskCount++;
      }

      const district = report.district || "Unknown";
      districtCounts[district] = (districtCounts[district] || 0) + 1;

      if (report.observations) {
        totalObservations += report.observations.split(",").length;
      }
    });

    const riskChartData = Object.entries(riskCounts)
      .filter(([, count]) => count > 0)
      .map(([level, count]) => ({ name: level, value: count }));

    const districtChartData = Object.entries(districtCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([district, count]) => ({ name: district, count }));

    setRiskData(riskChartData);
    setDistrictData(districtChartData);
    setStats({
      total: reportList.length,
      highRisk: highRiskCount,
      avgObservations: reportList.length > 0 ? Math.round(totalObservations / reportList.length) : 0,
      completion: Math.round(
        ((reportList.length - (reportList.filter((r) => !r.createdAt).length || 0)) / reportList.length) * 100,
      ),
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 rounded-[32px] bg-gradient-to-br from-slate-950 via-blue-950 to-sky-700 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.28)] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-200">Operations center</p>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                Officer <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
                Manage hazard assessments, inspection records, and live reporting data from a single command center.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchReports}
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Refresh Data
              </button>
              <button
                onClick={() => navigate("/sites")}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110"
              >
                Open modules
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            Error loading reports: {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-base font-medium text-slate-600">Loading analytics...</p>
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  label: "Total Reports",
                  value: stats.total,
                  tone: "from-blue-500 to-cyan-400",
                  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  text: "text-blue-600",
                  card: "bg-blue-50",
                },
                {
                  label: "High Risk",
                  value: stats.highRisk,
                  tone: "from-red-500 to-rose-400",
                  icon: "M12 9v2m0 4v2m0 4v2M6.343 3.665c.886-.887 2.318-.887 3.536 0l9.172 9.172c.886.886.886 2.318 0 3.536l-9.172 9.172c-.886.886-2.318.886-3.536 0l-9.172-9.172c-.886-.886-.886-2.318 0-3.536l9.172-9.172z",
                  text: "text-red-600",
                  card: "bg-red-50",
                },
                {
                  label: "Avg Observations",
                  value: stats.avgObservations,
                  tone: "from-amber-500 to-orange-400",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  text: "text-amber-600",
                  card: "bg-amber-50",
                },
                {
                  label: "Completion Rate",
                  value: `${stats.completion}%`,
                  tone: "from-emerald-500 to-teal-400",
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  text: "text-emerald-600",
                  card: "bg-emerald-50",
                },
              ].map((item) => (
                <div key={item.label} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{item.label}</p>
                      <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">{item.value}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r ${item.tone}`}>
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8 grid gap-6 xl:grid-cols-2">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Risk Level Distribution</h3>
                {riskData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={88}
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.name] || "#888"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-12 text-center text-slate-500">No data available</p>
                )}
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <h3 className="mb-4 text-xl font-bold text-slate-900">Top Districts</h3>
                {districtData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={districtData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" angle={-35} textAnchor="end" height={72} tick={{ fill: "#475569", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#475569", fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="py-12 text-center text-slate-500">No data available</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {[
                {
                  title: "Create New Report",
                  description: "Initiate a comprehensive hazard assessment with our guided reporting system.",
                  button: "Start New Report",
                  route: "/report",
                  gradient: "from-blue-600 to-cyan-500",
                  icon: "M12 4v16m8-8H4",
                  shadow: "shadow-blue-500/20",
                },
                {
                  title: "View All Database Tables",
                  description: "Browse every row from the inspection schema tables in one place.",
                  button: "View Tables",
                  route: "/reports",
                  gradient: "from-violet-600 to-pink-500",
                  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  shadow: "shadow-violet-500/20",
                },
                {
                  title: "Manage Reports",
                  description: "Edit, delete, and manage submitted reports from your organization.",
                  button: "Manage Reports",
                  route: "/reports",
                  gradient: "from-emerald-600 to-teal-500",
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  shadow: "shadow-emerald-500/20",
                },
              ].map((card) => (
                <div key={card.title} className="group relative">
                  <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-r ${card.gradient} opacity-10 blur-xl transition group-hover:opacity-20`} />
                  <div className="relative flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.gradient} shadow-lg ${card.shadow}`}>
                      <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={card.icon} />
                      </svg>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">{card.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{card.description}</p>

                    <button
                      onClick={() => navigate(card.route)}
                      className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${card.gradient} px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110`}
                    >
                      <span>{card.button}</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
