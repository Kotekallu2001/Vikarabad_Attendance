
import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay } from 'date-fns';
import { attendanceService } from '../services/attendanceService';
import { AttendanceEntry, AttendanceStatus } from '../types';

const AttendanceReport: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    setEntries(attendanceService.getAttendance());
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getStatusForDay = (day: Date) => {
    return entries.find(e => isSameDay(new Date(e.date), day));
  };

  const exportToCSV = () => {
    if (entries.length === 0) return;
    
    const headers = ["Date", "Status", "Place of Visit", "Purpose", "Hours Worked"];
    const rows = entries.map(e => [
      e.date,
      e.status,
      e.placeVisit || "",
      `"${e.purposeVisit?.replace(/"/g, '""') || ""}"`,
      e.hoursWorked || 0
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Attendance Report</h2>
          <p className="text-slate-500">Visual breakdown of your work history</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full border border-slate-100">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600">Working</span>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white px-3 py-1 rounded-full border border-slate-100">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-slate-600">Leave/Holiday</span>
          </div>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <h2 className="text-2xl font-bold text-indigo-600">{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">{d}</div>
          ))}

          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square"></div>
          ))}

          {days.map((day, i) => {
            const entry = getStatusForDay(day);
            const isWorking = entry?.status === AttendanceStatus.WORKING;
            const isOff = entry?.status === AttendanceStatus.LEAVE || entry?.status === AttendanceStatus.HOLIDAY;

            return (
              <div
                key={i}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl relative border transition-all ${
                  isWorking ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm' :
                  isOff ? 'bg-red-50 border-red-100 text-red-700 shadow-sm' :
                  'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className="text-lg font-bold">{format(day, 'd')}</span>
                {entry && (
                  <span className="text-[10px] font-bold mt-1 uppercase opacity-60">
                    {entry.status}
                  </span>
                )}
                {entry?.hoursWorked && (
                  <div className="absolute top-1 right-2 text-[10px] font-bold opacity-40">
                    {entry.hoursWorked}h
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Visit Log History</h3>
          <span className="text-xs text-slate-400 font-medium">{entries.length} entries recorded</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Place</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4 text-right">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{format(new Date(entry.date), 'MMM dd, yyyy')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      entry.status === AttendanceStatus.WORKING ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{entry.placeVisit || '-'}</td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{entry.purposeVisit || '-'}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-900">{entry.hoursWorked || 0}h</td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">No attendance records found yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
