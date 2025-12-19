
import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'HOME', icon: 'fa-table-columns', label: 'Dashboard' },
    { id: 'HARVEST', icon: 'fa-basket-shopping', label: 'Harvest Logs' },
    { id: 'WORK', icon: 'fa-list-check', label: 'Tasks' },
    { id: 'ORDERS', icon: 'fa-cart-shopping', label: 'Orders' },
    { id: 'EXPENSES', icon: 'fa-file-invoice-dollar', label: 'Expenses' },
    { id: 'REPORTS', icon: 'fa-chart-simple', label: 'Reports' },
    { id: 'SETTINGS', icon: 'fa-gear', label: 'Settings' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-100 flex flex-col p-6 z-40">
      <div className="flex flex-col gap-1 mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3d634d] rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100">
            <i className="fa-solid fa-seedling text-xl"></i>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#1a1c1e]">WEERA</span>
        </div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-13">Agriculture (PVT) LTD</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
            
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#3d634d] text-white shadow-lg shadow-green-100' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-green-600'}`}></i>
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-50">
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=3d634d&color=fff" alt="User" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">Admin Weera</p>
            <p className="text-[10px] text-gray-400 font-medium">PREMIUM PLAN</p>
          </div>
        </div>
        <div className="mt-3 px-2 text-center">
          <a href="http://www.weera.lk" target="_blank" rel="noopener noreferrer" className="text-[9px] font-bold text-blue-500 hover:underline">www.weera.lk</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
