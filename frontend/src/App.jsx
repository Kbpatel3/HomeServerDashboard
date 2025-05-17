import SystemStatusCard from "./components/SystemStatusCard";
import SystemInfoCard from "./components/SystemInfoCard";
import Fail2BanCard from "./components/Fail2BanCard";
import ServiceControlsCard from "./components/ServiceControlsCard";
import FileBrowserCard from "./components/FileBrowserCard";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 px-6 py-8 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 tracking-tight">
        TechStacks Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SystemStatusCard />
        <SystemInfoCard />
        <Fail2BanCard />
      </div>

      <div className="my-10">
        <ServiceControlsCard />
      </div>

      <div>
        <FileBrowserCard />
      </div>
    </div>
  );
}
