import PropTypes from "prop-types";

export default function Step2Location({ data, setData, next, back }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Location Details</h2>

      <input className="premium-input" placeholder="District"
        value={data.district}
        onChange={(e) => setData({ ...data, district: e.target.value })} />

      <input className="premium-input mt-4" placeholder="DS Division"
        value={data.dsDivision}
        onChange={(e) => setData({ ...data, dsDivision: e.target.value })} />

      <input className="premium-input mt-4" placeholder="GN Division"
        value={data.gnDivision}
        onChange={(e) => setData({ ...data, gnDivision: e.target.value })} />

      <div className="flex justify-between mt-6">
        <button onClick={back} className="secondary-btn">Back</button>
        <button onClick={next} className="primary-btn">Next</button>
      </div>
    </>
  );
}

Step2Location.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  next: PropTypes.func,
  back: PropTypes.func,
};