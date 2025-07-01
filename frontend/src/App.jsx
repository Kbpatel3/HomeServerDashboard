import SystemStatusCard from "./components/SystemStatusCard";
import SystemInfoCard from "./components/SystemInfoCard";
import Fail2BanCard from "./components/Fail2BanCard";
import ServiceControlsCard from "./components/ServiceControlsCard";
import FileBrowserCard from "./components/FileBrowserCard";
import GameServerControlCard from "./components/GameServerControlCard";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 px-6 py-8 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-tight">
        TechStacks Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(role === "admin" || role === "friend") && <SystemStatusCard />}
        {(role === "admin" || role === "friend") && <SystemInfoCard />}
        {(role === "admin" || role === "friend") && <Fail2BanCard />}
      </div>

      <div className="my-10">
        {role === "admin" && <ServiceControlsCard />}
        {(role === "admin" || role === "friend") && <GameServerControlCard />}
      </div>

      <div>
        {role === "admin" && <FileBrowserCard />}
      </div>
    </div>
  );
}
