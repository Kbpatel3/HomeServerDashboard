import { useState } from "react";

export default function ServiceControlsCard() {
  const [alert, setAlert] = useState(null);
  const [output, setOutput] = useState("");

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleCommand = async (path, label, options = {}) => {
    if (
      options.confirm !== false &&
      !window.confirm(`Are you sure you want to run "${label}"?`)
    ) return;

    if (options.auth === "pin") {
      const entered = prompt("Enter the admin PIN:");
      if (entered !== import.meta.env.VITE_DASH_PIN) {
        showAlert("Incorrect PIN.", "error");
        return;
      }
    }

    try {
      const res = await fetch(`/api/commands/${path}`, { method: "POST" });
      const data = await res.json();
      if (path === "update" && data.message) {
        setOutput(data.message);
      }
      showAlert(data.message || "Command executed successfully.");
    } catch {
      showAlert("Command failed.", "error");
    }
  };

  const handleServiceRestart = async () => {
    const service = prompt("Enter service name to restart (e.g., nginx):");
    if (!service) return;
    await handleCommand(`restart/${service}`, `Restart ${service}`);
  };

  return (
    <div className="p-6 bg-zinc-800 text-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-semibold">🖥️ System Commands</h2>

      {alert && (
        <div
          className={`px-4 py-2 rounded text-sm transition-all ${
            alert.type === "success"
              ? "bg-emerald-600"
              : alert.type === "error"
              ? "bg-rose-600"
              : "bg-yellow-600"
          }`}
        >
          {alert.msg}
        </div>
      )}

      <button
        className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-medium"
        onClick={() => handleCommand("update", "Update System")}
      >
        🔄 Update System
      </button>

      {output && (
        <pre className="bg-black text-green-400 text-xs p-3 rounded max-h-[200px] overflow-y-auto whitespace-pre-wrap border border-zinc-700">
          {output}
        </pre>
      )}

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-medium"
        onClick={handleServiceRestart}
      >
        🔁 Restart a Service
      </button>

      <button
        className="w-full bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded font-medium"
        onClick={() => handleCommand("reboot", "Reboot Server", { auth: "pin" })}
      >
        ⚠️ Reboot Server
      </button>

      <button
        className="w-full bg-red-700 hover:bg-red-800 px-4 py-2 rounded font-medium"
        onClick={() => handleCommand("shutdown", "Shutdown Server", { auth: "pin" })}
      >
        🔻 Shutdown Server
      </button>
    </div>
  );
}
