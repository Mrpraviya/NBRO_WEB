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

const backendPort = import.meta.env.VITE_BACKEND_PORT || '4000';
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

    // Risk Level Distribution
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
      .map(([level, count]) => ({
        name: level,
        value: count,
      }));

    const districtChartData = Object.entries(districtCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([district, count]) => ({
        name: district,
        count,
      }));

    setRiskData(riskChartData);
    setDistrictData(districtChartData);
    setStats({
      total: reportList.length,
      highRisk: highRiskCount,
      avgObservations:
        reportList.length > 0
          ? Math.round(totalObservations / reportList.length)
          : 0,
      completion: Math.round(
        ((reportList.length - (reportList.filter((r) => !r.createdAt).length || 0)) /
          reportList.length) *
          100
      ),
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Officer <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Manage hazard assessments and reports from a single interface
          </p>
          <button
            onClick={fetchReports}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            🔄 Refresh Data
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            Error loading reports: {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <>
            {/* Stats/Quick Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Reports</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-linear-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">High Risk</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.highRisk}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-linear-to-r from-red-100 to-pink-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4v2m0 4v2M6.343 3.665c.886-.887 2.318-.887 3.536 0l9.172 9.172c.886.886.886 2.318 0 3.536l-9.172 9.172c-.886.886-2.318.886-3.536 0l-9.172-9.172c-.886-.886-.886-2.318 0-3.536l9.172-9.172z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Avg Observations</p>
                    <p className="text-3xl font-bold text-amber-600 mt-2">{stats.avgObservations}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-linear-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.completion}%</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-linear-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Risk Level Pie Chart */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Risk Level Distribution</h3>
                {riskData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
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
                  <p className="text-gray-500 text-center py-12">No data available</p>
                )}
              </div>

              {/* District Distribution Bar Chart */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Top Districts</h3>
                {districtData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={districtData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-center py-12">No data available</p>
                )}
              </div>
            </div>

            {/* Main Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Card 1 - Create Report */}
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="mb-6">
                    <div className="h-14 w-14 rounded-xl bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center mb-6">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Create New Report</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Initiate a comprehensive hazard assessment with our guided reporting system
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/report")}
                    className="group relative w-full px-6 py-4 bg-linear-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center space-x-3">
                      <span>Start New Report</span>
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Card 2 - View Reports */}
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="mb-6">
                    <div className="h-14 w-14 rounded-xl bg-linear-to-r from-purple-500 to-pink-400 flex items-center justify-center mb-6">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">View All Reports</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Browse, filter, and export all submitted hazard assessment reports
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/reports")}
                    className="group relative w-full px-6 py-4 bg-linear-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center space-x-3">
                      <span>View Reports</span>
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Card 3 - Analytics */}
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:border-emerald-200 transition-all duration-300 group-hover:-translate-y-1">
                  <div className="mb-6">
                    <div className="h-14 w-14 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 flex items-center justify-center mb-6">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Manage Reports</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Edit, delete, and manage submitted reports from your organization
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/reports")}
                    className="group relative w-full px-6 py-4 bg-linear-to-r from-emerald-600 to-teal-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <span className="relative flex items-center justify-center space-x-3">
                      <span>Manage Reports</span>
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}