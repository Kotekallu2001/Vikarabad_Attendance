
import React from 'react';

interface NavbarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setTab, isAuthenticated }) => {
  const navItems = [
    { id: 'home', label: 'Home', protected: false },
    { id: 'activity', label: 'Activity', protected: true },
    { id: 'mark', label: 'Mark Attendance', protected: true },
    { id: 'report', label: 'Report', protected: true },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab('home')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              StaffSync
            </span>
          </div>
          
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === item.id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  JD
                </div>
                <span className="hidden sm:inline text-sm text-slate-600">John Doe</span>
              </div>
            ) : (
              <button 
                onClick={() => setTab('activity')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
