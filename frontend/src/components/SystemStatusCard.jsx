import { useEffect, useState } from "react";

export default function SystemStatusCard() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("/api/system/status")
      .then((res) => res.json())
      .then(setStatus)
      .catch((err) => console.error("Failed to fetch system status:", err));
  }, []);

  if (!status) return <div className="p-4 bg-gray-800 rounded">Loading...</div>;

  const memoryUsedPercent = ((status.memory.used / status.memory.total) * 100).toFixed(2);

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md">
      <h2 className="text-lg font-bold mb-2">System Status</h2>
      <ul className="space-y-1 text-sm mb-4">
        <li><strong>Uptime:</strong> {Math.floor(status.uptime / 60)} minutes</li>
        <li><strong>Load Avg:</strong> {status.load.join(", ")}</li>
        <li><strong>Memory Used:</strong> {memoryUsedPercent}%</li>
      </ul>

      <h3 className="text-md font-semibold mb-1">Disk Usage</h3>
      <ul className="space-y-1 text-sm">
        {status.disks.map((disk, index) => (
          <li key={index} className="border-b border-gray-700 pb-1">
            <strong>{disk.mountpoint}</strong> ({disk.filesystem}) – {disk.usePercent} used
          </li>
        ))}
      </ul>
    </div>
  );
}
