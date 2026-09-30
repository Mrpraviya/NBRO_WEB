const profiles = [
  {
    id: "a1013d0c-5b17-42da-a2e6-59d40595a9dc",
    full_name: "Nneka Ajayi",
    role: "admin",
    is_active: true,
    must_change_password: false,
    created_at: "2024-08-12T09:15:00Z",
  },
  {
    id: "7e82ac31-0ccf-4ae6-9557-d0dd4fe6f942",
    full_name: "Musa Ibrahim",
    role: "officer",
    is_active: true,
    must_change_password: true,
    created_at: "2024-11-02T10:00:00Z",
  },
  {
    id: "12a44d5a-5888-4920-a1af-6b0adad44efb",
    full_name: "Tina Oladipo",
    role: "officer",
    is_active: false,
    must_change_password: false,
    created_at: "2024-07-25T16:42:00Z",
  },
];

export default function ProfileManagement() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-violet-600">Access management</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Profiles</h1>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Admins</p>
            <p className="mt-3 text-3xl font-bold text-violet-700">{profiles.filter((p) => p.role === "admin").length}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Active officers</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">{profiles.filter((p) => p.is_active).length}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Password reset required</p>
            <p className="mt-3 text-3xl font-bold text-amber-600">{profiles.filter((p) => p.must_change_password).length}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-xl font-semibold text-slate-900">User profile directory</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Full name</th>
                  <th className="px-6 py-3 font-semibold">Role</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Password reset</th>
                  <th className="px-6 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id} className="border-t border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{profile.full_name}</td>
                    <td className="px-6 py-4 capitalize">{profile.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        profile.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                      }`}>
                        {profile.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        profile.must_change_password ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                      }`}>
                        {profile.must_change_password ? "Required" : "Not required"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(profile.created_at).toLocaleDateString()}</td>
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
