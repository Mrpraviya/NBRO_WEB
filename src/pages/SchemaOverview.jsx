const entityCards = [
  {
    name: "Sites",
    description: "Property and inspection site records",
    route: "/sites",
  },
  {
    name: "Profiles",
    description: "Officer and admin user profiles",
    route: "/profiles",
  },
  {
    name: "Notices",
    description: "Circulars, alerts, and recipients",
    route: "/notices",
  },
  {
    name: "Defects",
    description: "Defect records, measurements, and images",
    route: "/defects",
  },
  {
    name: "Inspection",
    description: "Building observations and specifications",
    route: "/inspection",
  },
];

const schemaTable = [
  { table: "profile", purpose: "User and role metadata" },
  { table: "site", purpose: "Location and site lifecycle data" },
  { table: "general_observation", purpose: "Observed property conditions" },
  { table: "external_services", purpose: "Utilities and service checks" },
  { table: "main_building", purpose: "Main structure summary" },
  { table: "ancillary_building", purpose: "Secondary structures" },
  { table: "defects", purpose: "Issue inventory and measurements" },
  { table: "defect_info", purpose: "Defect detail and dimensions" },
  { table: "notices", purpose: "Operational announcements" },
  { table: "notice_recipients", purpose: "Readers and acknowledgment tracking" },
];

export default function SchemaOverview() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-sky-700 to-blue-900 p-8 text-white shadow-xl">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-sky-100">NBRO schema model</p>
          <h1 className="text-3xl font-bold md:text-4xl">Inspection data hub</h1>
          <p className="mt-3 max-w-3xl text-sm text-sky-100 md:text-base">
            This workspace now includes the main operational views used by the inspection system. Each module reflects the core entities from the ER schema and is designed to support site administration, defect tracking, notice delivery, and inspection records.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {entityCards.map((item) => (
            <a
              key={item.name}
              href={item.route}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex rounded-xl bg-sky-100 px-3 py-2 text-sm font-semibold text-sky-700">
                {item.name}
              </div>
              <p className="text-sm text-slate-600">{item.description}</p>
              <div className="mt-5 text-sm font-semibold text-blue-700">
                Open module →
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">Schema tables</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Table</th>
                  <th className="px-6 py-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                {schemaTable.map((row) => (
                  <tr key={row.table} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{row.table}</td>
                    <td className="px-6 py-3">{row.purpose}</td>
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
