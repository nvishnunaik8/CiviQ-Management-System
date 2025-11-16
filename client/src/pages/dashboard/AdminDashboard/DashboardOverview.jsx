'use client';

import { useContext } from 'react';
import { ThemeContext } from '../../../Context/ThemeContext';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

export default function DashboardOverview({ issues }) {
  const { isDark } = useContext(ThemeContext);

  // ----- Statistics -----
  const pending = issues.filter(i => i.status === 'pending').length;
  const inProgress = issues.filter(i => i.status === 'inprogress').length;
  const completed = issues.filter(i => i.status === 'resolved').length;

  // ----- Pie Chart Data from Issues -----
  const priorities = ['high', 'medium', 'low'];
  const pieData = priorities.map(priority => ({
    name: priority.charAt(0).toUpperCase() + priority.slice(1),
    value: issues.filter(i => i.priority === priority).length || 0,
  }));
  const pieColors = ['#EF4444', '#F59E0B', '#10B981'];

  // ----- Bar Chart Data -----
  const barData = [
    { name: 'Pending', value: pending },
    { name: 'In Progress', value: inProgress },
    { name: 'Completed', value: completed },
  ];

  // ----- Line Chart Data -----
  const dateCounts = {};
  issues.forEach(i => {
    const date = new Date(i.createdAt).toLocaleDateString();
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });
  const lineData = Object.keys(dateCounts).map(date => ({ date, issues: dateCounts[date] }));

  return (
    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen p-6 space-y-10`}>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <p className="text-sm text-gray-400">Total Issues</p>
          <h3 className="text-2xl font-bold text-blue-500">{issues.length}</h3>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <p className="text-sm text-gray-400">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-500">{pending}</h3>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <p className="text-sm text-gray-400">In Progress</p>
          <h3 className="text-2xl font-bold text-blue-500">{inProgress}</h3>
        </div>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <p className="text-sm text-gray-400">Completed</p>
          <h3 className="text-2xl font-bold text-green-500">{completed}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <h3 className="text-xl font-bold mb-4">Issues by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ReBarChart data={barData}>
              <CartesianGrid stroke={isDark ? '#333' : '#eee'} />
              <XAxis dataKey="name" stroke={isDark ? '#ccc' : '#333'} />
              <YAxis stroke={isDark ? '#ccc' : '#333'} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </ReBarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
       {/* Pie Chart */}
{/* Pie Chart – Issues per Department */}
<div
  className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md flex flex-col items-center justify-center`}
>
  <h3 className="text-xl font-bold mb-4 text-center">Issues per Department</h3>

  {(() => {
    // --- Group issues by assigned_department ---
    const deptCounts = {};
    issues.forEach(i => {
      const dept = i.assigned_department || 'Unassigned';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });

    const pieData = Object.keys(deptCounts).map(name => ({
      name,
      value: deptCounts[name],
    }));

    const pieColors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];

    // --- Return chart or "no data" message ---
    return pieData.length > 0 ? (
      <div className="w-full h-[320px]">
        <ResponsiveContainer>
          <RePieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </RePieChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <p className="text-gray-400 text-center">No department data available</p>
    );
  })()}
</div>


      </div>

      {/* Line Chart */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
        <h3 className="text-xl font-bold mb-4">Issues Created Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ReLineChart data={lineData}>
            <CartesianGrid stroke={isDark ? '#333' : '#eee'} />
            <XAxis dataKey="date" stroke={isDark ? '#ccc' : '#333'} />
            <YAxis stroke={isDark ? '#ccc' : '#333'} />
            <Tooltip />
            <Line type="monotone" dataKey="issues" stroke="#10B981" />
          </ReLineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
