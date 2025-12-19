
import React from 'react';
import { ViewState } from '../types';

interface SalesManagerProps {
  onNavigate: (view: ViewState) => void;
  onBack: () => void;
}

const SalesManager: React.FC<SalesManagerProps> = ({ onNavigate, onBack }) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900">Sales & Finance</h2>
        <p className="text-gray-500 mt-1">Marketplace operations and financial health tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <button
          onClick={() => onNavigate('ORDERS')}
          className="group relative bg-[#3d634d] p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 text-left overflow-hidden text-white"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-cart-flatbed text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black mb-2">Customer Orders</h3>
            <p className="text-green-100 leading-relaxed">Manage B2B sales, pricing per kg, and order delivery status.</p>
          </div>
          <div className="absolute top-0 right-0 p-8 text-white/10">
            <i className="fa-solid fa-tags text-8xl"></i>
          </div>
        </button>

        <button
          onClick={() => onNavigate('EXPENSES')}
          className="group relative bg-[#ffce6d] p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 text-left overflow-hidden text-gray-900"
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center text-gray-900 mb-8 group-hover:scale-110 transition-transform">
              <i className="fa-solid fa-receipt text-3xl"></i>
            </div>
            <h3 className="text-2xl font-black mb-2">Operating Expenses</h3>
            <p className="text-[#8a6a2a] leading-relaxed">Log seeds, fertilizer, labor, and utility costs to track ROI.</p>
          </div>
          <div className="absolute top-0 right-0 p-8 text-black/5">
            <i className="fa-solid fa-wallet text-8xl"></i>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SalesManager;
