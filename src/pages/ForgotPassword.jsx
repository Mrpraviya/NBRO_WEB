import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUsers,
  isValidEmail,
  normalizeEmail,
  requestPasswordReset,
} from "../utils/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      setError("Please enter your email address");
      setSuccess("");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address");
      setSuccess("");
      return;
    }

    const result = requestPasswordReset(getUsers(), normalizedEmail);

    if (!result.ok) {
      setError(result.message);
      setSuccess("");
      return;
    }

    setError("");
    setSuccess(`${result.message} Continue to create a new password.`);
    setTimeout(() => {
      navigate("/reset-password", {
        state: { email: result.email, token: result.token },
      });
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="NBRO logo" className="mx-auto h-16 mb-4" />
          <h2 className="text-2xl font-bold text-blue-700">Reset Your Password</h2>
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
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Send reset link
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
