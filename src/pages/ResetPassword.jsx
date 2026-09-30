import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getUsers,
  getPasswordResetRequest,
  isValidEmail,
  normalizeEmail,
  resetPassword,
} from "../utils/auth";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const request = getPasswordResetRequest();
  const initialEmail = location.state?.email || request?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address");
      setSuccess("");
      return;
    }

    if (!newPassword || newPassword.trim().length < 6) {
      setError("Password must be at least 6 characters");
      setSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    const result = await resetPassword(getUsers(), normalizedEmail, newPassword);

    if (!result.ok) {
      setError(result.message);
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Your password has been updated successfully. Redirecting to login...");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("currentUser");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="NBRO logo" className="mx-auto h-16 mb-4" />
          <h2 className="text-2xl font-bold text-blue-700">Create New Password</h2>
        </div>

        {error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {success && <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-700">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="mb-1 block text-sm font-semibold text-slate-700">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label htmlFor="new-password" className="mb-1 block text-sm font-semibold text-slate-700">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter a new password"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="mb-1 block text-sm font-semibold text-slate-700">
              Confirm password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Update password
          </button>
        </form>

        <div className="mt-5 text-center text-sm text-slate-600">
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-800">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
