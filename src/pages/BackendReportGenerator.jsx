import { useEffect, useState } from "react";
import { apiRequest, apiUrl } from "../utils/api";

function getSiteId(site) {
  return site?.siteId ?? site?.site_id ?? "";
}

function getUserId(site) {
  return site?.userId ?? site?.user_id ?? "";
}

function getSiteLabel(site) {
  const owner = site?.ownerName ?? site?.owner_name ?? "Site";
  const reference = site?.buildingRef ?? site?.building_ref;
  return [owner, reference].filter(Boolean).join(" · ");
}

export default function BackendReportGenerator() {
  const [sites, setSites] = useState([]);
  const [siteId, setSiteId] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [loadingSites, setLoadingSites] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);

  useEffect(() => {
    let isCurrent = true;
    apiRequest("/sites")
      .then((data) => {
        if (!isCurrent) return;
        const records = Array.isArray(data) ? data.filter((site) => getSiteId(site)) : [];
        setSites(records);
        setSiteId(records.length > 0 ? getSiteId(records[0]) : "");
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

  const selectedSite = sites.find((site) => getSiteId(site) === siteId);
  const canGenerate = Boolean(selectedSite && getUserId(selectedSite) && reportTitle.trim());

  const handleGenerate = async (event) => {
    event.preventDefault();
    if (!canGenerate) return;

    setGenerating(true);
    setError("");
    setGeneratedReport(null);
    try {
      const report = await apiRequest("/reports/generate", {
        method: "POST",
        body: JSON.stringify({
          siteId: getSiteId(selectedSite),
          userId: getUserId(selectedSite),
          reportTitle: reportTitle.trim(),
          notes: notes.trim(),
        }),
      });

      if (!report?.analysisId) {
        throw new Error(report?.message || "The backend did not return a report ID.");
      }
      setGeneratedReport(report);
    } catch (requestError) {
      setError(requestError.message || "Unable to generate the report.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Inspection reports</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Generate a PDF report</h1>
          <p className="mt-2 text-sm text-slate-600">Choose an existing site. The backend compiles its stored inspection data into a PDF.</p>
        </header>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          {error && (
            <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label htmlFor="report-site" className="mb-1 block text-sm font-semibold text-slate-700">Inspection site</label>
              <select
                id="report-site"
                value={siteId}
                onChange={(event) => {
                  setSiteId(event.target.value);
                  setGeneratedReport(null);
                }}
                disabled={loadingSites || sites.length === 0 || generating}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              >
                {loadingSites ? <option value="">Loading sites...</option> : null}
                {!loadingSites && sites.length === 0 ? <option value="">No sites available</option> : null}
                {sites.map((site) => (
                  <option key={getSiteId(site)} value={getSiteId(site)}>{getSiteLabel(site)}</option>
                ))}
              </select>
              {selectedSite && !getUserId(selectedSite) && (
                <p className="mt-2 text-sm text-amber-700">This site has no associated user ID, which the report API requires.</p>
              )}
            </div>

            <div>
              <label htmlFor="report-title" className="mb-1 block text-sm font-semibold text-slate-700">Report title</label>
              <input
                id="report-title"
                value={reportTitle}
                onChange={(event) => setReportTitle(event.target.value)}
                maxLength={255}
                required
                disabled={generating}
                placeholder="e.g. Building inspection report"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label htmlFor="report-notes" className="mb-1 block text-sm font-semibold text-slate-700">Notes <span className="font-normal text-slate-500">(optional)</span></label>
              <textarea
                id="report-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                disabled={generating}
                placeholder="Add context for this report"
                className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={!canGenerate || generating || loadingSites}
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating ? "Generating PDF..." : "Generate PDF report"}
            </button>
          </form>

          {generatedReport && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div>
                <p className="font-semibold text-emerald-900">Report generated</p>
                <p className="mt-1 text-sm text-emerald-800">{generatedReport.reportTitle || reportTitle} · {generatedReport.status || "Ready"}</p>
              </div>
              <a
                href={apiUrl(`/reports/${generatedReport.analysisId}/download`)}
                download
                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Download PDF
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}