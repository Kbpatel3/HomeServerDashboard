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

    // Optional auth for critical actions
    if (options.auth && options.auth === "pin") {
      const entered = prompt("Enter the admin pin:");
      if (entered !== import.meta.env.VITE_DASH_PIN) {
        showAlert("Incorrect pin.", "error");
        return;
      }
    }

    try {
      const res = await fetch(`/api/commands/${path}`, {
        method: "POST",
      });
      const data = await res.json();
      if (path === "update") setOutput(data.message || "");
      showAlert(data.message || "Command executed.", "success");
    } catch {
      showAlert("Command failed.", "error");
    }
  };

  const handleServiceRestart = async () => {
    const service = prompt("Enter service name to restart (e.g. nginx):");
    if (!service) return;
    await handleCommand(`restart/${service}`, `restart ${service}`);
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded shadow-md space-y-4">
      <h2 className="text-lg font-bold">System Commands</h2>

      {alert && (
        <div
          className={`px-4 py-2 rounded text-sm ${
            alert.type === "success"
              ? "bg-green-600"
              : alert.type === "error"
              ? "bg-red-600"
              : "bg-yellow-600"
          }`}
        >
          {alert.msg}
        </div>
      )}

      <button
        className="bg-yellow-600 hover:bg-yellow-700 px-4 py-1 rounded w-full"
        onClick={() => handleCommand("update", "Update System")}
      >
        Update System
      </button>

      {output && (
        <pre className="bg-black text-green-300 text-xs p-2 rounded max-h-[200px] overflow-auto whitespace-pre-wrap">
          {output}
        </pre>
      )}

      <button
        className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded w-full"
        onClick={handleServiceRestart}
      >
        Restart a Service
      </button>

      <button
        className="bg-orange-600 hover:bg-orange-700 px-4 py-1 rounded w-full"
        onClick={() => handleCommand("reboot", "Reboot", { auth: "pin" })}
      >
        Reboot Server
      </button>

      <button
        className="bg-red-700 hover:bg-red-800 px-4 py-1 rounded w-full"
        onClick={() => handleCommand("shutdown", "Shutdown", { auth: "pin" })}
      >
        Shutdown Server
      </button>
    </div>
  );
}
