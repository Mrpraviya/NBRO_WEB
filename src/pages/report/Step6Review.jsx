import PropTypes from "prop-types";

export default function Step6Review({ data, back, onSubmit }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">
        Review Inspection Report
      </h2>

      {/* Basic Info */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-3 text-sm">
        <div><strong>Applicant:</strong> {data.applicantName}</div>
        <div><strong>Date:</strong> {data.inspectionDate}</div>
        <div><strong>District:</strong> {data.district}</div>
        <div><strong>DS Division:</strong> {data.dsDivision}</div>
        <div><strong>GN Division:</strong> {data.gnDivision}</div>
        <div><strong>Risk Level:</strong> {data.riskLevel}</div>
      </div>

      {/* Observations */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Observations</h3>
        <p className="bg-gray-50 rounded-xl p-4 text-sm">
          {data.observations}
        </p>
      </div>

      {/* Recommendations */}
      {data.recommendation && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Recommendations</h3>
          <p className="bg-gray-50 rounded-xl p-4 text-sm">
            {data.recommendation}
          </p>
        </div>
      )}

      {/* 🔥 Attachments Section */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Attachments</h3>

        {data.attachments?.length ? (
          <div className="flex flex-wrap gap-4">
            {data.attachments.map((file, i) => (
              <div
                key={i}
                className="w-40 bg-white border rounded-xl
                           shadow-sm p-2"
              >
                {file.type?.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-24 w-full object-cover rounded mb-1"
                  />
                ) : (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline block mb-1"
                  >
                    {file.name}
                  </a>
                )}

                <div className="text-[11px] text-gray-500 truncate">
                  {file.name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No attachments uploaded
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-10">
        <button onClick={back} className="secondary-btn">
          Back
        </button>

        <button
          onClick={() => onSubmit(data)}
          className="primary-btn"
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
  onSubmit: PropTypes.func.isRequired,
};