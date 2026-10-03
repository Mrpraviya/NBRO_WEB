import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail, normalizeEmail } from "../utils/auth";
import { apiRequest } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setOtp("");
    setShowPassword(false);
    setError("");
    setStatus("");
    setAwaitingOtp(false);
  }, []);

  const handleLogin = async () => {
    const trimmedEmail = normalizeEmail(email);

    if (!trimmedEmail || (!awaitingOtp && !password) || (awaitingOtp && !otp.trim())) {
      setError(awaitingOtp ? "Enter the verification code sent to your email" : "All fields are required");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      if (!awaitingOtp) {
        const result = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email: trimmedEmail, password }),
        });
        setAwaitingOtp(true);
        setStatus(typeof result === "string" ? result : "A verification code was sent to your email.");
        return;
      }

      await apiRequest("/auth/login/verify", {
        method: "POST",
        body: JSON.stringify({ email: trimmedEmail, otp: otp.trim() }),
      });

      localStorage.setItem("isAuth", "true");
      localStorage.setItem("currentUser", JSON.stringify({ email: trimmedEmail }));
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in. Please try again.");
      if (!awaitingOtp) setPassword("");
    } finally {
      setIsSubmitting(false);
    }
  };
  const backgrounds = [
    "/images/im1.jpg",
    "/images/im3.jpg",
    "/images/im4.jpg",
  ];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, [ backgrounds.length ]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center transition-all duration-1000"
      style={{ backgroundImage: `url(${backgrounds[bgIndex]})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>

      {/* Login Card */}
      <div
        className="bg-white z-8 p-4 rounded w-150 border loginForm"
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
          Welcome To NBRO
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">{error}</p>
        )}
        {status && (
          <p className="text-green-700 text-sm mb-3 text-center">{status}</p>
        )}
        <div className="mb-3 text-left">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email:
          </label>
          <input
            type="email"
            autoComplete="username"
            name="email"
            placeholder="Enter your Email here..."
            disabled={awaitingOtp || isSubmitting}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
        </div>

        {!awaitingOtp && <div className="mb-3 text-left">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              name="password"
              placeholder="Enter your Password here..."
              className="w-full px-4 py-2 pr-11 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>}

        {awaitingOtp && (
          <div className="mb-3 text-left">
            <label htmlFor="login-otp" className="block mb-1 font-semibold">
              Email verification code:
            </label>
            <input
              id="login-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="Enter the 6-digit code"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>
        )}

        <div className="mb-2">
          <input type="checkbox" name="tick" id="tick" className="me-2" />
          <label htmlFor="password">
            {" "}
            Your are Agree with terms & conditions{" "}
          </label>
        </div>

        <div className="mb-4 flex items-center justify-end">
          <button
            type="button"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Please wait..." : awaitingOtp ? "Verify code" : "Login"}
        </button>

      </div>
    </div>
  );
}
