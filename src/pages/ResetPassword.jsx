import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This password reset link is invalid or expired. Request a new one.");
      return;
    }
    if (!password) {
      setError("Enter a new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setStatus(result.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <img src="/images/logo.png" alt="NBRO logo" className="mx-auto mb-4 h-16" />
          <h2 className="text-2xl font-bold text-blue-700">Choose a New Password</h2>
        </div>

        {error && <p role="alert" className="mb-4 text-center text-sm text-red-600">{error}</p>}
        {status && <p role="status" className="mb-4 text-center text-sm text-green-700">{status}</p>}

        {!status && (
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password" className="mb-1 block font-semibold">New password:</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="confirm-password" className="mb-1 block font-semibold">Confirm new password:</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 py-2 text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Reset password"}
            </button>
          </form>
        )}

        <div className="mt-5 text-center text-sm text-slate-600">
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-800">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
