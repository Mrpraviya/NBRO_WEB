import { useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api";

export default function GeneratedReports() {
  const [sites, setSites] = useState([]);
  const [siteId, setSiteId] = useState("");
  const [reports, setReports] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    apiRequest("/sites")
      .then((data) => {
        if (!isCurrent) return;
        const records = Array.isArray(data) ? data : [];
        setSites(records);
        setSiteId(records[0]?.siteId ?? records[0]?.site_id ?? "");
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Unable to load sites.");
      })
      .finally(() => {
        if (isCurrent) setLoadingSites(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setReports([]);
    if (!siteId) {
      setLoadingReports(false);
      return () => {
        isCurrent = false;
      };
    }

    setLoadingReports(true);
    apiRequest(`/reports/site/${encodeURIComponent(siteId)}`)
      .then((data) => {
        if (isCurrent) setReports(Array.isArray(data) ? data : []);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Unable to load reports.");
      })
      .finally(() => {
        if (isCurrent) setLoadingReports(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [siteId]);

  const activeSite = sites.find((site) => (site.siteId ?? site.site_id) === siteId);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-700">Reports</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Generated reports</h1>
          </div>
          <label className="w-full max-w-md text-sm font-medium text-slate-700">
            Inspection site
            <select
              value={siteId}
              onChange={(event) => {
                setError("");
                setSiteId(event.target.value);
              }}
              disabled={loadingSites || sites.length === 0}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              {loadingSites ? <option value="">Loading sites...</option> : null}
              {!loadingSites && sites.length === 0 ? <option value="">No sites available</option> : null}
              {sites.map((site) => {
                const id = site.siteId ?? site.site_id;
                const owner = site.ownerName ?? site.owner_name ?? "Site";
                const reference = site.buildingRef ?? site.building_ref ?? id;
                return <option key={id} value={id}>{owner} · {reference}</option>;
              })}
            </select>
          </label>
        </div>

        {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-slate-900">{activeSite?.ownerName ?? activeSite?.owner_name ?? "Site reports"}</h2>
            <p className="mt-1 text-sm text-slate-500">{reports.length} report{reports.length === 1 ? "" : "s"}</p>
          </div>
          {loadingSites || loadingReports ? (
            <p className="p-8 text-center text-sm text-slate-500">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">No generated reports for this site.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Report</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Created</th>
                    <th className="px-5 py-3 font-semibold">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.analysisId} className="border-t border-slate-100">
                      <td className="px-5 py-4 font-medium text-slate-900">{report.reportTitle || report.analysisId}</td>
                      <td className="px-5 py-4">{report.status || "—"}</td>
                      <td className="px-5 py-4">{report.createdAt ? new Date(report.createdAt).toLocaleString() : "—"}</td>
                      <td className="px-5 py-4">
                        {report.analysisId && report.pdfPath ? (
                          <a href={apiUrl(`/reports/${report.analysisId}/download`)} className="font-semibold text-blue-700 hover:text-blue-900" target="_blank" rel="noreferrer">Download PDF</a>
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}