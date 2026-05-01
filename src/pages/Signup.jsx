import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    navigate("/");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('public/images/im1.jpg')" }}
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
          src="/public/Images/logo.png"
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
        <div className="mb-3 text-left">
          <label htmlFor="name" className="block mb-1 font-semibold">
            Full Name:
          </label>

        <input
          placeholder="Enter your Full Name here..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        </div>

        <div className="mb-3 text-left">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email:
          </label>

        <input
          placeholder="Enter your Email here..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <div className="mb-4 text-left">
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password:
          </label>

        <input
          type="password"
          placeholder="Enter your Password here..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        </div>

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Create Account
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/" className="text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
