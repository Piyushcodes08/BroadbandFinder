import axios from "axios";
import { useState } from "react";
import Sidebar from "../../Admin/Sidebar";

const CsvUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
    setUploadProgress({});
    setStatus("");
  };

  const handleUpload = async () => {
    if (isUploading) return;
    if (selectedFiles.length === 0) {
      setStatus("Please select one or more CSV files.");
      return;
    }

    setIsUploading(true);
    setStatus("");

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append("files", file);

      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/csv`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prev) => ({
              ...prev,
              [file.name]: percentCompleted,
            }));
          },
        });

        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: 100, // mark as complete
        }));
      } catch (err) {
        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: "error",
        }));
      }
    }

    setIsUploading(false);
    setStatus("All uploads finished!");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Upload Multiple CSV Files
          </h2>

          {/* File Input */}
          <input
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileChange}
            className="block w-full text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F47630] focus:border-[#F47630] p-2 transition"
          />

          {/* Selected Files List with Progress */}
          {selectedFiles.length > 0 && (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-6 gap-4 text-sm text-gray-700">
              {selectedFiles.map((file) => (
                <li
                  key={file.name}
                  className="flex flex-col items-start bg-gray-50 border border-gray-200 p-3 rounded-md shadow-sm"
                >
                  <span className="truncate w-full font-medium mb-1 flex items-center gap-2">
                    📄 {file.name}
                  </span>

                  {/* Progress bar */}
                  {uploadProgress[file.name] !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          uploadProgress[file.name] === "error"
                            ? "bg-[#E8611A]"
                            : "bg-green-600"
                        }`}
                        style={{
                          width:
                            uploadProgress[file.name] === "error"
                              ? "100%"
                              : `${uploadProgress[file.name]}%`,
                        }}
                        aria-label={
                          uploadProgress[file.name] === "error"
                            ? "Upload failed"
                            : `Upload progress: ${uploadProgress[file.name]}%`
                        }
                        role="progressbar"
                        aria-valuenow={
                          uploadProgress[file.name] === "error"
                            ? 0
                            : uploadProgress[file.name]
                        }
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`mt-6 w-full px-5 py-3 rounded-lg text-white font-semibold transition ${
              isUploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#E8611A] hover:bg-[#C44E12]"
            }`}
            aria-busy={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>

          {/* Status Message */}
          {status && (
            <p
              className={`mt-4 text-center text-sm font-medium ${
                status.toLowerCase().includes("finished")
                  ? "text-green-600"
                  : "text-[#E8611A]"
              }`}
              role="alert"
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsvUploader;
