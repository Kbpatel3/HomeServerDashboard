import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function GameServerControlCard() {
  const [status, setStatus] = useState("Idle");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setStatus("Running...");
    setLoading(true);
    setOutput("");

    try {
      const res = await fetch(`/api/commands/vintagestory/${action}`, {
        method: "POST",
      });
      const data = await res.json();
      setStatus(data.success ? "Success" : "Failed");
      setOutput(data.output);
    } catch (err) {
      setStatus("Error");
      setOutput("Failed to send command.");
      console.error("Error executing command:", err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">🎮 Vintage Story Server</h2>
      <div className="flex space-x-3 mb-2">
        <Button onClick={() => handleAction("start")} disabled={loading}>
          Start
        </Button>
        <Button
          onClick={() => handleAction("stop")}
          variant="destructive"
          disabled={loading}
        >
          Stop
        </Button>
      </div>
      <p className="text-sm text-gray-300 mb-1">Status: {status}</p>
      <pre className="bg-black text-green-300 p-2 rounded max-h-40 overflow-y-auto text-xs whitespace-pre-wrap">
        {output}
      </pre>
    </div>
  );
}
