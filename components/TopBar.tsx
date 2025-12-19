
import React from 'react';

interface TopBarProps {
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onLogout }) => {
  const syncConfig = JSON.parse(localStorage.getItem('syncConfig') || '{}');
  const isCloudEnabled = !!syncConfig.googleSheetUrl;

  return (
    <div className="h-20 flex items-center justify-between px-8 bg-transparent">
      <div className="flex items-center gap-6 flex-1">
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
           <span className="text-orange-400"><i className="fa-solid fa-sun text-sm"></i></span>
           <span className="text-sm font-bold">28°</span>
           <span className="text-xs text-gray-500 font-medium">Today is partly sunny day!</span>
        </div>
        
        <div className="relative max-w-md w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="w-full pl-12 pr-4 py-2.5 rounded-full bg-white border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-100 transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Cloud Status Indicator */}
        <div className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all ${
          isCloudEnabled ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'
        }`}>
          <i className={`fa-solid ${isCloudEnabled ? 'fa-cloud-check' : 'fa-cloud-slash'}`}></i>
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isCloudEnabled ? 'Cloud Sync On' : 'Local Mode'}
          </span>
        </div>

        <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-100 text-gray-400 hover:text-green-600 relative">
          <i className="fa-solid fa-bell"></i>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-white border border-gray-100 rounded-full flex items-center gap-3 hover:bg-red-50 transition-colors"
        >
          <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">
            <i className="fa-solid fa-power-off"></i>
          </div>
          <span className="text-sm font-bold text-gray-700">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
