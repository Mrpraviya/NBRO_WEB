import PropTypes from "prop-types";

export default function Step4Risk({ data, setData, next, back }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Risk Assessment</h2>

      <select
        className="premium-input"
        value={data.riskLevel}
        onChange={(e) => setData({ ...data, riskLevel: e.target.value })}
      >
        <option value="">Select Risk Level</option>
        <option>Low</option>
        <option>Moderate</option>
        <option>High</option>
      </select>

      <div className="flex justify-between mt-6">
        <button onClick={back} className="secondary-btn">Back</button>
        <button onClick={next} className="primary-btn">Next</button>
      </div>
    </>
  );
}

Step4Risk.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  next: PropTypes.func,
  back: PropTypes.func,
};