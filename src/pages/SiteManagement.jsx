const sites = [
  {
    site_id: "f5c7d8bb-6e1a-4d5b-8fa2-37c9a3a6d01e",
    owner_name: "Amina Yusuf",
    address: "12 Harbour Road, Lagos",
    building_ref: "NBRO-001",
    latitude: 6.5244,
    longitude: 3.3792,
    sync_status: "synced",
    sections_status: {
      general_observation: true,
      external_services: true,
      main_building: true,
      ancillary_building: false,
      defects: true,
    },
  },
  {
    site_id: "85d7203d-8d8d-4cb2-9f45-c1f4434b4eb0",
    owner_name: "John Okafor",
    address: "88 River Avenue, Abuja",
    building_ref: "NBRO-025",
    latitude: 9.0765,
    longitude: 7.3986,
    sync_status: "syncing",
    sections_status: {
      general_observation: true,
      external_services: false,
      main_building: true,
      ancillary_building: true,
      defects: false,
    },
  },
  {
    site_id: "2f32e118-5e93-441d-a756-0d4f3f880f14",
    owner_name: "Grace Bello",
    address: "14 Green Valley, Kaduna",
    building_ref: "NBRO-047",
    latitude: 10.5222,
    longitude: 7.4383,
    sync_status: "pending",
    sections_status: {
      general_observation: false,
      external_services: false,
      main_building: false,
      ancillary_building: false,
      defects: false,
    },
  },
];

export default function SiteManagement() {
  const syncedSites = sites.filter((site) => site.sync_status === "synced").length;
  const pendingSites = sites.filter((site) => site.sync_status === "pending").length;

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
                {sites.map((site) => (
                  <tr key={site.site_id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{site.owner_name}</td>
                    <td className="px-6 py-4">{site.building_ref}</td>
                    <td className="px-6 py-4">{site.address}</td>
                    <td className="px-6 py-4">{site.latitude}, {site.longitude}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        site.sync_status === "synced"
                          ? "bg-emerald-100 text-emerald-700"
                          : site.sync_status === "syncing"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-200 text-slate-700"
                      }`}>
                        {site.sync_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(site.sections_status).map(([key, value]) => (
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
