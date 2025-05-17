import { useEffect, useState } from "react";

export default function SystemInfoCard() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch("/api/system/info")
      .then((res) => res.json())
      .then(setInfo)
      .catch((err) => console.error("Failed to fetch system info:", err));
  }, []);

  if (!info) return <div className="p-4 bg-gray-800 rounded">Loading...</div>;

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">System Info</h2>
      <ul className="space-y-1 text-sm">
        <li><strong>Hostname:</strong> {info.hostname}</li>
        <li><strong>Platform:</strong> {info.platform} {info.arch}</li>
        <li><strong>OS Release:</strong> {info.release}</li>
        <li><strong>CPU:</strong> {info.cpuModel} ({info.cpuCount} cores)</li>
        <li><strong>Total Memory:</strong> {(info.totalMemory / 1e9).toFixed(1)} GB</li>
        <li><strong>Free Memory:</strong> {(info.freeMemory / 1e9).toFixed(1)} GB</li>
        <li><strong>Uptime:</strong> {Math.floor(info.uptime / 60)} minutes</li>
        <li><strong>System Time:</strong> {info.time}</li>
      </ul>
    </div>
  );
}
