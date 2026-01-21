import PropTypes from "prop-types";
export default function Step5Recommendations({ data, setData, next, back }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">5. Recommendations</h2>

      <textarea
        rows="4"
        className="border p-2 w-full mb-4"
        placeholder="Recommendations"
        value={data.recommendation}
        onChange={(e) =>
          setData({ ...data, recommendation: e.target.value })
        }
      />

      <div className="flex justify-between">
        <button onClick={back} className="px-4 py-2 border rounded">
          Back
        </button>
        <button onClick={next} className="bg-blue-700 text-white px-4 py-2 rounded">
          Review
        </button>
      </div>
    </>
  );
}

Step5Recommendations.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  next: PropTypes.func,
  back: PropTypes.func,
};
