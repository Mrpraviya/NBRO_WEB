import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { z } from "zod";

const backendPort = import.meta.env.VITE_BACKEND_PORT || '4000';
const API_KEY = import.meta.env.VITE_API_KEY || null;
/* ================= STORAGE ================= */
let _lf = null;
async function getStorage() {
  if (_lf) return _lf;
  try {
    const mod = await import("localforage");
    _lf = mod.default || mod;
    return _lf;
  } catch {
    return {
      async getItem(key) {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : null;
      },
      async setItem(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
      },
      async removeItem(key) {
        localStorage.removeItem(key);
      },
    };
  }
}

/* ================= STEPS ================= */
import Step1General from "./Step1General";
import Step2Location from "./Step2Location";
import Step3Observations from "./Step3Observations";
import Step4Risk from "./Step4Risk";
import Step5Recommendations from "./Step5Recommendations";
import Step6Review from "./Step6Review";

export default function ReportWizard() {
  const { id: editId } = useParams();
  const isEditing = !!editId;
  const [step, setStep] = useState(1);
  const DRAFT_KEY = "reportWizardDraft";
  const saveTimeout = useRef(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [loading, setLoading] = useState(isEditing);

  const [reportData, setReportData] = useState({
    applicantName: "",
    inspectionDate: "",
    district: "",
    dsDivision: "",
    gnDivision: "",
    observations: "",
    riskLevel: "",
    recommendation: "",
    attachments: [],
  });

  const [errors, setErrors] = useState([]);

  // Load report data if editing
  useEffect(() => {
    if (isEditing) {
      fetchReportToEdit();
    } else {
      loadDraft();
    }
  }, []);

  async function fetchReportToEdit() {
    try {
      const res = await fetch(`http://localhost:${backendPort}/api/reports`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      const reports = await res.json();
      const report = reports.find((r) => r.id === Number(editId));
      if (report) {
        setReportData(report);
      } else {
        setErrors(["Report not found"]);
      }
    } catch (e) {
      setErrors(["Failed to load report: " + e.message]);
    } finally {
      setLoading(false);
    }
  }

  async function loadDraft() {
    try {
      const storage = await getStorage();
      const draft = await storage.getItem(DRAFT_KEY);
      if (draft) {
        setReportData(draft);
        setHasDraft(true);
      }
    } catch (e) {
      console.warn("Failed to load draft", e);
    }
  }

  /* ================= VALIDATION ================= */
  const stepSchemas = {
    1: z.object({
      applicantName: z.string().min(1, "Applicant name is required"),
      inspectionDate: z.string().min(1, "Inspection date is required"),
    }),
    2: z.object({
      district: z.string().min(1, "District is required"),
      dsDivision: z.string().min(1, "DS Division is required"),
      gnDivision: z.string().min(1, "GN Division is required"),
    }),
    3: z.object({
      observations: z.string().min(10, "Minimum 10 characters required"),
    }),
    4: z.object({
      riskLevel: z.string().min(1, "Risk level is required"),
    }),
    5: z.object({
      recommendation: z.string().optional(),
    }),
  };

  const fullSchema = z
    .object({
      applicantName: z.string().min(1),
      inspectionDate: z.string().min(1),
      district: z.string().min(1),
      dsDivision: z.string().min(1),
      gnDivision: z.string().min(1),
      observations: z.string().min(10),
      riskLevel: z.string().min(1),
      recommendation: z.string().optional(),
    })
    .superRefine((val, ctx) => {
      if (val.riskLevel === "High" && (!val.recommendation || val.recommendation.length < 5)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Recommendation required for High risk (min 5 chars)",
        });
      }
    });

  const validateStep = (s) => {
    const schema = stepSchemas[s];
    if (!schema) return { valid: true, errors: [] };

    if (s === 5 && reportData.riskLevel === "High") {
      const res = z
        .object({ recommendation: z.string().min(5) })
        .safeParse({ recommendation: reportData.recommendation });
      return res.success
        ? { valid: true, errors: [] }
        : { valid: false, errors: ["Recommendation required (min 5 chars)"] };
    }

    const res = schema.safeParse(reportData);
    return res.success
      ? { valid: true, errors: [] }
      : { valid: false, errors: res.error.errors.map((e) => e.message) };
  };

  /* ================= NAVIGATION ================= */
  const next = () => {
    const { valid, errors } = validateStep(step);
    if (!valid) {
      setErrors(errors);
      window.scrollTo(0, 0);
      return;
    }
    setErrors([]);
    setStep(step + 1);
  };

  const back = () => setStep(step - 1);

  /* ================= DRAFT ================= */
  useEffect(() => {
    (async () => {
      const storage = await getStorage();
      const draft = await storage.getItem(DRAFT_KEY);
      if (draft) setHasDraft(true);
    })();
  }, []);

  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      const storage = await getStorage();
      await storage.setItem(DRAFT_KEY, { reportData, step });
      setHasDraft(true);
    }, 800);
  }, [reportData, step]);

  /* ================= SUBMIT (FIXED) ================= */
  const handleSubmit = async () => {
    const res = fullSchema.safeParse(reportData);
    if (!res.success) {
      setErrors(res.error.errors.map((e) => e.message));
      window.scrollTo(0, 0);
      return;
    }

    try {
      const url = isEditing
        ? `http://localhost:${backendPort}/api/reports/${editId}`
        : `http://localhost:${backendPort}/api/reports`;
      
      const method = isEditing ? "PUT" : "POST";
      const headers = { "Content-Type": "application/json" };
      if (isEditing && API_KEY) {
        headers["x-api-key"] = API_KEY;
      }

      const resp = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(reportData),
      });

      const body = await resp.json();
      if (!resp.ok) throw new Error(body?.error || "Submit failed");

      const storage = await getStorage();
      await storage.removeItem(DRAFT_KEY);

      alert(isEditing ? "Report updated successfully!" : "Report submitted successfully!");
      setStep(1);
      setErrors([]);
      
      if (!isEditing) {
        setReportData({
          applicantName: "",
          inspectionDate: "",
          district: "",
          dsDivision: "",
          gnDivision: "",
          observations: "",
          riskLevel: "",
          recommendation: "",
          attachments: [],
        });
      }
    } catch (e) {
      setErrors(["Failed to submit report: " + e.message]);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditing ? "Edit Report" : "Create New Report"}
        </h1>
        {loading && <p className="text-sm text-gray-500 mt-2">Loading report data...</p>}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <div className="border-4 border-gray-300 border-t-blue-600 rounded-full w-8 h-8"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      )}

      {!loading && (
        <>
          <Progress step={step} />

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((e, i) => (
                  <li key={i}>• {e}</li>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && <Step1General data={reportData} setData={setReportData} next={next} />}
          {step === 2 && <Step2Location data={reportData} setData={setReportData} next={next} back={back} />}
          {step === 3 && <Step3Observations data={reportData} setData={setReportData} next={next} back={back} />}
          {step === 4 && <Step4Risk data={reportData} setData={setReportData} next={next} back={back} />}
          {step === 5 && <Step5Recommendations data={reportData} setData={setReportData} next={next} back={back} />}
          {step === 6 && <Step6Review data={reportData} back={back} onSubmit={handleSubmit} isEditing={isEditing} />}
        </>
      )}
    </div>
  );
}

/* ================= PROGRESS ================= */
function Progress({ step }) {
  const total = 6;
  return (
    <div className="flex items-center justify-between mb-10">
      {[...Array(total)].map((_, i) => {
        const idx = i + 1;
        const active = idx === step;
        const done = idx < step;
        return (
          <div key={idx} className="flex-1 flex items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all
              ${done ? "bg-green-500 text-white" : active ? "bg-blue-600 text-white scale-110 shadow-lg" : "bg-gray-200 text-gray-600"}`}
            >
              {idx}
            </div>
            {idx !== total && (
              <div className={`flex-1 h-[2px] mx-2 ${done ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

Progress.propTypes = { step: PropTypes.number.isRequired };