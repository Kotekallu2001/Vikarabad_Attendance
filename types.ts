
export enum AttendanceStatus {
  WORKING = 'working',
  LEAVE = 'leave',
  HOLIDAY = 'holiday'
}

export interface AttendanceEntry {
  id: string;
  date: string; // ISO format
  status: AttendanceStatus;
  placeVisit?: string;
  purposeVisit?: string;
  hoursWorked?: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  isAuthenticated: boolean;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}
