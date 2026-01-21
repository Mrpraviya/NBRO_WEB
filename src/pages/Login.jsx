import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    localStorage.setItem("isAuth", "true");
    navigate("/dashboard");
  };
  const backgrounds = [
    "public/images/im1.jpg",
    "public/images/im3.jpg",
    "public/images/im4.jpg",
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
          src="/public/Images/logo.png"
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
        <div className="mb-3 text-left">
          <label htmlFor="email" className="block mb-1 font-semibold">
            Email:
          </label>
          <input
            type="email"
            autoComplete="off"
            placeholder="Enter your Email here..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3 text-left">
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

        <div className="mb-2">
          <input type="checkbox" name="tick" id="tick" className="me-2" />
          <label htmlFor="password">
            {" "}
            Your are Agree with terms & conditions{" "}
          </label>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Do not have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
