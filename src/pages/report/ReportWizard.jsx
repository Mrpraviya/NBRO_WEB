import { useState } from "react";
import PropTypes from "prop-types";
import Step1General from "./Step1General";
import Step2Location from "./Step2Location";
import Step3Observations from "./Step3Observations";
import Step4Risk from "./Step4Risk";
import Step5Recommendations from "./Step5Recommendations";
import Step6Review from "./Step6Review";

export default function ReportWizard() {
  const [step, setStep] = useState(1);

  const [reportData, setReportData] = useState({
    applicantName: "",
    inspectionDate: "",
    district: "",
    dsDivision: "",
    gnDivision: "",
    observations: "",
    riskLevel: "",
    recommendation: "",
  });

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 mt-6 shadow rounded">
      <Progress step={step} />

      {step === 1 && (
        <Step1General data={reportData} setData={setReportData} next={next} />
      )}
      {step === 2 && (
        <Step2Location data={reportData} setData={setReportData} next={next} back={back} />
      )}
      {step === 3 && (
        <Step3Observations data={reportData} setData={setReportData} next={next} back={back} />
      )}
      {step === 4 && (
        <Step4Risk data={reportData} setData={setReportData} next={next} back={back} />
      )}
      {step === 5 && (
        <Step5Recommendations data={reportData} setData={setReportData} next={next} back={back} />
      )}
      {step === 6 && (
        <Step6Review data={reportData} back={back} />
      )}
    </div>
  );
}

function Progress({ step }) {
  return (
    <p className="text-center text-sm text-gray-600 mb-4">
      Step {step} of 6
    </p>
  );
}

Progress.propTypes = {
  step: PropTypes.number.isRequired,
};
