import PropTypes from "prop-types";

export default function Step1General({ data, setData, next }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">1. General Information</h2>

      <input
        className="border p-2 w-full mb-4"
        placeholder="Applicant Name"
        value={data.applicantName}
        onChange={(e) =>
          setData({ ...data, applicantName: e.target.value })
        }
      />

      <input
        type="date"
        className="border p-2 w-full mb-4"
        value={data.inspectionDate}
        onChange={(e) =>
          setData({ ...data, inspectionDate: e.target.value })
        }
      />

      <button
        onClick={next}
        className="bg-blue-700 text-white px-6 py-2 rounded"
      >
        Next
      </button>
    </>
  );
}

Step1General.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
};
