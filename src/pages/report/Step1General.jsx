import PropTypes from "prop-types";

export default function Step1General({ data, setData, next }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">General Information</h2>

      <input
        className="premium-input"
        placeholder="Applicant Name"
        value={data.applicantName}
        onChange={(e) => setData({ ...data, applicantName: e.target.value })}
      />

      <input
        type="date"
        className="premium-input mt-4"
        value={data.inspectionDate}
        onChange={(e) => setData({ ...data, inspectionDate: e.target.value })}
      />

      <button onClick={next} className="primary-btn mt-6">
        Next
      </button>
    </>
  );
}

Step1General.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  next: PropTypes.func,
};