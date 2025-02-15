'use client';

import { motion } from 'framer-motion';
import { 
  FiSearch, FiDatabase, FiGlobe, FiFileText, 
  FiClock, FiMonitor, FiMapPin, FiShield 
} from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const systemActivityData = [
  { time: '1h', value: 75 },
  { time: '2h', value: 10 },
  { time: '3h', value: 70 },
  { time: '4h', value: 70 },
  { time: '5h', value: 70 },
  { time: '6h', value: 10 },
  { time: '7h', value: 35 },
  { time: '8h', value: 10 },
  { time: '9h', value: 95 },
  { time: '10h', value: 15 },
  { time: '11h', value: 60 },
  { time: '12h', value: 35 },
];

const threatDetectionData = [
  { time: '1h', value: 7 },
  { time: '2h', value: 11 },
  { time: '3h', value: 11 },
  { time: '4h', value: 5 },
  { time: '5h', value: 4 },
  { time: '6h', value: 7 },
  { time: '7h', value: 19 },
  { time: '8h', value: 12 },
  { time: '9h', value: 4 },
  { time: '10h', value: 18 },
  { time: '11h', value: 19 },
  { time: '12h', value: 8 },
];

const menuItems = [
  { icon: FiSearch, label: 'OSINT Search' },
  { icon: FiDatabase, label: 'Data Sources' },
  { icon: FiGlobe, label: 'Social Analysis' },
  { icon: FiFileText, label: 'Metadata Analysis' },
  { icon: FiClock, label: 'History' },
  { icon: FiMonitor, label: 'Dark Web Monitor' },
  { icon: FiMapPin, label: 'Geolocation' },
];

export function Layout() {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        className="w-[280px] bg-[#0a0a0a] border-r border-white/10 p-4"
      >
        <div className="flex items-center gap-2 mb-8">
          <FiShield className="text-[#ff0000] text-2xl" />
          <div>
            <h1 className="text-xl font-semibold text-white">KaliumOSINT</h1>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="OSINT Search"
            className="search-input"
          />
        </div>

        <nav className="space-y-1">
          {menuItems.map(({ icon: Icon, label }) => (
            <button key={label} className="sidebar-item">
              <Icon className="text-xl" />
              {label}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
            <p className="text-gray-500">Welcome back, Administrator</p>
          </div>
          <button className="new-scan-button">
            New Scan
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          <div className="stat-card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400">Active Scans</h3>
              <FiSearch className="text-[#ff0000]" />
            </div>
            <div className="text-3xl font-semibold mb-2">12</div>
            <div className="text-sm">
              <span className="text-green-500">+2</span>
              <span className="text-gray-500 ml-1">vs last hour</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400">Data Sources</h3>
              <FiDatabase className="text-[#00e5ff]" />
            </div>
            <div className="text-3xl font-semibold mb-2">847</div>
            <div className="text-sm">
              <span className="text-green-500">+15</span>
              <span className="text-gray-500 ml-1">vs last hour</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400">Threats Detected</h3>
              <FiShield className="text-[#ff1493]" />
            </div>
            <div className="text-3xl font-semibold mb-2">3</div>
            <div className="text-sm">
              <span className="text-red-500">-1</span>
              <span className="text-gray-500 ml-1">vs last hour</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-gray-400">System Status</h3>
              <FiMonitor className="text-[#00e5ff]" />
            </div>
            <div className="text-3xl font-semibold mb-2">98.9%</div>
            <div className="text-sm">
              <span className="text-green-500">+0.2%</span>
              <span className="text-gray-500 ml-1">vs last hour</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="chart-container">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400">System Activity</h3>
              <div className="flex gap-2">
                <button className="text-gray-500 hover:text-white">
                  <FiSearch className="text-lg" />
                </button>
                <button className="text-gray-500 hover:text-white">
                  <FiClock className="text-lg" />
                </button>
              </div>
            </div>
            <LineChart
              width={500}
              height={300}
              data={systemActivityData}
              className="system-activity"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ background: '#141414', border: 'none' }}
                itemStyle={{ color: '#ff0000' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#ff0000" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </div>

          <div className="chart-container">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-400">Threat Detection</h3>
              <div className="flex gap-2">
                <button className="text-gray-500 hover:text-white">
                  <FiSearch className="text-lg" />
                </button>
                <button className="text-gray-500 hover:text-white">
                  <FiClock className="text-lg" />
                </button>
              </div>
            </div>
            <LineChart
              width={500}
              height={300}
              data={threatDetectionData}
              className="threat-detection"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ background: '#141414', border: 'none' }}
                itemStyle={{ color: '#00e5ff' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00e5ff" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
}