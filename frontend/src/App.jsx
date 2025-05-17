import React from 'react';
import SystemStatusCard from './components/SystemStatusCard';
import SystemInfoCard from './components/SystemInfoCard';
import Fail2BanCard from './components/Fail2BanCard';
import ServiceControlsCard from './components/ServiceControlsCard';
import FileBrowserCard from './components/FileBrowserCard';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">TechStacks Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SystemStatusCard />
        <SystemInfoCard />
        <Fail2BanCard />
        <ServiceControlsCard />
        <FileBrowserCard />
      </div>
    </div>
  );
}

export default App;
