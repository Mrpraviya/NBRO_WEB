import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);

    try {
      const result = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      setStatus(result.message);
    } catch (requestError) {
      setError(requestError.message || "Unable to send a password reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="NBRO logo" className="mx-auto h-16 mb-4" />
          <h2 className="text-2xl font-bold text-blue-700">Reset Your Password</h2>
        </div>

        <p className="mb-6 text-sm text-slate-600">
          Enter the email address associated with your account. If it exists, we’ll send you a password reset link.
        </p>

        {error && <p role="alert" className="mb-4 text-center text-sm text-red-600">{error}</p>}
        {status && <p role="status" className="mb-4 text-center text-sm text-green-700">{status}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="recovery-email" className="mb-1 block font-semibold">Email:</label>
          <input
            id="recovery-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting || Boolean(status)}
            placeholder="Enter your email address"
            className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isSubmitting || Boolean(status)}
            className="w-full rounded-lg bg-blue-600 py-2 text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
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
