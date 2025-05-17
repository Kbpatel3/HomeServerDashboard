import { useEffect, useState } from "react";

export default function Fail2BanCard() {
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Fail2Ban status
  const fetchStatus = () => {
    fetch("/api/fail2ban/status")
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
        setLoading(false);
      });
  };

  // Fetch Fail2Ban logs
  const fetchLogs = () => {
    fetch("/api/fail2ban/logs")
      .then(res => res.json())
      .then(data => setLogs(data.logs));
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();

    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  const handleRestart = () => {
    fetch("/api/fail2ban/restart", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Restarted.");
        fetchStatus();
        fetchLogs();
      })
      .catch(() => alert("Failed to restart Fail2Ban"));
  };

  if (loading) return <div className="p-4 bg-gray-800 rounded">Loading...</div>;

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md max-h-[600px] overflow-auto">
      <h2 className="text-lg font-bold mb-2">Fail2Ban Status</h2>
      <pre className="text-sm mb-4 whitespace-pre-wrap">{status}</pre>

      <button
        className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded mb-4"
        onClick={handleRestart}
      >
        Restart Fail2Ban
      </button>

      <h3 className="text-md font-semibold mb-1">Recent Logs</h3>
      <div className="text-xs bg-gray-900 p-2 rounded whitespace-pre-wrap max-h-[300px] overflow-y-auto font-mono">
        {logs?.split("\n").map((line, index) => {
          const isBan = /ban/i.test(line);
          return (
            <div
              key={index}
              className={isBan ? "text-red-400 font-bold" : "text-gray-300"}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
