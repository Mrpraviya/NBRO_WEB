const buildingRecords = [
  {
    building_id: "91f0a96b-3f36-4bf1-8dcb-6ac21d86efed",
    site_ref: "NBRO-001",
    no_floors: "3 floors",
    sync_status: "synced",
    element_type: "Beam",
    is_used: true,
    floor_details: { "Ground floor": "Concrete frame", "First floor": "Reinforced slab" },
  },
  {
    building_id: "2bd90ab3-305f-44ae-b6cc-4677677132db",
    site_ref: "NBRO-025",
    no_floors: "2 floors",
    sync_status: "pending",
    element_type: "Column",
    is_used: true,
    floor_details: { "Ground floor": "Load-bearing support", "Top floor": "Roof access" },
  },
  {
    building_id: "812d44d9-f7d0-4b9b-bd15-96d7f3d484b0",
    site_ref: "NBRO-047",
    no_floors: "1 floor",
    sync_status: "syncing",
    element_type: "Wall",
    is_used: false,
    floor_details: { "Ground floor": "Under review" },
  },
];

export default function InspectionRecordsPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-600">Inspection records</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Buildings, observations, and specification data</h1>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">Main building and specification summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Site ref</th>
                  <th className="px-6 py-3 font-semibold">Floors</th>
                  <th className="px-6 py-3 font-semibold">Element</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Used</th>
                  <th className="px-6 py-3 font-semibold">Floor details</th>
                </tr>
              </thead>
              <tbody>
                {buildingRecords.map((record) => (
                  <tr key={record.building_id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{record.site_ref}</td>
                    <td className="px-6 py-4">{record.no_floors}</td>
                    <td className="px-6 py-4">{record.element_type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        record.sync_status === "synced"
                          ? "bg-emerald-100 text-emerald-700"
                          : record.sync_status === "syncing"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-700"
                      }`}>
                        {record.sync_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{record.is_used ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {Object.entries(record.floor_details).map(([floor, detail]) => (
                        <div key={floor} className="mb-1 last:mb-0">
                          <span className="font-medium text-slate-700">{floor}:</span> {detail}
                        </div>
                      ))}
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
