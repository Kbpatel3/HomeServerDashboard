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
      className="p-6 bg-zinc-800 text-zinc-100 rounded-xl shadow-lg max-h-[600px] overflow-auto"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">📂 Shared File Browser</h2>
        <button
          onClick={handleZipDownload}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
        >
          📦 Download as ZIP
        </button>
      </div>

      <div className="flex items-center justify-between mb-2 text-sm text-zinc-400">
        <span>Path: /{currentPath}</span>
        {currentPath && (
          <button className="hover:underline text-blue-400" onClick={handleGoBack}>
            ⬅ Up
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="bg-zinc-900 text-sm px-3 py-1 rounded w-full placeholder-gray-400"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleUpload}
        />
        <button
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
          onClick={() => fileInputRef.current.click()}
        >
          ⬆ Upload
        </button>
      </div>

      <ul className="space-y-2 text-sm font-mono">
        {filteredFiles.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center px-3 py-2 bg-zinc-900 rounded hover:bg-zinc-700"
          >
            <span
              className={`cursor-pointer ${
                item.type === "directory" ? "text-blue-400" : "text-zinc-200"
              }`}
              onClick={() => handleOpen(item)}
            >
              {item.type === "directory" ? "📁" : "📄"} {item.name}
            </span>
            {item.type === "file" && (
              <div className="text-right text-xs text-zinc-400 w-40">
                <div>{formatSize(item.size)}</div>
                <div>{formatDate(item.mtime)}</div>
                <button
                  className="text-green-400 hover:underline"
                  onClick={() => handleDownload(item)}
                >
                  Download
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
