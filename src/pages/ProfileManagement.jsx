import { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export default function ProfileManagement() {
  const [profiles, setProfiles] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    apiRequest("/profiles")
      .then((data) => {
        if (!isCurrent) return;
        const records = Array.isArray(data) ? data : [];
        setProfiles(records);
        setSelectedId(records[0]?.id || "");
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Unable to load profiles.");
      })
      .finally(() => {
        if (isCurrent) setLoadingProfiles(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setSelectedProfile(null);
      return undefined;
    }

    let isCurrent = true;
    setLoadingDetails(true);
    apiRequest(`/profiles/${encodeURIComponent(selectedId)}`)
      .then((profile) => {
        if (isCurrent) setSelectedProfile(profile);
      })
      .catch((requestError) => {
        if (isCurrent) setError(requestError.message || "Unable to load profile details.");
      })
      .finally(() => {
        if (isCurrent) setLoadingDetails(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedId]);

  const admins = profiles.filter((profile) => profile.role === "admin").length;
  const activeProfiles = profiles.filter((profile) => profile.isActive).length;
  const passwordResetProfiles = profiles.filter((profile) => profile.mustChangePassword).length;
  const formatFlag = (value) => value === true ? "Yes" : value === false ? "No" : "Not set";

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
            <p className="mt-3 text-3xl font-bold text-violet-700">{admins}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Active officers</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">{activeProfiles}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Password reset required</p>
            <p className="mt-3 text-3xl font-bold text-amber-600">{passwordResetProfiles}</p>
          </div>
        </div>

        {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <h2 className="text-lg font-semibold text-slate-900">User profile directory</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-slate-800">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Full name</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Created</th>
                    <th className="px-5 py-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingProfiles ? (
                    <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-500">Loading profiles...</td></tr>
                  ) : profiles.length === 0 ? (
                    <tr><td colSpan="5" className="px-5 py-10 text-center text-slate-500">No profiles found.</td></tr>
                  ) : profiles.map((profile) => (
                    <tr key={profile.id} className={`border-t border-slate-200 ${profile.id === selectedId ? "bg-blue-50/70" : "hover:bg-slate-50"}`}>
                      <td className="px-5 py-4 font-medium text-slate-900">{profile.fullName || "—"}</td>
                      <td className="px-5 py-4 capitalize">{profile.role || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${profile.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                          {profile.isActive === true ? "Active" : profile.isActive === false ? "Inactive" : "Not set"}
                        </span>
                      </td>
                      <td className="px-5 py-4">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => { setError(""); setSelectedId(profile.id); }} className="font-semibold text-blue-700 hover:text-blue-900">
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
            {loadingDetails ? (
              <p className="mt-5 text-sm text-slate-500">Loading profile details...</p>
            ) : selectedProfile ? (
              <dl className="mt-5 space-y-4 text-sm">
                {selectedProfile.avatarUrl && <img src={selectedProfile.avatarUrl} alt="" className="h-16 w-16 rounded-full border border-slate-200 object-cover" />}
                <div><dt className="text-slate-500">Full name</dt><dd className="mt-1 font-medium text-slate-900">{selectedProfile.fullName || "—"}</dd></div>
                <div><dt className="text-slate-500">Role</dt><dd className="mt-1 font-medium capitalize text-slate-900">{selectedProfile.role || "—"}</dd></div>
                <div><dt className="text-slate-500">Account status</dt><dd className="mt-1 font-medium text-slate-900">{selectedProfile.isActive === true ? "Active" : selectedProfile.isActive === false ? "Inactive" : "Not set"}</dd></div>
                <div><dt className="text-slate-500">Password change required</dt><dd className="mt-1 font-medium text-slate-900">{formatFlag(selectedProfile.mustChangePassword)}</dd></div>
                <div><dt className="text-slate-500">Position</dt><dd className="mt-1 font-medium text-slate-900">{selectedProfile.positionTitle || "—"}</dd></div>
                <div><dt className="text-slate-500">Employee ID</dt><dd className="mt-1 font-medium text-slate-900">{selectedProfile.employeeId || "—"}</dd></div>
                <div><dt className="text-slate-500">Work role</dt><dd className="mt-1 font-medium text-slate-900">{selectedProfile.workRole || "—"}</dd></div>
                <div><dt className="text-slate-500">Phone</dt><dd className="mt-1 font-medium text-slate-900">{selectedProfile.phoneNumber || "—"}</dd></div>
                <div><dt className="text-slate-500">Created</dt><dd className="mt-1 font-medium text-slate-900">{selectedProfile.createdAt ? new Date(selectedProfile.createdAt).toLocaleString() : "—"}</dd></div>
                <div><dt className="text-slate-500">Profile ID</dt><dd className="mt-1 break-all font-mono text-xs text-slate-700">{selectedProfile.id}</dd></div>
              </dl>
            ) : (
              <p className="mt-5 text-sm text-slate-500">Select a profile to view its details.</p>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
