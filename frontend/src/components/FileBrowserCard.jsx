import { useEffect, useState, useRef } from "react";

export default function FileBrowserCard() {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef();

  const fetchFiles = (path = "") => {
    fetch(`/api/files/list?path=${encodeURIComponent(path)}`)
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || []);
        setFilteredFiles(data.files || []);
        setCurrentPath(data.path || "");
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleOpen = (item) => {
    if (item.type === "directory") {
      fetchFiles(`${currentPath}/${item.name}`.replace(/^\/+/, ""));
    }
  };

  const handleDownload = (file) => {
    const url = `/api/files/download?path=${encodeURIComponent(currentPath + "/" + file.name)}`;
    window.open(url, "_blank");
  };

  const handleZipDownload = () => {
    const url = `/api/files/download-zip?path=${encodeURIComponent(currentPath)}`;
    window.open(url, "_blank");
  };

  const handleGoBack = () => {
    const parts = currentPath.split("/").filter(Boolean);
    if (parts.length === 0) return;
    parts.pop();
    fetchFiles(parts.join("/"));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const term = e.target.value.toLowerCase();
    setFilteredFiles(
      files.filter((f) => f.name.toLowerCase().includes(term))
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    uploadFiles(files);
  };

  const handleUpload = () => {
    const files = fileInputRef.current.files;
    uploadFiles(files);
  };

  const uploadFiles = (files) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    formData.append("path", currentPath);

    fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(() => fetchFiles(currentPath));
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  return (
    <div
      className="p-4 bg-gray-800 text-white rounded shadow-md max-h-[600px] overflow-auto"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-bold mb-2">Shared File Browser</h2>

      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-400">Path: /{currentPath || ""}</span>
        {currentPath && (
          <button className="text-blue-400 hover:underline" onClick={handleGoBack}>
            ⬅️ Up
          </button>
        )}
      </div>

      <div className="mb-3 flex gap-2">
        <input
          type="text"
          className="text-black px-2 py-1 rounded w-full"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
          onClick={handleZipDownload}
        >
          📦 ZIP
        </button>
      </div>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="text-sm text-gray-200 mb-3"
        onChange={handleUpload}
      />

      <ul className="text-sm space-y-1 font-mono">
        {filteredFiles.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center hover:bg-gray-700 px-2 py-1 rounded"
          >
            <span
              className={`cursor-pointer flex-grow ${
                item.type === "directory" ? "text-blue-400" : "text-gray-200"
              }`}
              onClick={() => handleOpen(item)}
            >
              {item.type === "directory" ? "📁 " : "📄 "}
              {item.name}
            </span>
            {item.type === "file" && (
              <div className="flex flex-col text-right text-xs text-gray-400 w-32 shrink-0">
                <span>{formatSize(item.size)}</span>
                <span>{formatDate(item.mtime)}</span>
                <button
                  className="text-green-400 hover:underline text-sm"
                  onClick={() => handleDownload(item)}
                >
                  Download
                </button>
              </div>
            )}
            {item.type === "file" && (
              <button
                className="text-green-400 hover:underline"
                onClick={() => handleDownload(item)}
              >
                Download
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
