import PropTypes from "prop-types";
export default function Step6Review({ data, back }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">6. Review Report</h2>

      <pre className="bg-gray-100 p-4 rounded text-sm mb-4">
        {JSON.stringify(data, null, 2)}
      </pre>

      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 border rounded">
          Back
        </button>
        <button
          onClick={() => alert("Report submitted successfully")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Submit Report
        </button>
      </div>
    </>
  );
}

Step6Review.propTypes = {
  data: PropTypes.object.isRequired,
  back: PropTypes.func.isRequired,
};
