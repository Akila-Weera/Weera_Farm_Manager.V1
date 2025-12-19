
import React from 'react';
import { ViewState } from '../types';

interface FarmManagerProps {
  onNavigate: (view: ViewState) => void;
  onBack: () => void;
}

const FarmManager: React.FC<FarmManagerProps> = ({ onNavigate, onBack }) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900">Fields Management</h2>
        <p className="text-gray-500 mt-1">Manage greenhouse conditions and labor assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <button
          onClick={() => onNavigate('HARVEST')}
          className="group relative bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-green-500 hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-8 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-basket-shopping text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Harvests</h3>
            <p className="text-gray-500 leading-relaxed">Log new yields and track greenhouse productivity over time.</p>
          </div>
          <div className="absolute top-0 right-0 p-8 text-gray-50 group-hover:text-green-50 transition-colors">
            <i className="fa-solid fa-seedling text-8xl"></i>
          </div>
        </button>

        <button
          onClick={() => onNavigate('WORK')}
          className="group relative bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:border-[#f59e0b] hover:shadow-2xl transition-all duration-300 text-left overflow-hidden"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-8 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-clipboard-list text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Work Records</h3>
            <p className="text-gray-500 leading-relaxed">Track labor hours, specific tasks, and specialized greenhouse maintenance.</p>
          </div>
          <div className="absolute top-0 right-0 p-8 text-gray-50 group-hover:text-orange-50 transition-colors">
            <i className="fa-solid fa-users-gear text-8xl"></i>
          </div>
        </button>
      </div>
    </div>
  );
};

export default FarmManager;
