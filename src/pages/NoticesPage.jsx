import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    apiRequest("/notices")
      .then((data) => {
        if (!isCurrent) return;
        const records = Array.isArray(data) ? data : [];
        setNotices(records.map((notice) => ({
          ...notice,
          targetType: notice.targetType ?? notice.target_type,
          publishedByName: notice.publishedByName ?? notice.published_by_name,
          publishedAt: notice.publishedAt ?? notice.published_at,
        })));
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Unable to load notices.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-rose-600">Notice center</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Notices and communications</h1>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Unable to load notices: {error}
          </div>
        )}

        <div className="space-y-5">
          {loading ? (
            <p className="py-10 text-center text-slate-500">Loading notices...</p>
          ) : notices.length === 0 ? (
            <p className="py-10 text-center text-slate-500">No notices found.</p>
          ) : notices.map((notice) => (
            <article key={notice.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{notice.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">Published by {notice.publishedByName || "Unknown"}</p>
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
                    {notice.targetType || "all"}
                  </span>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600">{notice.message}</p>

              <div className="mt-5 text-xs text-slate-500">
                Published: {notice.publishedAt && !Number.isNaN(Date.parse(notice.publishedAt))
                  ? new Date(notice.publishedAt).toLocaleString()
                  : "Not published"}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
