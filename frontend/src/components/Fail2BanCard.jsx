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

  if (loading) {
    return (
      <div className="bg-zinc-800 p-6 rounded-lg shadow-md text-zinc-200">
        <p>Loading Fail2Ban data...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-zinc-800 p-6 rounded-xl shadow-lg text-zinc-100 flex flex-col gap-4 max-h-[600px] overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">🚫 Fail2Ban Status</h2>
        <button
          onClick={handleRestart}
          className="bg-red-600 hover:bg-red-700 text-sm text-white font-medium py-1 px-3 rounded transition"
        >
          Restart
        </button>
      </div>
  
      <div className="bg-zinc-900 p-4 rounded-md text-sm font-mono whitespace-pre-wrap border border-zinc-700">
        {status}
      </div>
  
      <div>
        <h3 className="text-lg font-medium mb-2">📜 Recent Logs</h3>
        <div className="bg-black p-3 rounded-md text-xs font-mono max-h-60 overflow-y-auto border border-zinc-700 space-y-1">
          {logs?.split("\n").map((line, index) => {
            // Highlight IPs in red
            const highlighted = line.replace(
              /\b\d{1,3}(\.\d{1,3}){3}\b/g,
              (ip) => `<span class='text-red-400 font-semibold'>${ip}</span>`
            );
  
            let className = "text-zinc-300";
            if (/ban/i.test(line)) className = "text-red-400 font-semibold";
            else if (/found/i.test(line)) className = "text-yellow-400";
  
            return (
              <div
                key={index}
                className={className}
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
