import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isAuth");
    navigate("/");
  };

  return (
    <header className="bg-linear-to-r from-gray-900 to-gray-800 shadow-xl border-b border-gray-700">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-400 rounded-xl blur opacity-30"></div>
              <img
                src="/public/Images/logo.png"
                className="relative w-auto h-18 rounded-xl"
                alt="NBRO Logo"
              />
            </div>
            
          </div>

          {/* Navigation / User / Logout Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden md:inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-100 transition-colors hover:bg-gray-700"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Dashboard
            </button>

            <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-3 text-gray-300">
              <div className="h-8 w-8 rounded-full bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
                <span className="font-semibold text-white">U</span>
              </div>
              <div>
                <p className="text-sm font-medium">Welcome Back</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <div className="h-6 w-px bg-gray-600"></div>
            </div>

            <button
              onClick={logout}
              className="group relative px-5 py-2.5 bg-linear-to-r from-red-600 to-red-500 rounded-lg overflow-hidden transition-all duration-300 hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center space-x-2">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="font-semibold text-white cursor-pointer">Logout</span>
              </div>
            </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}