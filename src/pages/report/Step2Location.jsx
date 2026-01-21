 import PropTypes from "prop-types";

function Step2Location({ data, setData, next, back }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">2. Location Details</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="District"
        value={data.district}
        onChange={(e) =>
          setData({ ...data, district: e.target.value })
        }
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="DS Division"
        value={data.dsDivision}
        onChange={(e) =>
          setData({ ...data, dsDivision: e.target.value })
        }
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="GN Division"
        value={data.gnDivision}
        onChange={(e) =>
          setData({ ...data, gnDivision: e.target.value })
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

/* 👇 ADD THIS */
Step2Location.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
};

export default Step2Location;
