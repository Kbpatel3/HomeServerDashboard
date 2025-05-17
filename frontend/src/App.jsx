import React from 'react';
import SystemStatusCard from './components/SystemStatusCard';
import SystemInfoCard from './components/SystemInfoCard';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">TechStacks Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SystemStatusCard />
        <SystemInfoCard />
      </div>
    </div>
  );
}

export default App
