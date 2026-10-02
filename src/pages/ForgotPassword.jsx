import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <img src="/images/logo.png" alt="NBRO logo" className="mx-auto h-16 mb-4" />
          <h2 className="text-2xl font-bold text-blue-700">Reset Your Password</h2>
        </div>

        <p className="mb-6 rounded bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Password recovery is not available on the connected authentication service. Please contact your system administrator.
        </p>

        <div className="mt-5 text-center text-sm text-slate-600">
          <Link to="/" className="font-medium text-blue-600 hover:text-blue-800">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
