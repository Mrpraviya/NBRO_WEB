 import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Officer <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Dashboard</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Manage hazard assessments and reports from a single interface
          </p>
        </div>

        {/* Stats/Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending Actions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">92%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1 - Create Report */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 group-hover:-translate-y-1">
              <div className="mb-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Create New Report
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Initiate a comprehensive hazard assessment with our guided reporting system
                </p>
              </div>
              <button
                onClick={() => navigate("/report")}
                className="group relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center space-x-3">
                  <span>Start New Report</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Card 2 - View Reports */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:border-purple-200 transition-all duration-300 group-hover:-translate-y-1">
              <div className="mb-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  View Reports
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Access and analyze all previously submitted hazard assessment reports
                </p>
              </div>
              <div className="relative">
                <button
                  className="w-full px-6 py-4 bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 font-semibold rounded-xl cursor-not-allowed transition-all duration-300"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>Coming Soon</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                </button>
                <div className="absolute -top-2 -right-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                    Q1 2024
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Profile */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 group-hover:-translate-y-1">
              <div className="mb-6">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Officer Profile
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Update your credentials, preferences, and manage account settings
                </p>
              </div>
              <div className="relative">
                <button
                  className="w-full px-6 py-4 bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 font-semibold rounded-xl cursor-not-allowed transition-all duration-300"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>Coming Soon</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                </button>
                <div className="absolute -top-2 -right-2">
                  <span className="px-3 py-1 bg-gradient-to-r from-gray-600 to-gray-800 text-white text-xs font-semibold rounded-full">
                    Q2 2024
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
              <p className="text-gray-600 mt-2">Your latest hazard assessment reports</p>
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-gray-100 to-white text-gray-700 font-semibold rounded-xl border border-gray-300 hover:border-gray-400 transition-all duration-300">
              View All
            </button>
          </div>
          <div className="space-y-6">
            {['Safety Audit - Warehouse B', 'Equipment Inspection - Floor 3', 'Fire Hazard Assessment'].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`h-10 w-10 rounded-full ${index === 0 ? 'bg-green-100 text-green-600' : index === 1 ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'} flex items-center justify-center`}>
                    {index === 0 ? '✓' : index === 1 ? '⚙' : '🔥'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item}</p>
                    <p className="text-sm text-gray-500">Completed {index + 2} days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{['High Priority', 'Medium', 'Low'][index]}</p>
                  <p className="text-sm text-gray-500">Priority</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}