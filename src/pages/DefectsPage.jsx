const defects = [
  {
    defect_id: "3e0a6f5c-7b5c-4ea5-838a-dbd6d27b0c4a",
    notation: "CR-03",
    defect_category: "Crack",
    floor_level: "Ground floor",
    location_description: "Rear left wall",
    length_mm: 2100,
    width_mm: 120,
    remarks: "Vertical crack, moisture staining present",
    sync_status: "synced",
  },
  {
    defect_id: "f8b0d5d2-7e42-4d14-b653-75a1d086a56b",
    notation: "LE-11",
    defect_category: "Leakage",
    floor_level: "First floor",
    location_description: "Bathroom ceiling",
    length_mm: 850,
    width_mm: 600,
    remarks: "Active seepage during rainfall",
    sync_status: "pending",
  },
  {
    defect_id: "cc1c58a2-e872-41b9-9eef-a0b9d3e09f3d",
    notation: "SP-07",
    defect_category: "Settlement",
    floor_level: "Ground floor",
    location_description: "Front exterior porch",
    length_mm: 1800,
    width_mm: 240,
    remarks: "Edge settlement and displacement observed",
    sync_status: "syncing",
  },
];

export default function DefectsPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-600">Defect log</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Defects and condition tracking</h1>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total defects</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{defects.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Synced</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">{defects.filter((d) => d.sync_status === "synced").length}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Pending review</p>
            <p className="mt-3 text-3xl font-bold text-amber-600">{defects.filter((d) => d.sync_status === "pending").length}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">Active defect records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Notation</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Floor</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Size (mm)</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {defects.map((defect) => (
                  <tr key={defect.defect_id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{defect.notation}</td>
                    <td className="px-6 py-4">{defect.defect_category}</td>
                    <td className="px-6 py-4">{defect.floor_level}</td>
                    <td className="px-6 py-4">{defect.location_description}</td>
                    <td className="px-6 py-4">{defect.length_mm} × {defect.width_mm}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        defect.sync_status === "synced"
                          ? "bg-emerald-100 text-emerald-700"
                          : defect.sync_status === "syncing"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-700"
                      }`}>
                        {defect.sync_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{defect.remarks}</td>
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
