import { useEffect, useState } from "react";

export default function SystemInfoCard() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetch("/api/system/info")
      .then((res) => res.json())
      .then(setInfo)
      .catch((err) => console.error("Failed to fetch system info:", err));
  }, []);

  if (!info) {
    return (
      <div className="p-6 bg-zinc-800 text-white rounded-xl shadow-md">
        <span className="text-sm text-gray-300">Loading system info...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-zinc-800 text-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">🧠 System Info</h2>
      <div className="text-sm space-y-2 text-zinc-300">
        <InfoRow label="Hostname" value={info.hostname} />
        <InfoRow label="Platform" value={`${info.platform} (${info.arch})`} />
        <InfoRow label="OS Release" value={info.release} />
        <InfoRow label="CPU" value={`${info.cpuModel} (${info.cpuCount} cores)`} />
        <InfoRow
          label="Total Memory"
          value={`${(info.totalMemory / 1e9).toFixed(1)} GB`}
        />
        <InfoRow
          label="Free Memory"
          value={`${(info.freeMemory / 1e9).toFixed(1)} GB`}
        />
        <InfoRow label="Uptime" value={`${Math.floor(info.uptime / 60)} minutes`} />
        <InfoRow label="System Time" value={info.time} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="font-medium text-zinc-100">{label}:</span>
      <span className="text-right">{value}</span>
    </div>
  );
}