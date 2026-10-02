import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || (!verificationPending && !password) || (verificationPending && !otp.trim())) {
      setError(verificationPending ? "Enter the verification code sent to your email" : "All fields are required");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");
    try {
      if (!verificationPending) {
        const result = await apiRequest("/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email: trimmedEmail, password }),
        });
        setVerificationPending(true);
        setSuccess(typeof result === "string" ? result : "A verification code was sent to your email.");
        return;
      }

      const result = await apiRequest("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ email: trimmedEmail, otp: otp.trim() }),
      });
      setVerificationPending(false);
      setVerificationComplete(true);
      setSuccess(typeof result === "string" ? result : "Your account has been verified.");
    } catch (requestError) {
      setError(requestError.message || "Unable to create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/im1.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
      <div
        className="bg-white z-10 p-4 rounded w-150 border loginForm text-center"
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <img
          src="/images/logo.png"
          className="mt-2 logo"
          alt="S&P Logo"
          style={{ marginBottom: "20px" }}
        />
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          NBRO Sign Up
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-700 text-sm mb-3 text-center">{success}</p>
        )}

        {!verificationComplete && <>
        <div className="mb-3 text-left">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email:
          </label>

        <input
          type="email"
          autoComplete="email"
          placeholder="Enter your Email here..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          value={email}
          disabled={verificationPending || isSubmitting}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        {!verificationPending && <div className="mb-4 text-left">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password:
          </label>

        <input
          type="password"
            autoComplete="new-password"
          placeholder="Enter your Password here..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>}

        {verificationPending && <div className="mb-4 text-left">
          <label htmlFor="signup-otp" className="block mb-1 font-semibold">
            Email verification code:
          </label>
          <input
            id="signup-otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="Enter the 6-digit code"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            disabled={isSubmitting}
          />
        </div>}

        <button
          type="button"
          onClick={handleSignup}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Please wait..." : verificationPending ? "Verify email" : "Create Account"}
        </button>
        </>}

        <p className="text-center mt-4 text-sm">
          {verificationComplete ? "Account verified. " : "Already have an account? "}
          <Link to="/" className="text-blue-600">
            {verificationComplete ? "Sign in" : "Login"}
          </Link>
        </p>
      </div>
    </div>
  );
}
