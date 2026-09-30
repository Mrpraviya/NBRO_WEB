const notices = [
  {
    id: "d3f2f3d8-0e2a-42c8-b38d-c9c13f130a60",
    title: "Quarterly inspection review",
    priority: "high",
    target_type: "all",
    published_by_name: "Nneka Ajayi",
    published_at: "2024-11-15T08:30:00Z",
    message: "All inspection officers are required to submit the Q4 review package before Friday."
  },
  {
    id: "0e8c9995-cc58-46d2-9c48-e0327d0decb8",
    title: "New defect photo protocol",
    priority: "normal",
    target_type: "selected",
    published_by_name: "Musa Ibrahim",
    published_at: "2024-11-18T12:15:00Z",
    message: "Use the updated photo metadata template when uploading defect images for remote assessments."
  },
  {
    id: "67d8b356-2876-4721-bca0-8f8b7d190c74",
    title: "Emergency safety advisory",
    priority: "urgent",
    target_type: "all",
    published_by_name: "System automation",
    published_at: "2024-11-20T05:45:00Z",
    message: "Any structure with active water ingress must be isolated and re-evaluated before reassignment."
  },
];

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-600">Notice center</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Notices and communications</h1>
        </div>

        <div className="space-y-5">
          {notices.map((notice) => (
            <article key={notice.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{notice.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">Published by {notice.published_by_name}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    notice.priority === "urgent"
                      ? "bg-rose-100 text-rose-700"
                      : notice.priority === "high"
                        ? "bg-amber-100 text-amber-700"
                        : notice.priority === "normal"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-slate-200 text-slate-700"
                  }`}>
                    {notice.priority}
                  </span>
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {notice.target_type}
                  </span>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600">{notice.message}</p>

              <div className="mt-5 text-xs text-slate-500">
                Published: {new Date(notice.published_at).toLocaleString()}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
