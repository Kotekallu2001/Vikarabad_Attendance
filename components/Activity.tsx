
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { attendanceService } from '../services/attendanceService';
import { getDashboardInsights } from '../services/geminiService';
import { AttendanceEntry } from '../types';

const Activity: React.FC = () => {
  const [stats, setStats] = useState(attendanceService.getStats());
  const [data, setData] = useState<AttendanceEntry[]>(attendanceService.getAttendance());
  const [insights, setInsights] = useState<string>('Loading AI insights...');

  useEffect(() => {
    const fetchInsights = async () => {
      const result = await getDashboardInsights(data);
      setInsights(result || "Maintain consistent tracking to unlock better insights.");
    };
    fetchInsights();
  }, [data]);

  const chartData = [
    { name: 'Work', value: stats.workingDays, color: '#4f46e5' },
    { name: 'Leave', value: stats.leaveDays, color: '#ef4444' },
    { name: 'Holiday', value: stats.holidayDays, color: '#f59e0b' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Activity Dashboard</h2>
          <p className="text-slate-500">Overview of staff participation and productivity</p>
        </div>
        <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
          Updated 1 min ago
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Hours', value: stats.totalHours, icon: '⏱️', trend: '+12%' },
          { label: 'Work Days', value: stats.workingDays, icon: '📅', trend: '+2' },
          { label: 'Leaves Taken', value: stats.leaveDays, icon: '🏖️', trend: '-1' },
          { label: 'Retention Rate', value: '98%', icon: '📈', trend: 'Stable' },
        ].map((m, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">{m.label}</p>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">{m.value}</h4>
              <p className="text-xs text-emerald-600 font-bold mt-2">{m.trend}</p>
            </div>
            <div className="text-2xl opacity-80">{m.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Attendance Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-white/20 p-2 rounded-lg">✨</span>
              <h3 className="font-bold text-lg">AI Smart Insights</h3>
            </div>
            <div className="space-y-4 text-indigo-50 leading-relaxed whitespace-pre-wrap">
              {insights}
            </div>
          </div>
          <button className="mt-8 bg-white/20 hover:bg-white/30 transition-all text-white text-sm py-2 rounded-xl border border-white/20">
            Generate Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default Activity;
