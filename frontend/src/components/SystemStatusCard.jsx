import { useEffect, useState } from "react";

export default function SystemStatusCard() {
  const [status, setStatus] = useState(null);

  const fetchStatus = () => {
    fetch("/api/system/status")
      .then((res) => res.json())
      .then(setStatus)
      .catch((err) => console.error("Failed to fetch system status:", err));
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (!status) return <div className="p-4 bg-gray-800 rounded">Loading...</div>;

  const memoryUsedPercent = ((status.memory.used / status.memory.total) * 100).toFixed(2);

  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <div className="p-6 bg-zinc-800 text-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">📊 System Status</h2>
      <ul className="space-y-1 text-sm mb-4 text-zinc-300">
        <li><span className="font-semibold text-white">Uptime:</span> {formatUptime(status.uptime)}</li>
        <li><span className="font-semibold text-white">Load Average:</span> {status.load.join(", ")}</li>
        <li><span className="font-semibold text-white">Memory Used:</span> {memoryUsedPercent}%</li>
      </ul>

      <h3 className="text-md font-semibold mb-2 text-white">💽 Disk Usage</h3>
      <ul className="space-y-2 text-sm">
        {status.disks.map((disk, index) => (
          <li
            key={index}
            className="bg-black/40 p-2 rounded flex justify-between items-center text-sm"
          >
            <span className="font-mono text-zinc-100">
              {disk.mountpoint} <span className="text-zinc-400">({disk.filesystem})</span>
            </span>
            <span className="text-green-400 font-bold">{disk.usePercent} used</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
