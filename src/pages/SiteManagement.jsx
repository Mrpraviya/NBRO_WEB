import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function SiteManagement() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    apiRequest("/sites")
      .then((data) => {
        if (!isCurrent) return;
        const records = Array.isArray(data) ? data : [];
        setSites(records.map((site) => ({
          ...site,
          siteId: site.siteId ?? site.site_id,
          ownerName: site.ownerName ?? site.owner_name,
          buildingRef: site.buildingRef ?? site.building_ref,
          syncStatus: site.syncStatus ?? site.sync_status ?? "unknown",
          sectionsStatus: site.sectionsStatus ?? site.sections_status ?? {},
        })));
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Unable to load sites.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const syncedSites = sites.filter((site) => site.syncStatus === "synced").length;
  const pendingSites = sites.filter((site) => site.syncStatus === "pending").length;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">Site records</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Site management</h1>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total sites</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{sites.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Synced</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">{syncedSites}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Pending</p>
            <p className="mt-3 text-3xl font-bold text-amber-600">{pendingSites}</p>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Unable to load sites: {error}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">Inspection sites</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Owner</th>
                  <th className="px-6 py-3 font-semibold">Reference</th>
                  <th className="px-6 py-3 font-semibold">Address</th>
                  <th className="px-6 py-3 font-semibold">Coordinates</th>
                  <th className="px-6 py-3 font-semibold">Sync status</th>
                  <th className="px-6 py-3 font-semibold">Sections</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading sites...</td></tr>
                ) : sites.length === 0 ? (
                  <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No sites found.</td></tr>
                ) : sites.map((site) => (
                  <tr key={site.siteId} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{site.ownerName || "—"}</td>
                    <td className="px-6 py-4">{site.buildingRef || "—"}</td>
                    <td className="px-6 py-4">{site.address || "—"}</td>
                    <td className="px-6 py-4">{site.latitude ?? "—"}, {site.longitude ?? "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        site.syncStatus === "synced"
                          ? "bg-emerald-100 text-emerald-700"
                          : site.syncStatus === "syncing"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-700"
                      }`}>
                        {site.syncStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(site.sectionsStatus).map(([key, value]) => (
                          <span
                            key={key}
                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                              value ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
