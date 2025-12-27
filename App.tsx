
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Activity from './components/Activity';
import MarkAttendance from './components/MarkAttendance';
import AttendanceReport from './components/AttendanceReport';
import { User } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    setUser({
      id: '1',
      name: 'John Doe',
      role: 'Staff',
      isAuthenticated: true
    });
  };

  const renderContent = () => {
    // Protected logic
    if (['activity', 'mark', 'report'].includes(currentTab) && !user?.isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentTab) {
      case 'home':
        return <Home />;
      case 'activity':
        return <Activity />;
      case 'mark':
        return <MarkAttendance />;
      case 'report':
        return <AttendanceReport />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        currentTab={currentTab} 
        setTab={setCurrentTab} 
        isAuthenticated={!!user?.isAuthenticated} 
      />
      
      <main className="pb-20">
        {renderContent()}
      </main>

      <footer className="py-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} StaffSync Pro. Built with ❤️ for productive teams.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
