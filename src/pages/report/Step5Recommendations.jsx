import PropTypes from "prop-types";

export default function Step5Recommendations({ data, setData, next, back }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Recommendations</h2>

      <textarea
        rows="4"
        className="premium-input"
        placeholder="Recommendations"
        value={data.recommendation}
        onChange={(e) => setData({ ...data, recommendation: e.target.value })}
      />

      <div className="flex justify-between mt-6">
        <button onClick={back} className="secondary-btn">Back</button>
        <button onClick={next} className="primary-btn">Review</button>
      </div>
    </>
  );
}

Step5Recommendations.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  next: PropTypes.func,
  back: PropTypes.func,
};