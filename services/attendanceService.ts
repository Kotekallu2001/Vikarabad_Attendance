
import { AttendanceEntry, AttendanceStatus } from '../types';

const STORAGE_KEY = 'staff_sync_attendance_data';

// REPLACEME: Paste your Google Apps Script Web App URL here
export const SPREADSHEET_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbw9kyp_Dv5P-lxX7Xh1D6BAtDXOsAkHpnLP_KZPaa-uyHkh4TQTslV3V6uAwzK2q8tr8w/exec'; 

export const attendanceService = {
  getAttendance: (): AttendanceEntry[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveAttendance: async (entry: Omit<AttendanceEntry, 'id'>): Promise<{ success: boolean; error?: string }> => {
    const currentData = attendanceService.getAttendance();
    const newEntry: AttendanceEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    // 1. Save locally first (Always succeeds)
    const index = currentData.findIndex(e => e.date === entry.date);
    if (index !== -1) {
      currentData[index] = { ...newEntry, id: currentData[index].id };
    } else {
      currentData.push(newEntry);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));

    // 2. Sync to Google Spreadsheet
    if (SPREADSHEET_WEBAPP_URL) {
      try {
        // We use text/plain to avoid CORS preflight (OPTIONS) requests which Apps Script doesn't handle.
        // Google Apps Script will still receive the JSON string in e.postData.contents.
        await fetch(SPREADSHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors', 
          headers: { 
            'Content-Type': 'text/plain;charset=utf-8' 
          },
          body: JSON.stringify(newEntry)
        });
        
        console.log('Data sent to Google Sheets successfully');
        return { success: true };
      } catch (err) {
        console.error('Spreadsheet Sync Failed:', err);
        return { success: false, error: 'Connection error. Data saved on your device.' };
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    }
  },

  getStats: () => {
    const data = attendanceService.getAttendance();
    const workingDays = data.filter(e => e.status === AttendanceStatus.WORKING).length;
    const leaveDays = data.filter(e => e.status === AttendanceStatus.LEAVE).length;
    const holidayDays = data.filter(e => e.status === AttendanceStatus.HOLIDAY).length;
    const totalHours = data.reduce((acc, curr) => acc + (curr.hoursWorked || 0), 0);

    return { workingDays, leaveDays, holidayDays, totalHours };
  }
};
