import PropTypes from "prop-types";
export default function Step4Risk({ data, setData, next, back }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">4. Risk Assessment</h2>

      <select
        className="border p-2 w-full mb-4"
        value={data.riskLevel}
        onChange={(e) =>
          setData({ ...data, riskLevel: e.target.value })
        }
      >
        <option value="">Select Risk Level</option>
        <option value="Low">Low</option>
        <option value="Moderate">Moderate</option>
        <option value="High">High</option>
      </select>

      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 border rounded">
          Back
        </button>
        <button onClick={next} className="bg-blue-700 text-white px-4 py-2 rounded">
          Next
        </button>
      </div>
    </>
  );
}

Step4Risk.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  next: PropTypes.func,
  back: PropTypes.func,
};
