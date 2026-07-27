import axios from "axios";
import { useState } from "react";
import { Upload, FileText, CheckCircle, XCircle } from "lucide-react";
import AdminLayout, { AdminCard, AdminBtn } from "../../Admin/AdminLayout";

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
    if (isUploading || selectedFiles.length === 0) {
      if (selectedFiles.length === 0) setStatus("Please select one or more CSV files.");
      return;
    }
    setIsUploading(true);
    setStatus("");

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("files", file);
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/upload/csv`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const pct = Math.round((e.loaded * 100) / e.total);
            setUploadProgress((p) => ({ ...p, [file.name]: pct }));
          },
        });
        setUploadProgress((p) => ({ ...p, [file.name]: 100 }));
      } catch {
        setUploadProgress((p) => ({ ...p, [file.name]: "error" }));
      }
    }

    setIsUploading(false);
    setStatus("All uploads finished!");
  };

  return (
    <AdminLayout title="Upload CSV" subtitle="Upload zipcode data files in bulk.">
      <div className="max-w-xl">
        <AdminCard>
          <div className="p-6 space-y-5">

            {/* Drop zone */}
            <label
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition py-10 px-4"
              style={{ borderColor: "var(--admin-border)", backgroundColor: "var(--admin-page-bg)" }}
            >
              <Upload size={28} style={{ color: "var(--admin-accent)" }} />
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: "var(--admin-text-primary)" }}>
                  Click to select CSV files
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--admin-text-secondary)" }}>
                  .csv files only, multiple allowed
                </p>
              </div>
              <input type="file" accept=".csv" multiple onChange={handleFileChange} className="hidden" />
            </label>

            {/* File list with progress */}
            {selectedFiles.length > 0 && (
              <ul className="space-y-2">
                {selectedFiles.map((file) => {
                  const prog = uploadProgress[file.name];
                  const isError = prog === "error";
                  const isDone = prog === 100;

                  return (
                    <li
                      key={file.name}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{ backgroundColor: "var(--admin-page-bg)", border: "1px solid var(--admin-border)" }}
                    >
                      <FileText size={16} style={{ color: "var(--admin-accent)", shrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--admin-text-primary)" }}>{file.name}</p>
                        {prog !== undefined && (
                          <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--admin-border)" }}>
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{
                                width: isError ? "100%" : `${prog}%`,
                                backgroundColor: isError ? "#ef4444" : isDone ? "#22c55e" : "var(--admin-accent)",
                              }}
                            />
                          </div>
                        )}
                      </div>
                      {isDone && <CheckCircle size={16} className="shrink-0 text-green-500" />}
                      {isError && <XCircle size={16} className="shrink-0 text-red-500" />}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Upload button */}
            <AdminBtn
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="w-full justify-center py-3"
            >
              <Upload size={15} />
              {isUploading ? "Uploading…" : "Upload Files"}
            </AdminBtn>

            {/* Status */}
            {status && (
              <p
                className="text-center text-sm font-medium"
                style={{ color: status.includes("finished") ? "#22c55e" : "var(--admin-accent)" }}
                role="alert"
              >
                {status}
              </p>
            )}
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
};

export default CsvUploader;
