import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

const API_ENDPOINTS = [
  { key: "sites", label: "Sites", controller: "SiteController", loadRows: () => apiRequest("/sites") },
  { key: "profiles", label: "Profiles", controller: "ProfileController", loadRows: () => apiRequest("/profiles") },
  { key: "notices", label: "Notices", controller: "NoticeController", loadRows: () => apiRequest("/notices") },
  { key: "noticeRecipients", label: "Notice recipients", controller: "NoticeRecipientController", loadRows: () => apiRequest("/notice-recipients") },
  { key: "observations", label: "General observations", controller: "GeneralObservationController", loadRows: () => loadForEverySite("/observations/site") },
  { key: "externalServices", label: "External services", controller: "ExternalServicesController", loadRows: () => loadForEverySite("/external-services/site") },
  { key: "mainBuildings", label: "Main buildings", controller: "MainBuildingController", loadRows: () => loadForEverySite("/main-buildings/site") },
  { key: "ancillaryBuildings", label: "Ancillary buildings", controller: "AncillaryBuildingController", loadRows: () => loadForEverySite("/ancillary-buildings/site") },
  { key: "defects", label: "Defects", controller: "DefectController", loadRows: () => loadForEverySite("/defects/site") },
  { key: "defectInfo", label: "Defect information", controller: "DefectInfoController", loadRows: loadAllDefectInfo },
  { key: "defectImages", label: "Defect images", controller: "DefectImageController", loadRows: loadAllDefectImages },
  { key: "defectMedia", label: "Defect media", controller: "DefectMediaController", loadRows: () => apiRequest("/defect-media") },
  { key: "detailTypes", label: "Detail types", controller: "DetailTypeController", loadRows: () => loadForEveryBuilding("/detail-types/structure") },
  { key: "buildingDetails", label: "Building details", controller: "BuildingDetailController", loadRows: loadAllBuildingDetails },
  { key: "specifications", label: "Specifications", controller: "SpecificationController", loadRows: () => loadForEveryBuilding("/specifications/building") },
  { key: "reports", label: "Generated reports", controller: "ReportController", loadRows: () => loadForEverySite("/reports/site") },
];

function toRows(data) {
  if (Array.isArray(data)) return data;
  return data === null || data === undefined ? [] : [data];
}

async function loadAcross(records, getId, route) {
  const ids = [...new Set(records.map(getId).filter(Boolean).map(String))];
  const resultSets = await Promise.all(
    ids.map((id) => apiRequest(`${route}/${encodeURIComponent(id)}`).then(toRows)),
  );
  return resultSets.flat();
}

async function loadForEverySite(route) {
  const sites = toRows(await apiRequest("/sites"));
  return loadAcross(sites, (site) => site.siteId ?? site.site_id, route);
}

async function loadForEveryBuilding(route) {
  const sites = toRows(await apiRequest("/sites"));
  const [mainBuildings, ancillaryBuildings] = await Promise.all([
    loadAcross(sites, (site) => site.siteId ?? site.site_id, "/main-buildings/site"),
    loadAcross(sites, (site) => site.siteId ?? site.site_id, "/ancillary-buildings/site"),
  ]);
  const buildings = [...mainBuildings, ...ancillaryBuildings];
  return loadAcross(
    buildings,
    (building) => building.buildingId ?? building.building_id ?? building.structureId ?? building.structure_id,
    route,
  );
}

async function loadAllDefectInfo() {
  const defects = await loadForEverySite("/defects/site");
  return loadAcross(defects, (defect) => defect.defectId ?? defect.defect_id, "/defect-info/defect");
}

async function loadAllDefectImages() {
  const defectInfo = await loadAllDefectInfo();
  return loadAcross(defectInfo, (info) => info.infoId ?? info.info_id, "/defect-images/info");
}

async function loadAllBuildingDetails() {
  const detailTypes = await loadForEveryBuilding("/detail-types/structure");
  return loadAcross(detailTypes, (detail) => detail.detailTypeId ?? detail.detail_type_id, "/building-details/detail-type");
}

function displayValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function displayColumn(column) {
  return column.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

function getPreviewUrl(row, column) {
  const value = row?.[column];
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) return null;

  const field = column.toLowerCase();
  const mimeType = String(row?.mimeType ?? row?.mime_type ?? "").toLowerCase();
  const imageExtension = /\.(avif|bmp|gif|jpe?g|png|svg|webp)(?:[?#]|$)/i.test(value);
  const isImageUrlField = /(image|photo)url$/.test(field);
  const isImageStorageUrl = /storageurl$/.test(field) && (mimeType.startsWith("image/") || imageExtension);

  return isImageUrlField || isImageStorageUrl ? value : null;
}

export default function DatabaseTables() {
  const [activeKey, setActiveKey] = useState("sites");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [previewError, setPreviewError] = useState(false);

  const activeEndpoint = API_ENDPOINTS.find((endpoint) => endpoint.key === activeKey) || API_ENDPOINTS[0];
  const groupedEndpoints = useMemo(() => API_ENDPOINTS.reduce((groups, endpoint) => {
    groups[endpoint.controller] = [...(groups[endpoint.controller] || []), endpoint];
    return groups;
  }, {}), []);
  const columns = useMemo(
    () => [...new Set(rows.flatMap((row) => Object.keys(row || {})))],
    [rows],
  );

  useEffect(() => {
    let isCurrent = true;
    setRows([]);
    setError("");

    setLoading(true);
    activeEndpoint.loadRows()
      .then((data) => {
        if (isCurrent) setRows(toRows(data));
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Unable to load this endpoint.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeEndpoint, refreshKey]);

  useEffect(() => {
    if (!previewImage) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [previewImage]);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => Object.values(row || {}).some((value) => displayValue(value).toLowerCase().includes(query)));
  }, [rows, searchQuery]);

  const exportCsv = () => {
    if (!rows.length || !columns.length) return;
    const escapeCell = (value) => `"${displayValue(value).replace(/"/g, '""')}"`;
    const csv = [
      columns.map(escapeCell).join(","),
      ...rows.map((row) => columns.map((column) => escapeCell(row?.[column])).join(",")),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeKey}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link to="/dashboard" className="text-sm font-medium text-blue-700 hover:text-blue-900">Dashboard</Link>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Inspection tables</h1>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setRefreshKey((key) => key + 1)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Refresh
            </button>
            <button type="button" onClick={exportCsv} disabled={!rows.length} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50">
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="max-h-[calc(100vh-150px)] overflow-y-auto rounded-xl border border-slate-200 bg-white p-3">
            {Object.entries(groupedEndpoints).map(([controller, endpoints]) => (
              <section key={controller} className="mb-4 last:mb-0">
                <h2 className="px-2 py-2 text-xs font-bold uppercase text-slate-500">{controller.replace("Controller", "")}</h2>
                <div className="space-y-1">
                  {endpoints.map((endpoint) => (
                    <button
                      key={endpoint.key}
                      type="button"
                      onClick={() => {
                        setActiveKey(endpoint.key);
                        setSearchQuery("");
                      }}
                      className={`w-full rounded-md px-3 py-2 text-left text-sm ${activeKey === endpoint.key ? "bg-blue-50 font-semibold text-blue-800" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      {endpoint.label}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </aside>

          <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 p-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{activeEndpoint.label}</h2>
                <p className="mt-1 text-sm text-slate-500">Showing {filteredRows.length} of {rows.length} records</p>
              </div>
              <label className="w-full max-w-sm text-sm font-medium text-slate-700">
                Filter rows
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={`Search ${activeEndpoint.label.toLowerCase()}`}
                  className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            {error ? (
              <div role="alert" className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">Unable to load data: {error}</div>
            ) : loading ? (
              <p className="p-8 text-center text-sm text-slate-500">Loading records...</p>
            ) : rows.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">No records found.</p>
            ) : filteredRows.length === 0 ? (
              <p className="p-8 text-center text-sm text-slate-500">No rows match this filter.</p>
            ) : (
              <div className="max-h-[calc(100vh-280px)] overflow-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead className="sticky top-0 bg-slate-100 text-slate-700">
                    <tr>{columns.map((column) => <th key={column} className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-semibold">{displayColumn(column)}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, index) => (
                      <tr key={row.id ?? row.siteId ?? row.site_id ?? row.analysisId ?? index} className="align-top hover:bg-slate-50">
                        {columns.map((column) => (
                          <td key={column} className="max-w-md whitespace-pre-wrap break-words border-b border-slate-100 px-4 py-3 text-slate-700">
                            {getPreviewUrl(row, column) ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewError(false);
                                  setPreviewImage({
                                    url: getPreviewUrl(row, column),
                                    name: row.fileName ?? row.file_name ?? row.imagePath ?? row.image_path ?? displayColumn(column),
                                  });
                                }}
                                aria-label={`Preview ${row.fileName ?? row.file_name ?? "image"}`}
                                className="group inline-flex items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                              >
                                <img
                                  src={getPreviewUrl(row, column)}
                                  alt=""
                                  loading="lazy"
                                  className="h-14 w-20 rounded border border-slate-200 bg-slate-100 object-cover transition group-hover:opacity-80"
                                />
                                <span className="text-sm font-medium text-blue-700 group-hover:text-blue-900">Preview image</span>
                              </button>
                            ) : displayValue(row?.[column])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>

      {previewImage && (
        <div
          role="presentation"
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-[92vh] max-w-[92vw] flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
              <p className="max-w-[75vw] truncate text-sm font-medium text-slate-800">{previewImage.name}</p>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                aria-label="Close image preview"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xl text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                ×
              </button>
            </div>
            {previewError ? (
              <p role="alert" className="p-10 text-center text-sm text-slate-600">This image could not be loaded.</p>
            ) : (
              <img
                src={previewImage.url}
                alt={previewImage.name}
                onError={() => setPreviewError(true)}
                className="max-h-[calc(92vh-60px)] max-w-[92vw] object-contain"
              />
            )}
          </section>
        </div>
      )}
    </main>
  );
}