import { useEffect, useState } from "react";

export default function Fail2BanCard() {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fail2ban/status")
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
        setLoading(false);
      });

    fetch("/api/fail2ban/logs")
      .then(res => res.json())
      .then(data => setLogs(data.logs));
  }, []);

  const handleRestart = () => {
    fetch("/api/fail2ban/restart", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Restarted.");
      })
      .catch(() => alert("Failed to restart Fail2Ban"));
  };

  if (loading) return <div className="p-4 bg-gray-800 rounded">Loading...</div>;

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md max-h-[500px] overflow-auto">
      <h2 className="text-lg font-bold mb-2">Fail2Ban Status</h2>
      <pre className="text-sm mb-4 whitespace-pre-wrap">{status}</pre>

      <button
        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded mb-4"
        onClick={handleRestart}
      >
        Restart Fail2Ban
      </button>

      <h3 className="text-md font-semibold mb-1">Recent Logs</h3>
      <pre className="text-xs bg-gray-900 p-2 rounded whitespace-pre-wrap max-h-[200px] overflow-y-auto">
        {logs}
      </pre>
    </div>
  );
}
