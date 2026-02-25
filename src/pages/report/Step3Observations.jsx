import PropTypes from "prop-types";
import { useRef } from "react";

const backendPort = import.meta.env.VITE_BACKEND_PORT || '4000';

export default function Step3Observations({
  data,
  setData,
  next,
  back,
  errors = {},
}) {
  const fileRef = useRef(null);

  const MAX_SIZE = 5 * 1024 * 1024;
  const ALLOWED = ["image/jpeg", "image/png", "application/pdf"];

  const uploadFile = (file, onProgress) => {
    return new Promise((resolve, reject) => {
      const backendProtocol =
        window.location.protocol === "https:" ? "https:" : "http:";
      const host = window.location.hostname || "localhost";
      const uploadUrl = `${backendProtocol}//${host}:${backendPort}/api/upload`;

      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append("file", file);

      xhr.open("POST", uploadUrl);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const body = JSON.parse(xhr.responseText);
          if (body.ok && body.file) resolve(body.file);
          else reject(new Error(body.error || "Upload failed"));
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(fd);
    });
  };

  const onFiles = async (files) => {
    if (!files?.length) return;

    const nextAttachments = [...(data.attachments || [])];

    for (const file of Array.from(files)) {
      if (file.size > MAX_SIZE) {
        alert(`${file.name} exceeds 5MB`);
        continue;
      }
      if (!ALLOWED.includes(file.type)) {
        alert(`Unsupported type: ${file.type}`);
        continue;
      }

      const placeholder = {
        name: file.name,
        type: file.type,
        url: null,
        size: file.size,
        progress: 0,
        uploading: true,
      };

      nextAttachments.push(placeholder);
      setData({ ...data, attachments: [...nextAttachments] });

      try {
        const idx = nextAttachments.indexOf(placeholder);
        const uploaded = await uploadFile(file, (p) => {
          nextAttachments[idx].progress = p;
          setData({ ...data, attachments: [...nextAttachments] });
        });

        nextAttachments[idx] = {
          ...uploaded,
          progress: 100,
          uploading: false,
        };

        setData({ ...data, attachments: [...nextAttachments] });
      } catch (e) {
        alert(e.message);
        nextAttachments.splice(nextAttachments.indexOf(placeholder), 1);
        setData({ ...data, attachments: [...nextAttachments] });
      }
    }
  };

  const removeAttachment = (idx) => {
    const toRemove = data.attachments[idx];
    const updated = data.attachments.filter((_, i) => i !== idx);

    // If the file was already uploaded, request server-side deletion
    if (toRemove && toRemove.url && !toRemove.uploading) {
      // ask for confirmation before removing server file
      if (!window.confirm(`Remove attachment "${toRemove.name || 'file'}"? This will delete the file from the server.`)) {
        return;
      }

      try {
        const url = new URL(toRemove.url);
        // filename is after /uploads/
        const parts = url.pathname.split('/uploads/');
        const filename = parts.length > 1 ? parts[1] : null;
        if (filename) {
          const backendProtocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
          const host = window.location.hostname || 'localhost';
          const API_KEY = import.meta.env.VITE_API_KEY || null;
          const reportQuery = data && data.id ? `?reportId=${data.id}` : '';
          fetch(`${backendProtocol}//${host}:${backendPort}/api/uploads/${filename}${reportQuery}`, { 
            method: 'DELETE',
            headers: API_KEY ? { 'x-api-key': API_KEY } : {}
          })
            .then((r) => {
              if (!r.ok) throw new Error('Failed to delete file');
              setData({ ...data, attachments: updated });
            })
            .catch((e) => {
              alert('Failed to delete file on server: ' + e.message);
              // still remove from UI to avoid blocking, but you might want to keep it
              setData({ ...data, attachments: updated });
            });
          return;
        }
      } catch (e) {
        // fallthrough
      }
    }

    setData({ ...data, attachments: updated });
  };

  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Site Observations</h2>

      <textarea
        rows="5"
        className="premium-input"
        placeholder="Enter site observations"
        value={data.observations}
        onChange={(e) => setData({ ...data, observations: e.target.value })}
      />
      {errors.observations && (
        <p className="text-xs text-red-500 mt-1">{errors.observations}</p>
      )}

      {/* Upload Section */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Attachments :</label>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => onFiles(e.target.files)}
          className="hidden"
        />

        {/* Choose File Button */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2
               px-5 py-3 rounded-xl
               border-2 border-dashed border-gray-300
               text-sm font-medium text-gray-600
               hover:border-blue-500 hover:text-blue-600
               transition bg-gray-50"
        >
          📎 Choose Files
          <span className="text-xs text-gray-400">
            (JPG, PNG, PDF • Max 5MB)
          </span>
        </button>

        {/* Attachment Preview */}
        <div className="flex flex-wrap gap-4 mt-4">
          {(data.attachments || []).map((a, i) => (
            <div
              key={i}
              className="w-36 bg-white border rounded-xl
                   shadow-sm hover:shadow-md
                   transition p-2"
            >
              {a.url ? (
                a.type.startsWith("image/") ? (
                  <img
                    src={a.url}
                    alt={a.name}
                    className="h-20 w-full object-cover rounded mb-1"
                  />
                ) : (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 underline"
                  >
                    {a.name}
                  </a>
                )
              ) : (
                <div
                  className="h-20 flex items-center justify-center
                          text-xs bg-gray-100 rounded"
                >
                  Uploading…
                </div>
              )}

              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 rounded overflow-hidden mt-1">
                <div
                  className="h-2 bg-green-500 transition-all"
                  style={{ width: `${a.progress || 0}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => removeAttachment(i)}
                className="mt-1 text-xs text-center text-red-600 hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={back} className="secondary-btn">
          Back
        </button>
        <button onClick={next} className="primary-btn">
          Next
        </button>
      </div>
    </>
  );
}

Step3Observations.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  next: PropTypes.func,
  back: PropTypes.func,
  errors: PropTypes.object,
};
