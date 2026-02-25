import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReportWizard from "./pages/report/ReportWizard";
import ReportsList from "./pages/ReportsList";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import ReportForm from "./pages/ReportForm";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ReportWizard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ReportsList />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
