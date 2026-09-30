import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReportWizard from "./pages/report/ReportWizard";
import ReportsList from "./pages/ReportsList";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
// import ReportForm from "./pages/ReportForm";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import SiteManagement from "./pages/SiteManagement";
import ProfileManagement from "./pages/ProfileManagement";
import NoticesPage from "./pages/NoticesPage";
import DefectsPage from "./pages/DefectsPage";
import InspectionRecordsPage from "./pages/InspectionRecordsPage";
import { SiteCrudPage, ProfileCrudPage, NoticeCrudPage, DefectCrudPage, InspectionCrudPage } from "./pages/CrudWrappers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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
          path="/report/edit/:id"
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
          path="/sites"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <SiteCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sites/new"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <SiteCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sites/:id/edit"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <SiteCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ProfileCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/new"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ProfileCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profiles/:id/edit"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <ProfileCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <NoticeCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices/new"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <NoticeCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices/:id/edit"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <NoticeCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/defects"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <DefectCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/defects/new"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <DefectCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/defects/:id/edit"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <DefectCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspection"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <InspectionCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspection/new"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <InspectionCrudPage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inspection/:id/edit"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <InspectionCrudPage />
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
