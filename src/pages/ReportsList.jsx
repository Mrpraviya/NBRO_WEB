import { useEffect, useState } from "react";

export default function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const API_KEY = import.meta.env.VITE_API_KEY || null;
  const backendPort = import.meta.env.VITE_BACKEND_PORT || "4000";
  const backendProtocol =
    window.location.protocol === "https:" ? "https:" : "http:";
  const host = window.location.hostname || "localhost";

  async function fetchReports() {
    setLoading(true);
    try {
      const res = await fetch(
        `${backendProtocol}//${host}:${backendPort}/api/reports`,
      );
      const data = await res.json();
      setReports(data || []);
    } catch (e) {
      setError(e.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  const exportCSV = () => {
    if (!reports || reports.length === 0) return;
    const headers = Object.keys(reports[0]);
    const rows = reports.map((r) =>
      headers.map((h) => `"${String(r[h] ?? "")}"`).join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div
        className="max-w-6xl mx-auto
                   bg-white/90 backdrop-blur
                   rounded-2xl shadow-xl
                   border border-gray-100 p-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Saved Reports
            </h2>
            <p className="text-sm text-gray-500">
              View and export submitted inspection reports
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={exportCSV} className="primary-btn cursor-pointer">
              Download CSV
            </button>
            <button
              onClick={() => exportSelectedPDF()}
              className="primary-btn cursor-pointer"
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="text-sm text-gray-500">Loading reports…</div>
        )}

        {error && (
          <div
            className="mb-4 p-4 rounded-lg
                       bg-red-50 border border-red-200
                       text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 ">
            <table className="w-full text-sm border-collapse hover:table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-xl font-bold text-center">
                  <th className="p-3 border-b"></th>
                  <th className="p-3 border-b text-left ">ID</th>
                  <th className="p-3 border-b text-left">Applicant</th>
                  <th className="p-3 border-b text-left">Date</th>
                  <th className="p-3 border-b text-left">District</th>
                  <th className="p-3 border-b text-left">Risk</th>
                  <th className="p-3 border-b text-left">Created At</th>
                  <th className="p-3 border-b text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {reports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-gray-500">
                      No reports found
                    </td>
                  </tr>
                )}
                {reports.map((r) => (
                  <tr
                    key={r.id}
                    className="
    transition-all duration-200 ease-out
    hover:bg-gray-50
    hover:shadow-sm
    hover:scale-[1.01]
  "
                  >
                    <td className="p-3 border-b text-center">
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={(e) => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(r.id);
                          else next.delete(r.id);
                          setSelected(next);
                          setSelectAll(
                            next.size === reports.length && reports.length > 0,
                          );
                        }}
                      />
                    </td>
                    <td className="p-3 border-b">{r.id}</td>
                    <td className="p-3 border-b">{r.applicantName}</td>
                    <td className="p-3 border-b">{r.inspectionDate}</td>
                    <td className="p-3 border-b">{r.district}</td>
                    <td className="p-3 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${
                            r.riskLevel === "High"
                              ? "bg-red-100 text-red-700"
                              : r.riskLevel === "Moderate"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                      >
                        {r.riskLevel}
                      </span>
                    </td>
                    <td className="p-3 border-b text-gray-500">
                      {r.createdAt}
                    </td>
                    <td className="p-3 border-b">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            // navigate to edit page (app should route this)
                            window.location.href = `/report/edit/${r.id}`;
                          }}
                          className="text-sm text-green-600 hover:underline cursor:pointer"
                        >
                          Update
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              !window.confirm(
                                "Delete this report? This will remove its attachments too.",
                              )
                            )
                              return;
                            try {
                              const res = await fetch(
                                `${backendProtocol}//${host}:${backendPort}/api/reports/${r.id}`,
                                {
                                  method: "DELETE",
                                  headers: API_KEY
                                    ? { "x-api-key": API_KEY }
                                    : {},
                                },
                              );
                              if (!res.ok) throw new Error("Delete failed");
                              await fetchReports();
                            } catch (e) {
                              alert(e.message || "Delete failed");
                            }
                          }}
                          className="text-sm text-red-600 hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  async function exportPdf(ids) {
    try {
      const res = await fetch(
        `${backendProtocol}//${host}:${backendPort}/api/export/pdf`,
        {
          method: "POST",
          headers: Object.assign(
            { "Content-Type": "application/json" },
            API_KEY ? { "x-api-key": API_KEY } : {},
          ),
          body: JSON.stringify({ ids }),
        },
      );
      if (!res.ok) throw new Error("Failed to generate PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reports.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message || "Export failed");
    }
  }

  function exportSelectedPDF() {
    if (!selected || selected.size === 0)
      return alert("Select one or more reports to export");
    exportPdf(Array.from(selected));
  }

  async function bulkDeleteSelected() {
    if (!selected || selected.size === 0)
      return alert("Select reports to delete");
    if (
      !window.confirm(
        "Delete selected reports? This will remove attachments too.",
      )
    )
      return;
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          fetch(
            `${backendProtocol}//${host}:${backendPort}/api/reports/${id}`,
            {
              method: "DELETE",
              headers: API_KEY ? { "x-api-key": API_KEY } : {},
            },
          ),
        ),
      );
      setSelected(new Set());
      setSelectAll(false);
      await fetchReports();
    } catch (e) {
      alert("Bulk delete failed: " + (e.message || "error"));
    }
  }
}
