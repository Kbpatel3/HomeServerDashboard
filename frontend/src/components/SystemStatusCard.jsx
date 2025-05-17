import { useEffect, useState } from "react";

export default function SystemStatusCard() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("/api/system/status")
      .then((res) => res.json())
      .then(setStatus)
      .catch((err) => console.error("Failed to fetch system status:", err));
  }, []);

  if (!status) {
    return (
      <div className="p-6 bg-zinc-800 text-white rounded-xl shadow-md">
        <span className="text-sm text-gray-300">Loading system status...</span>
      </div>
    );
  }

  const memoryUsedPercent = ((status.memory.used / status.memory.total) * 100).toFixed(2);

  return (
    <div className="p-6 bg-zinc-800 text-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">📊 System Status</h2>

      <ul className="text-sm space-y-2 text-zinc-300 mb-4">
        <StatusRow label="Uptime" value={`${Math.floor(status.uptime / 60)} minutes`} />
        <StatusRow label="Load Average" value={status.load.join(", ")} />
        <StatusRow label="Memory Used" value={`${memoryUsedPercent}%`} />
      </ul>

      <h3 className="text-lg font-medium mb-2 text-zinc-100">💾 Disk Usage</h3>
      <div className="space-y-2 text-sm text-zinc-300">
        {status.disks.map((disk, index) => (
          <div
            key={index}
            className="flex justify-between items-center border border-zinc-700 rounded px-3 py-2 bg-zinc-900"
          >
            <div>
              <span className="font-medium text-zinc-100">{disk.mountpoint}</span>{" "}
              <span className="text-xs text-zinc-400">({disk.filesystem})</span>
            </div>
            <span className="text-right text-emerald-400 font-semibold">{disk.usePercent} used</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusRow({ label, value }) {
  return (
    <li className="flex justify-between">
      <span className="text-zinc-100 font-medium">{label}:</span>
      <span className="text-right">{value}</span>
    </li>
  );
}
