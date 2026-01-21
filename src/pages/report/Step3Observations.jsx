import PropTypes from "prop-types";

export default function Step3Observations({ data, setData, next, back }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">3. Site Observations</h2>

      <textarea
        rows="5"
        className="border p-2 w-full mb-4"
        placeholder="Enter site observations"
        value={data.observations}
        onChange={(e) =>
          setData({ ...data, observations: e.target.value })
        }
      />

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

 Step3Observations.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  next: PropTypes.func,
  back: PropTypes.func,
};


