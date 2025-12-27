
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { attendanceService, SPREADSHEET_WEBAPP_URL } from '../services/attendanceService';
import { AttendanceStatus } from '../types';

const MarkAttendance: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Form State
  const [status, setStatus] = useState<AttendanceStatus>(AttendanceStatus.WORKING);
  const [place, setPlace] = useState('');
  const [purpose, setPurpose] = useState('');
  const [hours, setHours] = useState('8');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const result = await attendanceService.saveAttendance({
      date: format(selectedDate, 'yyyy-MM-dd'),
      status,
      placeVisit: status === AttendanceStatus.WORKING ? place : '',
      purposeVisit: status === AttendanceStatus.WORKING ? purpose : '',
      hoursWorked: Number(hours)
    });
    
    setIsSubmitting(false);
    
    if (result.success) {
      setStatusMessage({ type: 'success', text: 'Success! Synced to Sheet.' });
    } else {
      setStatusMessage({ type: 'error', text: result.error || 'Sync failed, saved locally.' });
    }

    setTimeout(() => {
      if (result.success) {
        setStatusMessage(null);
        setSelectedDate(null);
        setPlace('');
        setPurpose('');
      }
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Mark Attendance</h2>
          <p className="text-slate-500">Select a date to log your daily activity</p>
        </div>
        {SPREADSHEET_WEBAPP_URL && (
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider">Spreadsheet Active</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Calendar Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">{format(currentDate, 'MMMM yyyy')}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 mb-4 tracking-widest">
            <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`pad-${i}`} className="h-12 md:h-16"></div>
            ))}
            
            {days.map((day, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={`h-12 md:h-16 flex flex-col items-center justify-center rounded-2xl transition-all border ${
                  selectedDate && isSameDay(day, selectedDate)
                    ? 'bg-indigo-600 text-white border-indigo-600 scale-105 shadow-xl shadow-indigo-100 z-10'
                    : 'hover:border-indigo-200 hover:bg-indigo-50 border-slate-100 text-slate-700 bg-white'
                }`}
              >
                <span className="text-lg font-bold">{format(day, 'd')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <div>
          {selectedDate ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden transition-all">
              {statusMessage && (
                <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center animate-in fade-in duration-300 ${
                  statusMessage.type === 'success' ? 'bg-white/95' : 'bg-red-50/95'
                }`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl ${
                    statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {statusMessage.type === 'success' ? '✓' : '!'}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{statusMessage.text}</h3>
                  <p className="text-slate-500 text-sm mt-1 mb-6 text-center px-8">
                    {statusMessage.type === 'success' 
                      ? 'The data has been dispatched to your Google Spreadsheet.' 
                      : 'We saved it on this device, but could not reach the Spreadsheet.'}
                  </p>
                  {statusMessage.type === 'success' && (
                     <p className="text-xs text-indigo-600 font-bold animate-bounce">Updating view...</p>
                  )}
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-slate-900">Details for {format(selectedDate, 'MMM dd, yyyy')}</h3>
                <button onClick={() => setSelectedDate(null)} className="text-slate-400 hover:text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Work Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: AttendanceStatus.WORKING, label: 'Work', icon: '💼' },
                      { id: AttendanceStatus.LEAVE, label: 'Leave', icon: '🏖️' },
                      { id: AttendanceStatus.HOLIDAY, label: 'Holiday', icon: '🎈' },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        type="button"
                        onClick={() => setStatus(btn.id)}
                        className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${
                          status === btn.id
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-inner'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl mb-1">{btn.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-tighter">{btn.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {status === AttendanceStatus.WORKING && (
                  <div className="space-y-5 animate-in slide-in-from-top-4 duration-500">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Place of Visit</label>
                      <input
                        type="text"
                        required
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all bg-slate-50/50"
                        placeholder="e.g. Client HQ, Site B..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Purpose of Visit</label>
                      <textarea
                        required
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all bg-slate-50/50 min-h-[120px]"
                        placeholder="What was the main goal?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Hours Logged</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="1"
                          max="24"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="flex-1 accent-indigo-600"
                        />
                        <span className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold min-w-[60px] text-center">
                          {hours}h
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Syncing...</span>
                    </>
                  ) : (
                    'Finalize & Sync'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm mb-6 animate-bounce">
                👆
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Log?</h3>
              <p className="text-slate-500 max-w-xs mb-8">Click any date on the calendar to begin your daily report sync.</p>
              
              <div className="bg-white p-4 rounded-2xl border border-slate-100 text-left shadow-sm max-w-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-sm">💡</span>
                  <p className="text-sm font-bold text-slate-700">Quick Tip</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Make sure you've shared the Spreadsheet with <strong>Anyone with the link</strong> in your Google Script settings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
