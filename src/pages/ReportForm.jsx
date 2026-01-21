export default function ReportForm() {
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow mt-6">

      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Hazard Assessment Report
      </h2>

      {/* Section 1 */}
      <section className="mb-6">
        <h3 className="font-semibold text-lg mb-2">
          1. General Information
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <input className="border p-2" placeholder="Applicant Name" />
          <input className="border p-2" type="date" />
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-6">
        <h3 className="font-semibold text-lg mb-2">
          2. Location Details
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <input className="border p-2" placeholder="District" />
          <input className="border p-2" placeholder="DS Division" />
          <input className="border p-2" placeholder="GN Division" />
        </div>
      </section>

      <button className="bg-blue-700 text-white px-6 py-2 rounded">
        Submit Report
      </button>
    </div>
  );
}
