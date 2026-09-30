import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Sites", path: "/sites" },
  { label: "Profiles", path: "/profiles" },
  { label: "Notices", path: "/notices" },
  { label: "Defects", path: "/defects" },
  { label: "Inspection", path: "/inspection" },
];

const LogoutIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Deepen the header once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("isAuth");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    [
      "relative inline-flex h-full items-center px-4 text-sm font-medium tracking-wide",
      "transition-colors duration-200 motion-reduce:transition-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/60 focus-visible:ring-inset rounded-md",
      isActive ? "text-white" : "text-slate-400 hover:text-slate-100",
    ].join(" ");

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 motion-reduce:transition-none ${
        scrolled
          ? "border-white/10 bg-[#080d19]/90 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          : "border-white/5 bg-[#080d19] backdrop-blur-xl"
      }`}
    >
      {/* Brass hairline along the very top edge */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-amber-200/50 to-transparent"
      />

      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <NavLink
          to="/dashboard"
          className="flex shrink-0 items-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/60"
          aria-label="NBRO home"
        >
          <div className="flex items-center justify-center rounded-xl bg-white px-4 py-2 shadow-[0_4px_18px_rgba(0,0,0,0.35)] ring-1 ring-white/20">
            <img
              src="/images/logo.png"
              alt="NBRO Logo"
              className="h-10 w-auto max-w-[200px] object-contain sm:h-11 sm:max-w-[260px] lg:max-w-[300px]"
            />
          </div>
        </NavLink>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden h-full items-stretch lg:flex"
        >
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={linkClass}>
              {({ isActive }) => (
                <>
                  <span>{item.label}</span>
                  {/* Active indicator sits on the header's bottom border */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-4 -bottom-px h-[2px] rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 transition-all duration-300 motion-reduce:transition-none ${
                      isActive
                        ? "opacity-100 shadow-[0_0_12px_rgba(252,211,77,0.55)]"
                        : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="group hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60 motion-reduce:transition-none lg:inline-flex"
          >
            <LogoutIcon />
            <span>Log out</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-200 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/60 lg:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          menuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Mobile"
            className="mx-auto max-w-[1600px] border-t border-white/5 px-4 pb-4 pt-2 sm:px-6"
          >
            <ul className="divide-y divide-white/5">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    tabIndex={menuOpen ? 0 : -1}
                    className={({ isActive }) =>
                      `flex items-center justify-between py-3.5 text-base font-medium transition-colors focus:outline-none focus-visible:text-white ${
                        isActive
                          ? "text-amber-200"
                          : "text-slate-300 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{item.label}</span>
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.8)]"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            <button
              onClick={logout}
              tabIndex={menuOpen ? 0 : -1}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-sm font-medium text-slate-200 transition-colors hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/60"
            >
              <LogoutIcon />
              <span>Log out</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
