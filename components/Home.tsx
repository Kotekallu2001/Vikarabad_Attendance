
import React from 'react';

const Home: React.FC = () => {
  const portfolioItems = [
    { title: 'Project Management Tool', desc: 'Enterprise-level task tracking', img: 'https://picsum.photos/400/300?random=1' },
    { title: 'Analytics Dashboard', desc: 'Real-time data visualization', img: 'https://picsum.photos/400/300?random=2' },
    { title: 'HR Management Suite', desc: 'Complete staff lifecycle tracking', img: 'https://picsum.photos/400/300?random=3' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          Simplify Your <span className="text-indigo-600">Workforce</span> Management
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
          The all-in-one solution for tracking staff attendance, managing field visits, and gaining actionable insights into your team's performance.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
            Get Started
          </button>
          <button className="bg-white text-indigo-600 border border-indigo-100 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all">
            View Demo
          </button>
        </div>
      </div>

      {/* Showcase Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Our Portfolio</h2>
          <span className="text-indigo-600 font-medium cursor-pointer hover:underline">View All Projects →</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioItems.map((item, idx) => (
            <div key={idx} className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: '📅', title: 'Easy Attendance', body: 'Mark working hours with a single click.' },
          { icon: '📍', title: 'Location Tracking', body: 'Log visits and purposes precisely.' },
          { icon: '📊', title: 'Smart Reports', body: 'AI-powered insights for better decisions.' },
          { icon: '📄', title: 'Sheet Export', body: 'Seamlessly sync with Google Spreadsheets.' },
        ].map((feat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-3xl mb-4">{feat.icon}</div>
            <h4 className="font-bold text-slate-900 mb-2">{feat.title}</h4>
            <p className="text-slate-500 text-sm">{feat.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
