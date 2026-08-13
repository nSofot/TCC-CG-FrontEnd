import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function MeetingMinutesPage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const FOLDER_ID = "1SC4CH4p5DNA5oNFhZae4ChgFln-5CzV_";

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("google_token");
console.log(token);
    if (!token) {
      setError("Google login required.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        "https://www.googleapis.com/drive/v3/files",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: `'${FOLDER_ID}' in parents and trashed=false`,
            fields: "files(id,name,mimeType,createdTime,webViewLink,thumbnailLink)",
            orderBy: "createdTime desc",
          },
        }
      );

console.log(res.data);

      const driveFiles = res.data.files || [];

      setFiles(driveFiles);

      if (driveFiles.length > 0) {
        setSelectedFile(driveFiles[0]);
      }
    } catch (err) {
      console.error(err.response?.data || err);

      const googleError = err.response?.data?.error;

      if (googleError?.message?.includes("insufficient authentication scopes")) {
        setError(
          "Your Google login does not have Google Drive permission. Please login again with Drive access."
        );

        localStorage.removeItem("google_token");
      } else if (err.response?.status === 401) {
        setError("Google session expired. Please login again.");
        localStorage.removeItem("google_token");
      } else if (err.response?.status === 403) {
        setError(googleError?.message || "Permission denied.");
      } else {
        setError("Unable to load meeting minutes.");
      }
    }

    setLoading(false);
  }


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-700 flex flex-col">
      <header className="p-6 shadow text-center text-white">
        <h1 className="text-3xl font-bold">
          Meeting Minutes
        </h1>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="w-80 bg-white border-r overflow-y-auto">

          <div className="p-4 border-b">
            <button
              onClick={fetchFiles}
              className="w-full rounded bg-blue-600 text-white py-2 hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          {loading && (
            <div className="p-4 text-gray-500">
              Loading...
            </div>
          )}

          {error && (
            <div className="m-4 rounded bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            files.length === 0 && (
              <div className="p-4 text-gray-500">
                No documents found.
              </div>
            )}

          {!loading &&
            files.map((file) => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className={`cursor-pointer border-b p-4 hover:bg-gray-100 ${
                  selectedFile?.id === file.id
                    ? "bg-blue-100"
                    : ""
                }`}
              >
                <div className="font-medium">
                  {file.name}
                </div>

                <div className="text-xs text-gray-500 mt-1">
                  {file.mimeType}
                </div>
              </div>
            ))}
        </div>

        <div className="flex-1 bg-gray-100 p-5">
          <div className="h-full rounded-xl bg-white shadow">

            {selectedFile ? (
              <iframe
                title="Meeting Minutes"
                src={`https://drive.google.com/file/d/${selectedFile.id}/preview`}
                className="w-full h-full rounded-xl"
                allow="autoplay"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                Select a document.
              </div>
            )}

          </div>
        </div>
      </div>

      <footer className="bg-blue-700 p-4 text-center">
        <Link
          to="/control"
          className="rounded bg-white px-6 py-2 text-blue-700 hover:bg-gray-100"
        >
          Go to Home
        </Link>
      </footer>
    </div>
  );
}